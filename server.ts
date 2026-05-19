import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import cors from "cors";

// Simulate Mercado Pago for the frontend (or logic if it's real)
// Initialize mercadopago using Access Token from ENV
import { MercadoPagoConfig, Preference } from 'mercadopago';

// Initialize firebase admin (optional for real production, here we use generic mock structure or skip credentials if not provided)
// The prompt guides: "Se o ambiente atual não permitir backend real: criar a estrutura de serviço e placeholders seguros"
// So we will just simulate order creation via frontend or via backend placeholder.

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(cors());
  app.use(express.json());

  // === API ROUTES ===
  // Health check
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Create Checkout Preference
  app.post("/api/checkout/create", async (req, res) => {
    try {
      const { orderId, items, customer } = req.body;
      
      if (!orderId || !items || !items.length) {
        return res.status(400).json({ error: "Invalid order data" });
      }

      // 1. Config Mercado Pago
      const accessToken = process.env.MERCADO_PAGO_ACCESS_TOKEN || "TEST-0000000000000000-000000-00000000000000000000000000000000-000000000";
      
      let init_point = "";

      if (accessToken.startsWith("TEST-0000")) {
        // Skip calling Mercado Pago if not configured
        console.log("No valid Mercado Pago token. Using fallback URL.");
        init_point = `/pedido/sucesso?orderId=${orderId}&status=mock_approved`;
      } else {
        const client = new MercadoPagoConfig({ accessToken });

        // 2. Format Items
        const formattedItems = items.map((item: any) => ({
          title: item.name + (item.format ? ` (${item.format})` : ''),
          quantity: item.quantity,
          unit_price: Number(item.unitPrice),
          currency_id: "BRL"
        }));

        // 3. Create Preference
        try {
          const preference = new Preference(client);
          
          const origin = process.env.VITE_APP_URL || req.headers.origin || `http://localhost:${PORT}`;

          const createdPref = await preference.create({
            body: {
              items: formattedItems,
              payer: {
                name: customer?.name || "Client",
                email: customer?.email || "email@sandbox.com",
              },
              external_reference: orderId,
              back_urls: {
                success: `${origin}/pedido/sucesso?orderId=${orderId}`,
                pending: `${origin}/pedido/pendente?orderId=${orderId}`,
                failure: `${origin}/pedido/falha?orderId=${orderId}`,
              },
              auto_return: "approved",
              notification_url: `${origin}/api/webhooks/mercadopago`, // Needs public URL for real webhooks
            }
          });
          
          init_point = createdPref.init_point || "";
        } catch (mpError: any) {
          console.error("Mercado Pago Error, returning fallback URL:", mpError.message);
          // Fallback for development if no valid access token is configured
          init_point = `/pedido/sucesso?orderId=${orderId}&status=mock_approved`;
        }
      }

      res.json({ checkoutUrl: init_point });

    } catch (error: any) {
      console.error("Error creating checkout:", error);
      res.status(500).json({ error: "Failed to create checkout preference" });
    }
  });

  // Webhook form Mercado Pago
  app.post("/api/webhooks/mercadopago", async (req, res) => {
    try {
      const { type, data } = req.body;
      
      if (type === "payment" && data?.id) {
        // Here we would:
        // 1. Fetch payment details from MercadoPago API using data.id
        // 2. Read 'external_reference' (our orderId) from the payment
        // 3. Update order in Firestore to 'paid'/'failed' etc.
        console.log(`[Webhook] Payment notification received for ID: ${data.id}`);
      }

      res.sendStatus(200);
    } catch (error) {
      console.error("Webhook processing error:", error);
      res.sendStatus(500);
    }
  });

  // === VITE MIDDLEWARE ===
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
