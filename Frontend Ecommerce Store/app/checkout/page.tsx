'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'

export default function CheckoutPage() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const [isProcessing, setIsProcessing] = useState(false)
  const [error, setError] = useState('')

  // Redirect if no items in cart
  if (items.length === 0) {
    router.push('/cart')
    return null
  }

  // Redirect if not logged in
  if (!user) {
    router.push('/auth/login')
    return null
  }

  const subtotal = totalPrice
  const shipping = subtotal > 50 ? 0 : 9.99
  const tax = subtotal * 0.1
  const total = subtotal + shipping + tax

  const handleCheckout = async () => {
    setIsProcessing(true)
    setError('')

    try {
      // In a real app, you would call your Stripe API here
      // For now, we'll simulate a checkout process
      await new Promise((resolve) => setTimeout(resolve, 1500))

      // Simulate successful payment
      const orderId = 'ORD-' + Date.now()
      clearCart()
      router.push(`/order-confirmation/${orderId}`)
    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        <h1 className="text-4xl font-bold mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2 space-y-8">
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3 items-start">
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            {/* Shipping Address */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Shipping Address</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">First Name</label>
                    <input
                      type="text"
                      placeholder="John"
                      className="w-full px-3 py-2 rounded border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Last Name</label>
                    <input
                      type="text"
                      placeholder="Doe"
                      className="w-full px-3 py-2 rounded border border-border bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Email</label>
                  <input
                    type="email"
                    defaultValue={user.email}
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                    disabled
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Address</label>
                  <input
                    type="text"
                    placeholder="123 Main St"
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input
                      type="text"
                      placeholder="New York"
                      className="w-full px-3 py-2 rounded border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input
                      type="text"
                      placeholder="NY"
                      className="w-full px-3 py-2 rounded border border-border bg-background"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code</label>
                    <input
                      type="text"
                      placeholder="10001"
                      className="w-full px-3 py-2 rounded border border-border bg-background"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone</label>
                  <input
                    type="tel"
                    placeholder="(555) 000-0000"
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>
              </div>
            </div>

            {/* Shipping Method */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Shipping Method</h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-3 border border-primary rounded-lg bg-primary/5 cursor-pointer">
                  <input
                    type="radio"
                    name="shipping"
                    checked
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Standard Shipping</p>
                    <p className="text-xs text-muted-foreground">5-7 business days</p>
                  </div>
                  <p className="font-bold">{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</p>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/50">
                  <input
                    type="radio"
                    name="shipping"
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Express Shipping</p>
                    <p className="text-xs text-muted-foreground">2-3 business days</p>
                  </div>
                  <p className="font-bold">$29.99</p>
                </label>

                <label className="flex items-center gap-3 p-3 border border-border rounded-lg cursor-pointer hover:bg-secondary/50">
                  <input
                    type="radio"
                    name="shipping"
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Overnight Shipping</p>
                    <p className="text-xs text-muted-foreground">Next business day</p>
                  </div>
                  <p className="font-bold">$99.99</p>
                </label>
              </div>
            </div>

            {/* Payment Method */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Payment Method</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Secure payment powered by Stripe. Your card information is encrypted and secure.
              </p>

              <div className="border border-primary/30 rounded-lg p-6 bg-primary/5 text-center">
                <p className="text-lg font-semibold mb-2">Stripe Card Element</p>
                <p className="text-sm text-muted-foreground">
                  In production, the Stripe Card Element would appear here.
                </p>
                <div className="mt-4 p-3 bg-background/50 rounded text-xs text-muted-foreground">
                  Demo: Use any valid test card number from Stripe docs
                </div>
              </div>

              <label className="flex items-center gap-2 mt-4 text-sm">
                <input type="checkbox" defaultChecked className="w-4 h-4" />
                Save this card for future purchases
              </label>
            </div>

            {/* Promo Code */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Promo Code (Optional)</h2>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  className="flex-1 px-3 py-2 rounded border border-border bg-background"
                />
                <Button variant="outline">Apply</Button>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="border border-border rounded-lg p-6 sticky top-24 space-y-6">
              <h2 className="text-lg font-bold">Order Summary</h2>

              {/* Items */}
              <div className="space-y-3 max-h-48 overflow-y-auto">
                {items.map((item) => (
                  <div key={item.id} className="flex gap-3 text-sm">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-12 h-12 rounded object-cover"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="font-medium line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                    </div>
                    <p className="font-semibold">
                      ${(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Shipping</span>
                  <span>{shipping === 0 ? 'Free' : `$${shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Tax</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">${total.toFixed(2)}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <Button
                size="lg"
                onClick={handleCheckout}
                disabled={isProcessing}
                className="w-full gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Complete Purchase $${total.toFixed(2)}`
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your payment is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
