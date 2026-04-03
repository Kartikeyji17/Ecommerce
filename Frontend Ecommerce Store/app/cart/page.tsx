'use client'

import Link from 'next/link'
import { Trash2, ChevronLeft, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'

export default function CartPage() {
  const { items, totalPrice, removeItem, updateQuantity, clearCart } = useCart()
  const { user } = useAuth()

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover our collection of premium products
            </p>
            <Link href="/products">
              <Button size="lg">
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const subtotal = totalPrice
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/products" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-6">
            <ChevronLeft className="w-4 h-4" />
            Continue Shopping
          </Link>
          <h1 className="text-4xl font-bold">Shopping Cart</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="border border-border rounded-lg overflow-hidden">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`flex gap-4 sm:gap-6 p-4 sm:p-6 ${
                    index < items.length - 1 ? 'border-b border-border' : ''
                  }`}
                >
                  {/* Image */}
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg overflow-hidden bg-secondary/50 flex-shrink-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg line-clamp-2 mb-2">
                      {item.name}
                    </h3>
                    <p className="text-primary font-bold mb-4">
                      ${item.price.toFixed(2)}
                    </p>

                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() =>
                          updateQuantity(item.id, Math.max(1, item.quantity - 1))
                        }
                        className="w-8 h-8 rounded border border-border hover:bg-secondary flex items-center justify-center"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm">{item.quantity}</span>
                      <button
                        onClick={() =>
                          updateQuantity(item.id, item.quantity + 1)
                        }
                        className="w-8 h-8 rounded border border-border hover:bg-secondary flex items-center justify-center"
                      >
                        +
                      </button>
                    </div>
                  </div>

                  {/* Price and Remove */}
                  <div className="flex flex-col items-end justify-between">
                    <p className="text-lg font-bold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="text-destructive hover:text-destructive/80 transition p-2"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Clear Cart Button */}
            <button
              onClick={clearCart}
              className="mt-4 text-sm text-destructive hover:text-destructive/80 transition"
            >
              Clear Cart
            </button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 sticky top-24 space-y-6">
              <h2 className="text-xl font-bold">Order Summary</h2>

              <div className="space-y-4 py-4 border-y border-border">
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-medium">${subtotal.toFixed(2)}</span>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Shipping</span>
                  <div className="text-right">
                    {shipping === 0 ? (
                      <span className="text-green-600 font-medium">Free</span>
                    ) : (
                      <span className="font-medium">${shipping.toFixed(2)}</span>
                    )}
                  </div>
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Tax</span>
                  <span className="font-medium">${tax.toFixed(2)}</span>
                </div>
              </div>

              <div className="flex justify-between items-center text-lg font-bold">
                <span>Total</span>
                <span className="text-primary text-xl">${total.toFixed(2)}</span>
              </div>

              {/* Promo Code */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Promo Code</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Enter code"
                    className="flex-1 px-3 py-2 rounded border border-border bg-background text-sm"
                  />
                  <Button variant="outline" size="sm">
                    Apply
                  </Button>
                </div>
              </div>

              {/* Checkout Button */}
              <Link href={user ? '/checkout' : '/auth/login'}>
                <Button size="lg" className="w-full">
                  {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                </Button>
              </Link>

              <p className="text-xs text-muted-foreground text-center">
                By completing your order, you agree to our Terms and Conditions
              </p>

              {/* Benefits */}
              <div className="space-y-2 text-sm text-muted-foreground border-t border-border pt-6">
                <p className="flex items-center gap-2">
                  <span>✓</span> Free shipping on orders over $50
                </p>
                <p className="flex items-center gap-2">
                  <span>✓</span> 30-day money back guarantee
                </p>
                <p className="flex items-center gap-2">
                  <span>✓</span> Secure checkout with Stripe
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
