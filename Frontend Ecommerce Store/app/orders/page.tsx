'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { Package, Calendar, DollarSign, ChevronRight } from 'lucide-react'

// Mock orders data
const MOCK_ORDERS = [
  {
    id: 'ORD-1704067200000',
    date: '2024-01-01',
    total: 399.97,
    status: 'Delivered',
    items: 3,
    trackingNumber: 'TRACK123456789',
  },
  {
    id: 'ORD-1703462400000',
    date: '2023-12-25',
    total: 129.99,
    status: 'Delivered',
    items: 1,
    trackingNumber: 'TRACK987654321',
  },
  {
    id: 'ORD-1702857600000',
    date: '2023-12-18',
    total: 249.98,
    status: 'In Transit',
    items: 2,
    trackingNumber: 'TRACK555666777',
  },
]

const STATUS_COLORS: Record<string, string> = {
  'Delivered': 'bg-green-100 text-green-700',
  'In Transit': 'bg-blue-100 text-blue-700',
  'Processing': 'bg-yellow-100 text-yellow-700',
  'Cancelled': 'bg-red-100 text-red-700',
}

export default function OrdersPage() {
  const router = useRouter()
  const { user } = useAuth()

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Please log in to view orders</h1>
          <Button onClick={() => router.push('/auth/login')}>
            Go to Login
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Your Orders</h1>
          <p className="text-lg text-muted-foreground">
            Track and manage your orders
          </p>
        </div>

        {MOCK_ORDERS.length > 0 ? (
          <div className="space-y-4">
            {MOCK_ORDERS.map((order) => (
              <div
                key={order.id}
                className="border border-border rounded-lg p-6 hover:shadow-lg transition cursor-pointer"
                onClick={() => router.push(`/orders/${order.id}`)}
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  {/* Order Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-bold text-lg">{order.id}</p>
                      <span className={`text-xs px-3 py-1 rounded-full font-semibold ${STATUS_COLORS[order.status] || 'bg-gray-100'}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(order.date).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Package className="w-4 h-4" />
                        {order.items} item{order.items > 1 ? 's' : ''}
                      </div>
                      <div className="flex items-center gap-2 font-semibold">
                        <DollarSign className="w-4 h-4" />
                        ${order.total.toFixed(2)}
                      </div>
                      <div className="text-muted-foreground text-xs">
                        Track: {order.trackingNumber}
                      </div>
                    </div>
                  </div>

                  {/* Action */}
                  <div className="flex items-center gap-2 md:ml-auto">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <ChevronRight className="w-5 h-5 text-muted-foreground" />
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex justify-between text-xs text-muted-foreground mb-2">
                    <span>Order Progress</span>
                    <span>{order.status}</span>
                  </div>
                  <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary transition-all"
                      style={{
                        width: order.status === 'Delivered' ? '100%' : order.status === 'In Transit' ? '66%' : '33%',
                      }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Package className="w-16 h-16 mx-auto text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">
              Start shopping to create your first order
            </p>
            <Button onClick={() => router.push('/products')}>
              Continue Shopping
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
