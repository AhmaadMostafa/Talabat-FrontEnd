import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { basketApi } from '@/lib/api'
import type { Basket, BasketItem, BasketTotals, Product } from '@/types'
import { createBasket } from '@/types'
import { toast } from 'react-hot-toast'

interface BasketState {
  basket: Basket | null
  basketTotals: BasketTotals | null
  isLoading: boolean
  
  // Actions
  getBasket: (id: string) => Promise<void>
  setBasket: (basket: Basket) => Promise<void>
  addItemToBasket: (product: Product, quantity?: number) => Promise<void>
  incrementItemQuantity: (item: BasketItem) => Promise<void>
  decrementItemQuantity: (item: BasketItem) => Promise<void>
  removeItemFromBasket: (item: BasketItem) => Promise<void>
  deleteBasket: () => Promise<void>
  calculateTotals: () => void
  createPaymentIntent: () => Promise<void>
  setShippingPrice: (shippingPrice: number, deliveryMethodId: number) => void
  clearBasket: () => void
}

export const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      basket: null,
      basketTotals: null,
      isLoading: false,

      getBasket: async (id: string) => {
        set({ isLoading: true })
        try {
          const basket = await basketApi.getBasket(id)
          set({ basket, isLoading: false })
          get().calculateTotals()
        } catch (error) {
          set({ isLoading: false })
          console.error('Failed to get basket:', error)
        }
      },

      setBasket: async (basket: Basket) => {
        try {
          const updatedBasket = await basketApi.setBasket(basket)
          set({ basket: updatedBasket })
          get().calculateTotals()
          localStorage.setItem('basket_id', updatedBasket.id)
        } catch (error) {
          console.error('Failed to set basket:', error)
          throw error
        }
      },

      addItemToBasket: async (product: Product, quantity = 1) => {
        const itemToAdd: BasketItem = {
          id: product.id,
          productName: product.name,
          price: product.price,
          pictureUrl: product.pictureUrl,
          quantity,
          brand: product.brand,
          category: product.category,
        }

        let basket = get().basket
        if (!basket) {
          basket = createBasket()
        }

        const existingItemIndex = basket.items.findIndex(item => item.id === itemToAdd.id)
        
        if (existingItemIndex !== -1) {
          basket.items[existingItemIndex].quantity += quantity
        } else {
          basket.items.push(itemToAdd)
        }

        await get().setBasket(basket)
        toast.success('Item added to basket')
      },

      incrementItemQuantity: async (item: BasketItem) => {
        const basket = get().basket
        if (!basket) return

        const itemIndex = basket.items.findIndex(x => x.id === item.id)
        if (itemIndex !== -1) {
          basket.items[itemIndex].quantity++
          await get().setBasket(basket)
        }
      },

      decrementItemQuantity: async (item: BasketItem) => {
        const basket = get().basket
        if (!basket) return

        const itemIndex = basket.items.findIndex(x => x.id === item.id)
        if (itemIndex !== -1) {
          if (basket.items[itemIndex].quantity > 1) {
            basket.items[itemIndex].quantity--
            await get().setBasket(basket)
          } else {
            await get().removeItemFromBasket(item)
          }
        }
      },

      removeItemFromBasket: async (item: BasketItem) => {
        const basket = get().basket
        if (!basket) return

        basket.items = basket.items.filter(i => i.id !== item.id)
        
        if (basket.items.length > 0) {
          await get().setBasket(basket)
        } else {
          await get().deleteBasket()
        }
        
        toast.success('Item removed from basket')
      },

      deleteBasket: async () => {
        const basket = get().basket
        if (!basket) return

        try {
          await basketApi.deleteBasket(basket.id)
          localStorage.removeItem('basket_id')
          set({ basket: null, basketTotals: null })
        } catch (error) {
          console.error('Failed to delete basket:', error)
        }
      },

      calculateTotals: () => {
        const basket = get().basket
        if (!basket) {
          set({ basketTotals: null })
          return
        }

        const shipping = basket.shippingPrice || 0
        const subtotal = basket.items.reduce((acc, item) => acc + (item.price * item.quantity), 0)
        const total = subtotal + shipping

        set({
          basketTotals: {
            shipping,
            subtotal,
            total,
          },
        })
      },

      createPaymentIntent: async () => {
        const basket = get().basket
        if (!basket) return

        try {
          const updatedBasket = await basketApi.createPaymentIntent(basket.id)
          set({ basket: updatedBasket })
        } catch (error) {
          console.error('Failed to create payment intent:', error)
          throw error
        }
      },

      setShippingPrice: (shippingPrice: number, deliveryMethodId: number) => {
        const basket = get().basket
        if (!basket) return

        basket.shippingPrice = shippingPrice
        basket.deliveryMethodId = deliveryMethodId
        get().calculateTotals()
        get().setBasket(basket)
      },

      clearBasket: () => {
        localStorage.removeItem('basket_id')
        set({ basket: null, basketTotals: null })
      },
    }),
    {
      name: 'basket-storage',
      partialize: (state) => ({
        basket: state.basket,
      }),
    }
  )
)