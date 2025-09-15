import { create } from 'zustand'
import { persist } from 'zustand/middleware';

const useCartStore = create(
  persist(
    (set) => ({
      cart: [],
      setCartItems: (items) => set({ cart: items }),
      addToCart: (book) => set((state) => {
        const existingBook = state.cart.find((item) => item._id === book._id);
        if (existingBook) {
          return {
            cart: state.cart.map((item) =>
              item._id === book._id ? { ...item, quantity: item.quantity + 1 } : item
            ),
          };
        }
        return { cart: [...state.cart, { ...book, quantity: 1 }] };
      }),
      removeFromCart: (bookId) =>
        set((state) => ({
          cart: state.cart.filter((item) => item._id !== bookId),
        })),
      updateQuantity: (bookId, quantity) =>
        set((state) => ({
          cart: state.cart.map((item) =>
            item._id === bookId ? { ...item, quantity } : item
          ),
        })),
        clearCart: () =>
          set(() => ({
            cart: [],
          })),
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;
