export function openWhatsApp(phone: string, message: string) {
  if (!phone) {
    alert("Número de WhatsApp não informado.");
    return;
  }
  const cleanPhone = phone.replace(/\D/g, '');
  const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank', 'noopener,noreferrer');
}
