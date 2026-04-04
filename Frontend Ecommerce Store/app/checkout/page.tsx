'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { loadStripe } from '@stripe/stripe-js'
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js'
import { ChevronLeft, AlertCircle, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

function CheckoutForm() {
  const router = useRouter()
  const { items, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const stripe = useStripe()
  const elements = useElements()

  const [isProcessing, setIsProcessing] = useState(false)
  const [isCompleted, setIsCompleted] = useState(false)
  const [error, setError] = useState('')
  const [shippingMethod, setShippingMethod] = useState('standard')
  const [form, setForm] = useState({
    firstName: '', lastName: '', address: '',
    city: '', state: '', zipCode: '', phone: ''
  })

  const shippingCost =
    shippingMethod === 'express' ? 29.99 :
    shippingMethod === 'overnight' ? 99.99 :
    totalPrice > 50 ? 0 : 9.99

  const tax = totalPrice * 0.1
  const total = totalPrice + shippingCost + tax

  useEffect(() => {
    if (items.length === 0 && !isCompleted) router.push('/cart')
  }, [items.length, isCompleted])

  useEffect(() => {
    if (!user) router.push('/auth/login')
  }, [user])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const validateForm = () => {
    const { firstName, lastName, address, city, state, zipCode, phone } = form
    if (!firstName || !lastName || !address || !city || !state || !zipCode || !phone) {
      setError('Please fill in all shipping fields')
      return false
    }
    return true
  }

  const getToken = () => (user as any)?.backendToken ?? ''

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!validateForm()) return
    if (!stripe || !elements) return

    const token = getToken()
    if (!token) {
      setError('Session expired. Please log in again.')
      router.push('/auth/login')
      return
    }

    setIsProcessing(true)

    try {
      // 1. Create order in MongoDB
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          items: items.map(i => ({
            name: i.name,
            price: i.price,
            quantity: i.quantity,
            image: i.image,
          })),
          shippingAddress: form,
          shippingMethod,
          subtotal: totalPrice,
          shippingCost,
          tax,
          totalPrice: total,
        }),
      })

      const order = await orderRes.json()
      if (!orderRes.ok) throw new Error(order.message || 'Failed to create order')

      // 2. Create Stripe payment intent
      const paymentRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/payment/create-payment-intent`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: total }),
      })

      const paymentData = await paymentRes.json()
      if (!paymentRes.ok) throw new Error(paymentData.message || 'Failed to initialize payment')

      const { clientSecret } = paymentData

      // 3. Confirm payment with Stripe
      const cardElement = elements.getElement(CardElement)
      const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement!,
          billing_details: {
            name: `${form.firstName} ${form.lastName}`,
            email: user?.email,
          },
        },
      })

      if (stripeError) throw new Error(stripeError.message)

      // 4. Mark order as paid
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${order._id}/pay`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ paymentIntentId: paymentIntent?.id }),
      })

      // 5. Success
      setIsCompleted(true)
      clearCart()
      router.push(`/order-confirmation/${order._id}`)

    } catch (err: any) {
      setError(err.message || 'Payment failed. Please try again.')
      setIsProcessing(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
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
                  <input name="firstName" value={form.firstName} onChange={handleChange}
                    type="text" placeholder="John"
                    className="w-full px-3 py-2 rounded border border-border bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleChange}
                    type="text" placeholder="Doe"
                    className="w-full px-3 py-2 rounded border border-border bg-background" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input type="email" defaultValue={user?.email}
                  className="w-full px-3 py-2 rounded border border-border bg-background opacity-60" disabled />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Address</label>
                <input name="address" value={form.address} onChange={handleChange}
                  type="text" placeholder="123 Main St"
                  className="w-full px-3 py-2 rounded border border-border bg-background" />
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input name="city" value={form.city} onChange={handleChange}
                    type="text" placeholder="New York"
                    className="w-full px-3 py-2 rounded border border-border bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input name="state" value={form.state} onChange={handleChange}
                    type="text" placeholder="NY"
                    className="w-full px-3 py-2 rounded border border-border bg-background" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Zip Code</label>
                  <input name="zipCode" value={form.zipCode} onChange={handleChange}
                    type="text" placeholder="10001"
                    className="w-full px-3 py-2 rounded border border-border bg-background" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input name="phone" value={form.phone} onChange={handleChange}
                  type="tel" placeholder="(555) 000-0000"
                  className="w-full px-3 py-2 rounded border border-border bg-background" />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Shipping Method</h2>
            <div className="space-y-3">
              {[
                { value: 'standard', label: 'Standard Shipping', days: '5-7 business days', price: totalPrice > 50 ? 'Free' : '$9.99' },
                { value: 'express', label: 'Express Shipping', days: '2-3 business days', price: '$29.99' },
                { value: 'overnight', label: 'Overnight Shipping', days: 'Next business day', price: '$99.99' },
              ].map((option) => (
                <label key={option.value}
                  className={`flex items-center gap-3 p-3 border rounded-lg cursor-pointer transition ${
                    shippingMethod === option.value ? 'border-primary bg-primary/5' : 'border-border hover:bg-secondary/50'
                  }`}>
                  <input type="radio" name="shipping" value={option.value}
                    checked={shippingMethod === option.value}
                    onChange={(e) => setShippingMethod(e.target.value)}
                    className="w-4 h-4" />
                  <div className="flex-1">
                    <p className="font-medium">{option.label}</p>
                    <p className="text-xs text-muted-foreground">{option.days}</p>
                  </div>
                  <p className="font-bold">{option.price}</p>
                </label>
              ))}
            </div>
          </div>

          {/* Payment */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-lg font-bold mb-4">Payment</h2>
            <p className="text-sm text-muted-foreground mb-4">
              Secure payment powered by Stripe.
            </p>
            <div className="p-4 border border-border rounded-lg bg-background">
              <CardElement options={{
                style: {
                  base: { fontSize: '16px', color: '#424770', '::placeholder': { color: '#aab7c4' } },
                  invalid: { color: '#9e2146' },
                },
              }} />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Test card: 4242 4242 4242 4242 | Any future date | Any CVC
            </p>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="border border-border rounded-lg p-6 sticky top-24 space-y-6">
            <h2 className="text-lg font-bold">Order Summary</h2>
            <div className="space-y-3 max-h-48 overflow-y-auto">
              {items.map((item) => (
                <div key={item.id} className="flex gap-3 text-sm">
                  <img src={item.image} alt={item.name} className="w-12 h-12 rounded object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium line-clamp-1">{item.name}</p>
                    <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-border pt-4 space-y-3">
              <div className="flex justify-between text-sm">
                <span>Subtotal</span><span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : `$${shippingCost.toFixed(2)}`}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Tax</span><span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold pt-3 border-t border-border">
                <span>Total</span>
                <span className="text-primary">${total.toFixed(2)}</span>
              </div>
            </div>
            <Button size="lg" type="submit" disabled={isProcessing || !stripe}
              className="w-full gap-2">
              {isProcessing ? (
                <><Loader2 className="w-4 h-4 animate-spin" />Processing...</>
              ) : (
                `Complete Purchase $${total.toFixed(2)}`
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Your payment is secure and encrypted 🔒
            </p>
          </div>
        </div>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </div>
    </div>
  )
}