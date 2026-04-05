'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  BarChart2, Package, ShoppingBag, Users, Plus, Pencil,
  Trash2, Shield, ShieldOff, Loader2, TrendingUp, DollarSign,
  Store, CheckCircle, XCircle, Clock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import { ImageUpload } from '@/components/image-upload'

interface Product {
  _id: string; name: string; price: number; category: string;
  countInStock: number; image: string; description: string;
  isApproved: boolean;
  seller?: { name: string; email: string; sellerInfo?: { shopName: string } };
}
interface Order {
  _id: string; totalPrice: number; isPaid: boolean;
  status: string; createdAt: string;
  user?: { name: string; email: string };
  items: { name: string; quantity: number; price: number }[];
}
interface User {
  _id: string; name: string; email: string; isAdmin: boolean;
  isSeller: boolean; sellerStatus: string; createdAt: string;
  sellerInfo?: { shopName: string; shopDescription: string; appliedAt: string };
}
interface Analytics {
  totalUsers: number; totalProducts: number;
  totalOrders: number; totalRevenue: number;
  monthlyOrders: { _id: { month: number; year: number }; revenue: number; count: number }[];
  topProducts: { _id: string; totalSold: number }[];
}

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function AdminPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('analytics')
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [sellerApplications, setSellerApplications] = useState<User[]>([])
  const [pendingProducts, setPendingProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [productModal, setProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '', price: '', description: '', image: '', category: '', countInStock: ''
  })

  const token = (user as any)?.backendToken
  const API = process.env.NEXT_PUBLIC_API_URL
  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` }

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    if (!user.isAdmin) { router.push('/'); return }
  }, [user])

  useEffect(() => {
    if (!user?.isAdmin) return
    if (activeTab === 'analytics') fetchAnalytics()
    if (activeTab === 'products') fetchProducts()
    if (activeTab === 'orders') fetchOrders()
    if (activeTab === 'users') fetchUsers()
    if (activeTab === 'sellers') fetchSellerApplications()
    if (activeTab === 'pending') fetchPendingProducts()
  }, [activeTab, user])

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/analytics`, { headers })
      const data = await res.json()
      if (res.ok) setAnalytics(data)
    } finally { setLoading(false) }
  }

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/products`, { headers })
      const data = await res.json()
      if (res.ok) setProducts(data)
    } finally { setLoading(false) }
  }

  const fetchOrders = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/orders/admin/all`, { headers })
      const data = await res.json()
      if (res.ok) setOrders(data)
    } finally { setLoading(false) }
  }

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/users`, { headers })
      const data = await res.json()
      if (res.ok) setUsers(data)
    } finally { setLoading(false) }
  }

  const fetchSellerApplications = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/auth/seller-applications`, { headers })
      const data = await res.json()
      if (res.ok) setSellerApplications(data)
    } finally { setLoading(false) }
  }

  const fetchPendingProducts = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API}/api/products/admin/pending`, { headers })
      const data = await res.json()
      if (res.ok) setPendingProducts(data)
    } finally { setLoading(false) }
  }

  const updateSellerStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/auth/seller-applications/${id}`, {
      method: 'PUT', headers, body: JSON.stringify({ status })
    })
    fetchSellerApplications()
  }

  const handleApproveProduct = async (id: string, isApproved: boolean) => {
    await fetch(`${API}/api/products/admin/${id}/approve`, {
      method: 'PUT', headers, body: JSON.stringify({ isApproved })
    })
    fetchPendingProducts()
  }

  const openProductModal = (product?: Product) => {
    if (product) {
      setEditingProduct(product)
      setProductForm({
        name: product.name, price: String(product.price),
        description: product.description, image: product.image,
        category: product.category, countInStock: String(product.countInStock)
      })
    } else {
      setEditingProduct(null)
      setProductForm({ name: '', price: '', description: '', image: '', category: '', countInStock: '' })
    }
    setProductModal(true)
  }

  const saveProduct = async () => {
    const body = {
      name: productForm.name, price: Number(productForm.price),
      description: productForm.description, image: productForm.image,
      category: productForm.category, countInStock: Number(productForm.countInStock)
    }
    const url = editingProduct ? `${API}/api/products/${editingProduct._id}` : `${API}/api/products`
    const method = editingProduct ? 'PUT' : 'POST'
    const res = await fetch(url, { method, headers, body: JSON.stringify(body) })
    if (res.ok) { setProductModal(false); fetchProducts() }
  }

  const deleteProduct = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await fetch(`${API}/api/products/${id}`, { method: 'DELETE', headers })
    fetchProducts()
  }

  const toggleAdmin = async (id: string) => {
    await fetch(`${API}/api/auth/users/${id}/toggle-admin`, { method: 'PUT', headers })
    fetchUsers()
  }

  const deleteUser = async (id: string) => {
    if (!confirm('Delete this user?')) return
    await fetch(`${API}/api/auth/users/${id}`, { method: 'DELETE', headers })
    fetchUsers()
  }

  const updateOrderStatus = async (id: string, status: string) => {
    await fetch(`${API}/api/orders/${id}/status`, {
      method: 'PUT', headers, body: JSON.stringify({ status })
    })
    fetchOrders()
  }

  const getSellerStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Approved</span>
      case 'pending': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Pending</span>
      case 'rejected': return <span className="px-2 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Rejected</span>
      default: return null
    }
  }

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'sellers', label: 'Seller Applications', icon: Store },
    { id: 'pending', label: 'Pending Products', icon: Clock },
  ]

  if (!user?.isAdmin) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage your store</p>
          </div>
          <span className="px-3 py-1 bg-accent text-accent-foreground rounded-full text-sm font-semibold">Admin</span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition -mb-px whitespace-nowrap ${
                activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}>
              <tab.icon className="w-4 h-4" />{tab.label}
            </button>
          ))}
        </div>

        {loading && (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {/* ANALYTICS TAB */}
        {activeTab === 'analytics' && !loading && analytics && (
          <div className="space-y-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Revenue', value: `$${analytics.totalRevenue.toFixed(2)}`, icon: DollarSign, color: 'text-green-600 bg-green-100' },
                { label: 'Total Orders', value: analytics.totalOrders, icon: ShoppingBag, color: 'text-blue-600 bg-blue-100' },
                { label: 'Total Products', value: analytics.totalProducts, icon: Package, color: 'text-purple-600 bg-purple-100' },
                { label: 'Total Users', value: analytics.totalUsers, icon: Users, color: 'text-orange-600 bg-orange-100' },
              ].map((stat) => (
                <div key={stat.label} className="border border-border rounded-lg p-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Monthly Revenue
              </h2>
              {analytics.monthlyOrders.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No revenue data yet</p>
              ) : (
                <div className="flex items-end gap-3 h-48">
                  {analytics.monthlyOrders.map((m) => {
                    const maxRevenue = Math.max(...analytics.monthlyOrders.map(o => o.revenue))
                    const height = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0
                    return (
                      <div key={`${m._id.year}-${m._id.month}`} className="flex-1 flex flex-col items-center gap-2">
                        <p className="text-xs font-semibold">${m.revenue.toFixed(0)}</p>
                        <div className="w-full bg-primary rounded-t transition-all" style={{ height: `${Math.max(height, 4)}%` }} />
                        <p className="text-xs text-muted-foreground">{MONTHS[m._id.month - 1]}</p>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4">Top Selling Products</h2>
              {analytics.topProducts.length === 0 ? (
                <p className="text-muted-foreground">No sales data yet</p>
              ) : (
                <div className="space-y-3">
                  {analytics.topProducts.map((p, i) => (
                    <div key={p._id} className="flex items-center gap-4">
                      <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      <p className="flex-1 font-medium">{p._id}</p>
                      <span className="text-sm text-muted-foreground">{p.totalSold} sold</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* PRODUCTS TAB */}
        {activeTab === 'products' && !loading && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">{products.length} products</p>
              <Button onClick={() => openProductModal()} className="gap-2">
                <Plus className="w-4 h-4" /> Add Product
              </Button>
            </div>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Product</th>
                    <th className="text-left px-4 py-3 font-semibold">Category</th>
                    <th className="text-left px-4 py-3 font-semibold">Price</th>
                    <th className="text-left px-4 py-3 font-semibold">Stock</th>
                    <th className="text-left px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t border-border hover:bg-secondary/30">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          {product.image && <img src={product.image} alt={product.name} className="w-10 h-10 rounded object-cover border border-border" />}
                          <p className="font-medium">{product.name}</p>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">{product.category}</td>
                      <td className="px-4 py-3 font-semibold">${product.price}</td>
                      <td className="px-4 py-3">
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          product.countInStock > 10 ? 'bg-green-100 text-green-700' :
                          product.countInStock > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {product.countInStock > 0 ? `${product.countInStock} left` : 'Out of stock'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openProductModal(product)} className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => deleteProduct(product._id)} className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive"><Trash2 className="w-4 h-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && !loading && (
          <div className="space-y-4">
            <p className="text-muted-foreground">{orders.length} total orders</p>
            {orders.length === 0 ? (
              <div className="text-center py-16 border border-border rounded-lg">
                <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No orders yet</p>
              </div>
            ) : (
              <div className="border border-border rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold">Order ID</th>
                      <th className="text-left px-4 py-3 font-semibold">Customer</th>
                      <th className="text-left px-4 py-3 font-semibold">Total</th>
                      <th className="text-left px-4 py-3 font-semibold">Paid</th>
                      <th className="text-left px-4 py-3 font-semibold">Status</th>
                      <th className="text-left px-4 py-3 font-semibold">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id} className="border-t border-border hover:bg-secondary/30">
                        <td className="px-4 py-3 font-mono text-xs">#{order._id.slice(-8).toUpperCase()}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium">{order.user?.name || 'N/A'}</p>
                          <p className="text-xs text-muted-foreground">{order.user?.email}</p>
                        </td>
                        <td className="px-4 py-3 font-bold">${order.totalPrice.toFixed(2)}</td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {order.isPaid ? 'Paid' : 'Unpaid'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <select value={order.status} onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className="text-xs border border-border rounded px-2 py-1 bg-background">
                            {['pending','paid','processing','shipped','delivered','cancelled'].map(s => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* USERS TAB */}
        {activeTab === 'users' && !loading && (
          <div>
            <p className="text-muted-foreground mb-6">{users.length} registered users</p>
            <div className="border border-border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-secondary">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold">Name</th>
                    <th className="text-left px-4 py-3 font-semibold">Email</th>
                    <th className="text-left px-4 py-3 font-semibold">Role</th>
                    <th className="text-left px-4 py-3 font-semibold">Joined</th>
                    <th className="text-left px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u._id} className="border-t border-border hover:bg-secondary/30">
                      <td className="px-4 py-3 font-medium">{u.name}</td>
                      <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${u.isAdmin ? 'bg-purple-100 text-purple-700' : 'bg-gray-100 text-gray-700'}`}>
                            {u.isAdmin ? 'Admin' : 'User'}
                          </span>
                          {u.isSeller && <span className="px-2 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Seller</span>}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => toggleAdmin(u._id)} title={u.isAdmin ? 'Remove admin' : 'Make admin'}
                            className="p-1.5 hover:bg-secondary rounded text-muted-foreground hover:text-foreground">
                            {u.isAdmin ? <ShieldOff className="w-4 h-4" /> : <Shield className="w-4 h-4" />}
                          </button>
                          {u._id !== (user as any).id && (
                            <button onClick={() => deleteUser(u._id)}
                              className="p-1.5 hover:bg-destructive/10 rounded text-muted-foreground hover:text-destructive">
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* SELLER APPLICATIONS TAB */}
        {activeTab === 'sellers' && !loading && (
          <div>
            <p className="text-muted-foreground mb-6">{sellerApplications.length} applications</p>
            {sellerApplications.length === 0 ? (
              <div className="text-center py-16 border border-border rounded-lg">
                <Store className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">No seller applications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sellerApplications.map((applicant) => (
                  <div key={applicant._id} className="border border-border rounded-lg p-6">
                    <div className="flex flex-wrap items-start justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold">
                            {applicant.name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-semibold">{applicant.name}</p>
                            <p className="text-sm text-muted-foreground">{applicant.email}</p>
                          </div>
                          {getSellerStatusBadge(applicant.sellerStatus)}
                        </div>
                        {applicant.sellerInfo && (
                          <div className="ml-13 mt-3 space-y-1 bg-muted/40 rounded-lg px-4 py-3">
                            <p className="text-sm font-semibold">🏪 {applicant.sellerInfo.shopName}</p>
                            {applicant.sellerInfo.shopDescription && (
                              <p className="text-sm text-muted-foreground">{applicant.sellerInfo.shopDescription}</p>
                            )}
                            {applicant.sellerInfo.appliedAt && (
                              <p className="text-xs text-muted-foreground">
                                Applied: {new Date(applicant.sellerInfo.appliedAt).toLocaleDateString()}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                      {/* Action buttons — only show if pending */}
                      {applicant.sellerStatus === 'pending' && (
                        <div className="flex gap-2">
                          <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700"
                            onClick={() => updateSellerStatus(applicant._id, 'approved')}>
                            <CheckCircle className="w-4 h-4" /> Approve
                          </Button>
                          <Button size="sm" variant="destructive" className="gap-2"
                            onClick={() => updateSellerStatus(applicant._id, 'rejected')}>
                            <XCircle className="w-4 h-4" /> Reject
                          </Button>
                        </div>
                      )}
                      {/* Re-approve if rejected */}
                      {applicant.sellerStatus === 'rejected' && (
                        <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700"
                          onClick={() => updateSellerStatus(applicant._id, 'approved')}>
                          <CheckCircle className="w-4 h-4" /> Approve Anyway
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PENDING PRODUCTS TAB */}
        {activeTab === 'pending' && !loading && (
          <div>
            <p className="text-muted-foreground mb-6">{pendingProducts.length} products awaiting approval</p>
            {pendingProducts.length === 0 ? (
              <div className="text-center py-16 border border-border rounded-lg">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <p className="font-semibold">All caught up!</p>
                <p className="text-muted-foreground">No products pending approval</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pendingProducts.map((product) => (
                  <div key={product._id} className="border border-border rounded-lg p-6">
                    <div className="flex flex-wrap items-start gap-4">
                      {product.image && (
                        <img src={product.image} alt={product.name}
                          className="w-20 h-20 rounded-lg object-cover border border-border" />
                      )}
                      <div className="flex-1">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="font-semibold text-lg">{product.name}</p>
                            <p className="text-sm text-muted-foreground">{product.category}</p>
                            <p className="text-primary font-bold mt-1">${product.price}</p>
                            {product.description && (
                              <p className="text-sm text-muted-foreground mt-2 line-clamp-2">{product.description}</p>
                            )}
                            {product.seller && (
                              <div className="mt-3 flex items-center gap-2">
                                <Store className="w-4 h-4 text-muted-foreground" />
                                <p className="text-sm text-muted-foreground">
                                  By <span className="font-medium text-foreground">
                                    {product.seller.sellerInfo?.shopName || product.seller.name}
                                  </span>
                                </p>
                              </div>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" className="gap-2 bg-green-600 hover:bg-green-700"
                              onClick={() => handleApproveProduct(product._id, true)}>
                              <CheckCircle className="w-4 h-4" /> Approve
                            </Button>
                            <Button size="sm" variant="destructive" className="gap-2"
                              onClick={() => handleApproveProduct(product._id, false)}>
                              <XCircle className="w-4 h-4" /> Reject
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Product Modal */}
      {productModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">{editingProduct ? 'Edit Product' : 'Add Product'}</h2>
            <div className="space-y-4">

              {/* Text fields only — no image URL input */}
              {[
                { label: 'Product Name', key: 'name', type: 'text', placeholder: 'e.g. Classic Watch' },
                { label: 'Price ($)', key: 'price', type: 'number', placeholder: '29.99' },
                { label: 'Category', key: 'category', type: 'text', placeholder: 'e.g. Electronics' },
                { label: 'Stock Count', key: 'countInStock', type: 'number', placeholder: '100' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-2">{field.label}</label>
                  <input type={field.type} value={(productForm as any)[field.key]}
                    onChange={(e) => setProductForm({ ...productForm, [field.key]: e.target.value })}
                    placeholder={field.placeholder}
                    className="w-full px-3 py-2 rounded border border-border bg-background" />
                </div>
              ))}

              {/* Description */}
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <textarea value={productForm.description}
                  onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                  placeholder="Product description..." rows={3}
                  className="w-full px-3 py-2 rounded border border-border bg-background resize-none" />
              </div>

              {/* Image Upload — replaces Image URL input */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <ImageUpload
                  value={productForm.image}
                  onChange={(url) => setProductForm({ ...productForm, image: url })}
                />
              </div>

            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setProductModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveProduct}>{editingProduct ? 'Save Changes' : 'Add Product'}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}