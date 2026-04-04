'use client'

import { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { User, Package, MapPin, Save, Eye, EyeOff, CheckCircle2, Clock, Truck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'

interface Order {
  _id: string
  items: { name: string; price: number; quantity: number; image?: string }[]
  totalPrice: number
  status: string
  isPaid: boolean
  createdAt: string
  shippingAddress: {
    firstName: string
    lastName: string
    address: string
    city: string
    state: string
    zipCode: string
  }
}

function ProfileContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'info')
  const [orders, setOrders] = useState<Order[]>([])
  const [ordersLoading, setOrdersLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)

  const [infoForm, setInfoForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
  })

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  const [addresses, setAddresses] = useState([
    { id: 1, label: 'Home', address: '', city: '', state: '', zipCode: '', isDefault: true }
  ])

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    if (activeTab === 'orders') fetchOrders()
  }, [activeTab, user])

  const fetchOrders = async () => {
    setOrdersLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/myorders`, {
        headers: { Authorization: `Bearer ${(user as any)?.backendToken}` },
      })
      const data = await res.json()
      if (res.ok) setOrders(data)
    } catch (err) {
      console.error('Failed to fetch orders:', err)
    } finally {
      setOrdersLoading(false)
    }
  }

  const handleSaveInfo = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaveSuccess(true)
    setTimeout(() => setSaveSuccess(false), 3000)
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered': return <CheckCircle2 className="w-4 h-4 text-green-500" />
      case 'shipped': return <Truck className="w-4 h-4 text-blue-500" />
      default: return <Clock className="w-4 h-4 text-yellow-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-700'
      case 'shipped': return 'bg-blue-100 text-blue-700'
      case 'paid': return 'bg-purple-100 text-purple-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-yellow-100 text-yellow-700'
    }
  }

  const tabs = [
    { id: 'info', label: 'Personal Info', icon: User },
    { id: 'orders', label: 'Order History', icon: Package },
    { id: 'addresses', label: 'Saved Addresses', icon: MapPin },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-bold">{user?.name}</h1>
            <p className="text-muted-foreground">{user?.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition -mb-px ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1 — Personal Info */}
        {activeTab === 'info' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Basic Info */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-6">Basic Information</h2>
              <form onSubmit={handleSaveInfo} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Full Name</label>
                  <input
                    type="text"
                    value={infoForm.name}
                    onChange={(e) => setInfoForm({ ...infoForm, name: e.target.value })}
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Email Address</label>
                  <input
                    type="email"
                    value={infoForm.email}
                    disabled
                    className="w-full px-3 py-2 rounded border border-border bg-background opacity-60"
                  />
                  <p className="text-xs text-muted-foreground mt-1">Email cannot be changed</p>
                </div>
                <Button type="submit" className="w-full gap-2">
                  <Save className="w-4 h-4" />
                  {saveSuccess ? '✅ Saved!' : 'Save Changes'}
                </Button>
              </form>
            </div>

            {/* Change Password */}
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-6">Change Password</h2>
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div>
                  <label className="block text-sm font-medium mb-2">Current Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••"
                      className="w-full px-3 py-2 pr-10 rounded border border-border bg-background"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Confirm New Password</label>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    placeholder="••••••••"
                    className="w-full px-3 py-2 rounded border border-border bg-background"
                  />
                </div>
                <Button type="submit" variant="outline" className="w-full">
                  Update Password
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* TAB 2 — Order History */}
        {activeTab === 'orders' && (
          <div className="space-y-4">
            {ordersLoading ? (
              <div className="text-center py-12 text-muted-foreground">Loading orders...</div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16 border border-border rounded-lg">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No orders yet</h3>
                <p className="text-muted-foreground mb-6">Start shopping to see your orders here</p>
                <Button onClick={() => router.push('/products')}>Browse Products</Button>
              </div>
            ) : (
              orders.map((order) => (
                <div key={order._id} className="border border-border rounded-lg p-6">
                  {/* Order Header */}
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Order ID</p>
                      <p className="font-mono font-semibold text-sm">#{order._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Date</p>
                      <p className="text-sm font-medium">{new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Total</p>
                      <p className="text-sm font-bold text-primary">${order.totalPrice.toFixed(2)}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusIcon(order.status)}
                      <span className={`text-xs font-semibold px-3 py-1 rounded-full capitalize ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </div>
                    <Button variant="outline" size="sm"
                      onClick={() => router.push(`/order-confirmation/${order._id}`)}>
                      View Details
                    </Button>
                  </div>

                  {/* Order Items */}
                  <div className="border-t border-border pt-4 space-y-2">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex items-center gap-3">
                        {item.image && (
                          <img src={item.image} alt={item.name}
                            className="w-10 h-10 rounded object-cover border border-border" />
                        )}
                        <div className="flex-1">
                          <p className="text-sm font-medium">{item.name}</p>
                          <p className="text-xs text-muted-foreground">Qty: {item.quantity}</p>
                        </div>
                        <p className="text-sm font-semibold">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>

                  {/* Shipping Address */}
                  {order.shippingAddress && (
                    <div className="border-t border-border pt-4 mt-4">
                      <p className="text-xs text-muted-foreground mb-1">Shipped To</p>
                      <p className="text-sm">
                        {order.shippingAddress.firstName} {order.shippingAddress.lastName} —{' '}
                        {order.shippingAddress.address}, {order.shippingAddress.city},{' '}
                        {order.shippingAddress.state} {order.shippingAddress.zipCode}
                      </p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        )}

        {/* TAB 3 — Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            {addresses.map((addr, index) => (
              <div key={addr.id} className="border border-border rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span className="font-semibold">{addr.label}</span>
                    {addr.isDefault && (
                      <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">Default</span>
                    )}
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Street Address</label>
                    <input type="text" value={addr.address}
                      onChange={(e) => {
                        const updated = [...addresses]
                        updated[index].address = e.target.value
                        setAddresses(updated)
                      }}
                      placeholder="123 Main St"
                      className="w-full px-3 py-2 rounded border border-border bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">City</label>
                    <input type="text" value={addr.city}
                      onChange={(e) => {
                        const updated = [...addresses]
                        updated[index].city = e.target.value
                        setAddresses(updated)
                      }}
                      placeholder="New York"
                      className="w-full px-3 py-2 rounded border border-border bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">State</label>
                    <input type="text" value={addr.state}
                      onChange={(e) => {
                        const updated = [...addresses]
                        updated[index].state = e.target.value
                        setAddresses(updated)
                      }}
                      placeholder="NY"
                      className="w-full px-3 py-2 rounded border border-border bg-background" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Zip Code</label>
                    <input type="text" value={addr.zipCode}
                      onChange={(e) => {
                        const updated = [...addresses]
                        updated[index].zipCode = e.target.value
                        setAddresses(updated)
                      }}
                      placeholder="10001"
                      className="w-full px-3 py-2 rounded border border-border bg-background" />
                  </div>
                </div>
                <Button className="mt-4 gap-2">
                  <Save className="w-4 h-4" />
                  Save Address
                </Button>
              </div>
            ))}

            <Button variant="outline" className="w-full"
              onClick={() => setAddresses([...addresses, {
                id: Date.now(), label: 'New Address',
                address: '', city: '', state: '', zipCode: '', isDefault: false
              }])}>
              + Add New Address
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <ProfileContent />
    </Suspense>
  )
}