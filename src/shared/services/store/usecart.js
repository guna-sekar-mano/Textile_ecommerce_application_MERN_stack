import { create } from 'zustand'
import { persist } from 'zustand/middleware';
import { getcartItems } from '../apicart/apicart';

const useCartStore = create(
  persist(
    (set, get) => ({
      cart: [],
      
      setCartItems: (items) => {
        const currentCart = get().cart;
        
        const mergedItems = items.map(apiItem => {
          const localItem = currentCart.find(localItem => {
            if (apiItem._id === localItem._id) return true;
            
            if (apiItem.variantId && localItem.variantId) {
              return apiItem.variantId === localItem.variantId && apiItem.selectedSize === localItem.selectedSize;
            }
            
            return false;
          });
          
          if (localItem && apiItem.variantId && !apiItem.productId) {
            return {
              ...apiItem,
              variant_name: localItem.variant_name,
              variant_images: localItem.variant_imagesw,
              Product_Name: localItem.Product_Name,
              Images: localItem.Images,
              sizes: localItem.sizes,
              price: localItem.price,
              sale_price: localItem.sale_price,
              description: localItem.description,
              material_care: localItem.material_care,
              tags: localItem.tags,
              Product_type: localItem.Product_type,
              gender: localItem.gender,
              stock: localItem.stock,
              status: localItem.status
            };
          }
          
          return apiItem;
        });
        
        set({ cart: mergedItems });
      },
      
      addToCart: (product) => set((state) => {
        const existingItem = state.cart.find((item) => {
          if (product.variantId && item.variantId) {
            return item.variantId === product.variantId && item.selectedSize === product.selectedSize;
          }
          
          return item._id === product._id && item.selectedSize === product.selectedSize;
        });
        
        if (existingItem) {
          return {
            cart: state.cart.map((item) =>
              item === existingItem ? { ...item, Quantity: (item.Quantity || 1) + 1 } : item
            ),
          };
        }
        
        return { cart: [...state.cart, { ...product, Quantity: 1 }] };
      }),
      
      removeFromCart: (itemId) => set((state) => ({ cart: state.cart.filter((item) => item._id !== itemId) })),
        
      updateQuantity: (itemId, Quantity) => set((state) => ({ cart: state.cart.map((item) => item._id === itemId ? { ...item, Quantity } : item ) })),
        
      clearCart: () => set(() => ({ cart: [] })),

      fetchCartItems: async (email) => {
        try {
          const response = await getcartItems(email);
          
          if (response && Array.isArray(response.response)) {
            set({ cart: response.response });
          } else {
            set({ cart: [] });
          }
        } catch (error) {
          set({ cart: [] });
        }
      },
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);

export default useCartStore;