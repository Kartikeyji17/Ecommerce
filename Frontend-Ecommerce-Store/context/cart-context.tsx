'use client'

import React, { createContext, useContext, useReducer, ReactNode } from 'react'

export interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
  image: string
}

interface CartState {
  items: CartItem[]
  totalPrice: number
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }

const initialState: CartState = {
  items: [],
  totalPrice: 0,
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'ADD_ITEM': {
      const existingItem = state.items.find((item) => item.id === action.payload.id)
      if (existingItem) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
          totalPrice: state.totalPrice + action.payload.price * action.payload.quantity,
        }
      }
      return {
        ...state,
        items: [...state.items, action.payload],
        totalPrice: state.totalPrice + action.payload.price * action.payload.quantity,
      }
    }
    case 'REMOVE_ITEM': {
      const item = state.items.find((item) => item.id === action.payload)
      return {
        ...state,
        items: state.items.filter((item) => item.id !== action.payload),
        totalPrice: state.totalPrice - (item ? item.price * item.quantity : 0),
      }
    }
    case 'UPDATE_QUANTITY': {
      const item = state.items.find((item) => item.id === action.payload.id)
      if (!item) return state
      const priceDifference = item.price * (action.payload.quantity - item.quantity)
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id
            ? { ...item, quantity: action.payload.quantity }
            : item
        ),
        totalPrice: state.totalPrice + priceDifference,
      }
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

  const addItem = (item: CartItem) => dispatch({ type: 'ADD_ITEM', payload: item })
  const removeItem = (id: string) => dispatch({ type: 'REMOVE_ITEM', payload: id })
  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id)
    } else {
      dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    }
  }
  const clearCart = () => dispatch({ type: 'CLEAR_CART' })

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
