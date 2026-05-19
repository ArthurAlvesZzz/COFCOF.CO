import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { CartItem, Product } from '../types';

interface CartState {
  items: CartItem[];
  isCartOpen: boolean;
  addItem: (product: Product, format: string, quantity?: number) => void;
  removeItem: (productId: string, format: string) => void;
  updateQuantity: (productId: string, format: string, quantity: number) => void;
  toggleCart: () => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      addItem: (product, format, quantity = 1) => set((state) => {
        const existingItem = state.items.find(i => i.product.id === product.id && i.format === format);
        if (existingItem) {
          return {
            items: state.items.map(i => 
              i.product.id === product.id && i.format === format 
                ? { ...i, quantity: i.quantity + quantity }
                : i
            ),
            isCartOpen: true
          };
        }
        return { 
          items: [...state.items, { product, format, quantity }],
          isCartOpen: true 
        };
      }),
      removeItem: (productId, format) => set((state) => ({
        items: state.items.filter(i => !(i.product.id === productId && i.format === format))
      })),
      updateQuantity: (productId, format, quantity) => set((state) => ({
        items: state.items.map(i => 
          i.product.id === productId && i.format === format 
            ? { ...i, quantity: Math.max(0, quantity) }
            : i
        ).filter(i => i.quantity > 0)
      })),
      toggleCart: () => set((state) => ({ isCartOpen: !state.isCartOpen })),
      clearCart: () => set({ items: [] }),
      getCartTotal: () => {
        const { items } = get();
        return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
      }
    }),
    {
      name: 'cofcof-cart',
    }
  )
);
