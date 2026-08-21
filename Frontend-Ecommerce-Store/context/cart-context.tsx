'use client'

import React, { createContext, useContext, useReducer, useEffect, useRef, ReactNode } from 'react'
import { useSession } from 'next-auth/react'

import { CartItem, computeTotal } from '@/lib/cart-utils'
export type { CartItem }

interface CartState {
  items: CartItem[]
  totalPrice: number
}

type CartAction =
  | { type: 'HYDRATE'; payload: CartState }
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }

const CART_STORAGE_KEY = 'ecommerce-cart'

const initialState: CartState = {
  items: [],
  totalPrice: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'HYDRATE':
      return action.payload
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      const items = existingItem
        ? state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          )
        : [...state.items, action.payload]
      return { items, totalPrice: computeTotal(items) }
    }
    case 'REMOVE_ITEM': {
      const items = state.items.filter((item) => item.id !== action.payload)
      return { items, totalPrice: computeTotal(items) }
    }
    case 'UPDATE_QUANTITY': {
      const items = state.items
        .map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        )
        .filter((item) => item.quantity > 0)
      return { items, totalPrice: computeTotal(items) }
    }
    case 'CLEAR_CART':
      return initialState
    default:
      return state
  }
}

interface CartContextType extends CartState {
  addItem: (item: CartItem) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const { data: session } = useSession()
  const hydrated = useRef(false)
  const syncTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

  const backendToken = (session?.user as any)?.backendToken as string | undefined

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as CartState
        if (parsed.items) dispatch({ type: 'HYDRATE', payload: parsed })
      }
    } catch {
      /* ignore corrupt cart */
    }
    hydrated.current = true
  }, [])

  // Merge Redis cart when user logs in
  useEffect(() => {
    if (!backendToken || !hydrated.current) return

    const syncFromServer = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${backendToken}` },
        })
        const data = await res.json()
        if (res.ok && Array.isArray(data.items) && data.items.length > 0) {
          dispatch({
            type: 'HYDRATE',
            payload: { items: data.items, totalPrice: computeTotal(data.items) },
          })
        }
      } catch {
        /* Redis may be unavailable */
      }
    }

    syncFromServer()
  }, [backendToken])

  // Persist to localStorage + Redis on change
  useEffect(() => {
    if (!hydrated.current) return

    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))

    if (!backendToken) return

    if (syncTimer.current) clearTimeout(syncTimer.current)
    syncTimer.current = setTimeout(async () => {
      try {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${backendToken}`,
          },
          body: JSON.stringify({ items: state.items }),
        })
      } catch {
        /* best-effort sync */
      }
    }, 500)
  }, [state, backendToken])

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item })
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }
  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' })
    localStorage.removeItem(CART_STORAGE_KEY)
    if (backendToken) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/cart`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${backendToken}` },
      }).catch(() => {})
    }
  }

  return (
    <CartContext.Provider value={{ ...state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
