import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Product, calculateProductPrice } from '@services/productApi';
import { STUDENT } from '@constants/student';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  changeQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  getTotalQuantity: () => number;
  getTotalAmount: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product: Product, quantity: number = 1) => {
        set(state => {
          const existingIndex = state.items.findIndex(i => i.product.id === product.id);
          if (existingIndex > -1) {
            const updatedItems = [...state.items];
            updatedItems[existingIndex] = {
              ...updatedItems[existingIndex],
              quantity: updatedItems[existingIndex].quantity + quantity,
            };
            return { items: updatedItems };
          }
          return { items: [...state.items, { product, quantity }] };
        });
      },

      removeFromCart: (productId: number) => {
        set(state => ({
          items: state.items.filter(i => i.product.id !== productId),
        }));
      },

      changeQuantity: (productId: number, quantity: number) => {
        set(state => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(i => i.product.id !== productId),
            };
          }
          return {
            items: state.items.map(item =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotalQuantity: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getTotalAmount: () => {
        return get().items.reduce((total, item) => {
          const unitPrice = calculateProductPrice(item.product.price);
          return total + unitPrice * item.quantity;
        }, 0);
      },
    }),
    {
      name: `ktxgo-cart-${STUDENT.mssv}`,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
