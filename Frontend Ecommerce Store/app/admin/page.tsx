'use client'

import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'
import { BarChart, Users, ShoppingCart, DollarSign, TrendingUp, Settings } from 'lucide-react'

export default function AdminDashboard() {
  const router = useRouter()
  const { user } = useAuth()

  // Check if user is admin
  if (!user || !user.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-muted-foreground mb-8">You don&apos;t have permission to access the admin dashboard.</p>
          <Button onClick={() => router.push('/')}>
            Go to Home
          </Button>
        </div>
      </div>
    )
  }

  // Mock dashboard data
  const stats = [
    {
      label: 'Total Revenue',
      value: '$24,567.89',
      change: '+12.5%',
      icon: DollarSign,
      color: 'bg-emerald-100 text-emerald-700',
    },
    {
      label: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      icon: ShoppingCart,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      label: 'Total Customers',
      value: '856',
      change: '+15.3%',
      icon: Users,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      label: 'Growth Rate',
      value: '23.5%',
      change: '+2.1%',
      icon: TrendingUp,
      color: 'bg-orange-100 text-orange-700',
    },
  ]

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      date: '2024-01-05',
      amount: '$149.99',
      status: 'Delivered',
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      date: '2024-01-04',
      amount: '$299.99',
      status: 'In Transit',
    },
    {
      id: 'ORD-003',
      customer: 'Bob Johnson',
      date: '2024-01-03',
      amount: '$89.99',
      status: 'Processing',
    },
    {
      id: 'ORD-004',
      customer: 'Alice Williams',
      date: '2024-01-02',
      amount: '$199.99',
      status: 'Delivered',
    },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back, {user?.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2">
              <Settings className="w-4 h-4" />
              Settings
            </Button>
            <Button className="gap-2">
              <BarChart className="w-4 h-4" />
              Reports
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon
            return (
              <div key={stat.label} className="border border-border rounded-lg p-6 bg-card">
                <div className="flex items-start justify-between mb-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded">
                    {stat.change}
                  </span>
                </div>
                <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                <p className="text-3xl font-bold">{stat.value}</p>
              </div>
            )
          })}
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          {/* Recent Orders */}
          <div className="lg:col-span-2 border border-border rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold">Recent Orders</h2>
              <Button variant="ghost" size="sm" onClick={() => router.push('/admin/orders')}>
                View All →
              </Button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold">Order ID</th>
                    <th className="text-left py-3 px-4 font-semibold">Customer</th>
                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                    <th className="text-left py-3 px-4 font-semibold">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => (
                    <tr key={order.id} className="border-b border-border hover:bg-secondary/50 transition">
                      <td className="py-3 px-4 font-medium">{order.id}</td>
                      <td className="py-3 px-4">{order.customer}</td>
                      <td className="py-3 px-4 text-muted-foreground">{order.date}</td>
                      <td className="py-3 px-4 font-semibold">{order.amount}</td>
                      <td className="py-3 px-4">
                        <span className={`text-xs px-2 py-1 rounded font-semibold ${
                          order.status === 'Delivered'
                            ? 'bg-green-100 text-green-700'
                            : order.status === 'In Transit'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Quick Actions</h2>

            <div className="space-y-2">
              <Button
                className="w-full justify-start"
                onClick={() => router.push('/admin/products')}
              >
                Manage Products
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/orders')}
              >
                Manage Orders
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/customers')}
              >
                View Customers
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/analytics')}
              >
                View Analytics
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() => router.push('/admin/settings')}
              >
                Store Settings
              </Button>
            </div>

            {/* Info Card */}
            <div className="mt-6 p-4 bg-accent/10 rounded-lg border border-accent/20">
              <p className="text-sm font-semibold mb-2">📊 Today&apos;s Summary</p>
              <div className="space-y-1 text-xs text-muted-foreground">
                <p>Orders: 12</p>
                <p>Revenue: $2,450</p>
                <p>Customers: 8</p>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Top Products */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Top Products</h2>

            <div className="space-y-3">
              {[
                { name: 'Wireless Headphones', sales: 156, revenue: '$39,000' },
                { name: 'Classic Leather Watch', sales: 143, revenue: '$18,567' },
                { name: 'Premium Sunglasses', sales: 98, revenue: '$19,600' },
                { name: 'Minimalist Backpack', sales: 87, revenue: '$7,830' },
              ].map((product) => (
                <div key={product.name} className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium text-sm">{product.name}</p>
                    <p className="text-xs text-muted-foreground">{product.sales} sales</p>
                  </div>
                  <p className="font-bold text-sm">{product.revenue}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Customer Insights */}
          <div className="border border-border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-4">Customer Insights</h2>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">Customer Satisfaction</p>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-green-500" style={{ width: '92%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">4.6/5.0 average rating</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Return Rate</p>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-orange-500" style={{ width: '3%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">3% of orders</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">Customer Retention</p>
                <div className="w-full h-2 bg-border rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500" style={{ width: '78%' }} />
                </div>
                <p className="text-xs text-muted-foreground mt-1">78% repeat customers</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
