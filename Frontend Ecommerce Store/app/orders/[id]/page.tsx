'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft, Download, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'

// Mock order detail
const MOCK_ORDER = {
  id: 'ORD-1704067200000',
  date: '2024-01-01',
  total: 399.97,
  subtotal: 359.97,
  tax: 40.00,
  shipping: 0,
  status: 'Delivered',
  estimatedDelivery: '2024-01-08',
  items: [
    {
      id: '1',
      name: 'Classic Leather Watch',
      price: 129.99,
      quantity: 2,
      image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=100&h=100&fit=crop',
    },
    {
      id: '3',
      name: 'Wireless Headphones',
      price: 249.99,
      quantity: 1,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100&h=100&fit=crop',
    },
  ],
  shippingAddress: {
    name: 'John Doe',
    email: 'john@example.com',
    address: '123 Main Street',
    city: 'New York',
    state: 'NY',
    zip: '10001',
    phone: '(555) 000-0000',
  },
  trackingNumber: 'TRACK123456789',
  trackingUrl: 'https://tracking.example.com/TRACK123456789',
}

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back to Orders
        </button>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-4xl font-bold mb-2">{MOCK_ORDER.id}</h1>
              <p className="text-muted-foreground">
                Order placed on {new Date(MOCK_ORDER.date).toLocaleDateString()}
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="gap-2">
                <Download className="w-4 h-4" />
                Download Invoice
              </Button>
              <Button variant="outline" className="gap-2">
                <RotateCcw className="w-4 h-4" />
                Return Items
              </Button>
            </div>
          </div>

          {/* Status */}
          <div className="inline-block px-4 py-2 rounded-full bg-green-100 text-green-700 font-semibold text-sm">
            {MOCK_ORDER.status}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Order Timeline */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-6">Order Timeline</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700">✓</span>
                    </div>
                    <div className="w-0.5 h-12 bg-green-100 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <p className="font-bold">Order Placed</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(MOCK_ORDER.date).toLocaleDateString()} at{' '}
                      {new Date(MOCK_ORDER.date).toLocaleTimeString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700">✓</span>
                    </div>
                    <div className="w-0.5 h-12 bg-green-100 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <p className="font-bold">Processing</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(MOCK_ORDER.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700">✓</span>
                    </div>
                    <div className="w-0.5 h-12 bg-green-100 mt-2"></div>
                  </div>
                  <div className="pb-6">
                    <p className="font-bold">Shipped</p>
                    <p className="text-sm text-muted-foreground">
                      Tracking: {MOCK_ORDER.trackingNumber}
                    </p>
                    <a
                      href={MOCK_ORDER.trackingUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline text-sm"
                    >
                      Track Shipment →
                    </a>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex flex-col items-center">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-green-700">✓</span>
                    </div>
                  </div>
                  <div>
                    <p className="font-bold">Delivered</p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(MOCK_ORDER.estimatedDelivery).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Order Items</h2>

              <div className="space-y-4">
                {MOCK_ORDER.items.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-b-0 last:pb-0">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 rounded object-cover"
                    />
                    <div className="flex-1">
                      <h3 className="font-bold mb-2">{item.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold">
                        ${(item.price * item.quantity).toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        ${item.price.toFixed(2)} each
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-xl font-bold mb-4">Shipping Address</h2>

              <div className="text-sm space-y-1">
                <p className="font-semibold">{MOCK_ORDER.shippingAddress.name}</p>
                <p>{MOCK_ORDER.shippingAddress.address}</p>
                <p>
                  {MOCK_ORDER.shippingAddress.city}, {MOCK_ORDER.shippingAddress.state}{' '}
                  {MOCK_ORDER.shippingAddress.zip}
                </p>
                <p className="mt-2">{MOCK_ORDER.shippingAddress.phone}</p>
                <p>{MOCK_ORDER.shippingAddress.email}</p>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Order Summary */}
            <div className="border border-border rounded-lg p-6 sticky top-8 space-y-6">
              <h2 className="text-lg font-bold">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>${MOCK_ORDER.subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{MOCK_ORDER.shipping === 0 ? 'Free' : `$${MOCK_ORDER.shipping.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>${MOCK_ORDER.tax.toFixed(2)}</span>
                </div>

                <div className="border-t border-border pt-3 flex justify-between font-bold">
                  <span>Total</span>
                  <span className="text-primary">${MOCK_ORDER.total.toFixed(2)}</span>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="border-t border-border pt-6 space-y-2">
                <Button className="w-full">Contact Support</Button>
                <Button variant="outline" className="w-full">
                  Reorder Items
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
