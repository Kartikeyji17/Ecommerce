'use client'

import Link from 'next/link'
import { CheckCircle2, Package, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'

export default function OrderConfirmationPage({ params }: { params: { id: string } }) {
  const orderId = params.id
  const orderDate = new Date().toLocaleDateString()
  const estimatedDelivery = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-background">
      <div className="mx-auto max-w-2xl px-4 sm:px-6 lg:px-8 py-16">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="flex justify-center mb-6">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle2 className="w-12 h-12 text-green-600" />
            </div>
          </div>

          <h1 className="text-4xl font-bold mb-4">Order Confirmed!</h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Thank you for your purchase! We&apos;ve received your order and will send a confirmation email shortly.
          </p>
        </div>

        {/* Order Details Card */}
        <div className="border border-border rounded-lg p-8 bg-card mb-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {/* Order Number */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Number</p>
              <p className="font-bold text-lg">{orderId}</p>
            </div>

            {/* Order Date */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Order Date</p>
              <p className="font-bold">{orderDate}</p>
            </div>

            {/* Estimated Delivery */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
              <p className="font-bold">{estimatedDelivery}</p>
            </div>

            {/* Total Amount */}
            <div>
              <p className="text-sm text-muted-foreground mb-1">Total Amount</p>
              <p className="font-bold text-primary text-xl">$XXX.XX</p>
            </div>
          </div>

          <div className="border-t border-border pt-8 space-y-6">
            {/* Order Status */}
            <div>
              <h3 className="font-bold mb-4">Order Status</h3>
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Order Placed</p>
                    <p className="text-sm text-muted-foreground">We received your order</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{orderDate}</p>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-border rounded-full flex items-center justify-center flex-shrink-0">
                    <Package className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground">Processing</p>
                    <p className="text-sm text-muted-foreground">We&apos;re preparing your order</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-border rounded-full flex items-center justify-center flex-shrink-0">
                    <Clock className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground">Shipped</p>
                    <p className="text-sm text-muted-foreground">Your order is on the way</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-border rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-muted-foreground" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium text-muted-foreground">Delivered</p>
                    <p className="text-sm text-muted-foreground">Order arrives by {estimatedDelivery}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div>
              <h3 className="font-bold mb-3">Shipping To</h3>
              <p className="text-sm text-muted-foreground">
                A confirmation email with tracking information will be sent to your email address shortly.
              </p>
            </div>

            {/* Order Items */}
            <div>
              <h3 className="font-bold mb-4">Order Items</h3>
              <p className="text-sm text-muted-foreground">
                Items will be displayed here with pricing and quantities.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="border border-border rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📧</div>
            <h3 className="font-bold mb-2">Check Your Email</h3>
            <p className="text-sm text-muted-foreground">
              A confirmation and shipping updates will be sent to your inbox
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">📦</div>
            <h3 className="font-bold mb-2">Track Your Order</h3>
            <p className="text-sm text-muted-foreground">
              Click the tracking link in your email to monitor delivery progress
            </p>
          </div>

          <div className="border border-border rounded-lg p-6 text-center">
            <div className="text-3xl mb-3">❓</div>
            <h3 className="font-bold mb-2">Need Help?</h3>
            <p className="text-sm text-muted-foreground">
              Visit our support page or contact us for any questions
            </p>
          </div>
        </div>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/products">
            <Button variant="outline" size="lg">
              Continue Shopping
            </Button>
          </Link>
          <Link href="/">
            <Button size="lg">
              Back to Home
            </Button>
          </Link>
        </div>

        {/* Support Notice */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Questions about your order? Visit our{' '}
            <Link href="/contact" className="text-primary hover:underline">
              support page
            </Link>{' '}
            or email us at support@store.com
          </p>
        </div>
      </div>
    </div>
  )
}
