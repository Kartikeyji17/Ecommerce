'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  Store, Package, TrendingUp, Plus, Pencil, Trash2,
  Loader2, DollarSign, ShoppingBag, Clock, CheckCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/context/auth-context'
import {
  getSellerProducts, getSellerAnalytics,
  sellerCreateProduct, sellerUpdateProduct, sellerDeleteProduct
} from '@/lib/api'
import { ImageUpload } from '@/components/image-upload'

interface Product {
  _id: string; name: string; price: number; category: string;
  countInStock: number; image: string; description: string;
  isApproved: boolean; createdAt: string;
}

interface SellerAnalytics {
  totalProducts: number;
  totalRevenue: number;
  totalSold: number;
  topProducts: { name: string; totalSold: number; revenue: number }[];
}

export default function SellerDashboard() {
  const router = useRouter()
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState('overview')
  const [products, setProducts] = useState<Product[]>([])
  const [analytics, setAnalytics] = useState<SellerAnalytics | null>(null)
  const [loading, setLoading] = useState(false)
  const [productModal, setProductModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: '', price: '', description: '', image: '', category: '', countInStock: ''
  })
  const [saveLoading, setSaveLoading] = useState(false)
  const [message, setMessage] = useState('')

  const token = (user as any)?.backendToken

  useEffect(() => {
    if (!user) { router.push('/auth/login'); return }
    if (user.sellerStatus !== 'approved') { router.push('/profile?tab=seller'); return }
  }, [user])

  useEffect(() => {
    if (user?.sellerStatus !== 'approved') return
    if (activeTab === 'overview') fetchAnalytics()
    if (activeTab === 'products') fetchProducts()
  }, [activeTab, user])

  const fetchProducts = async () => {
    setLoading(true)
    try {
      const data = await getSellerProducts(token)
      if (Array.isArray(data)) setProducts(data)
    } finally { setLoading(false) }
  }

  const fetchAnalytics = async () => {
    setLoading(true)
    try {
      const data = await getSellerAnalytics(token)
      if (data) setAnalytics(data)
    } finally { setLoading(false) }
  }

  const openModal = (product?: Product) => {
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
    setMessage('')
    setProductModal(true)
  }

  const saveProduct = async () => {
    if (!productForm.name || !productForm.price) {
      setMessage('❌ Name and price are required')
      return
    }
    setSaveLoading(true)
    setMessage('')
    try {
      const body = {
        name: productForm.name, price: Number(productForm.price),
        description: productForm.description, image: productForm.image,
        category: productForm.category, countInStock: Number(productForm.countInStock)
      }
      if (editingProduct) {
        await sellerUpdateProduct(editingProduct._id, body, token)
        setMessage('✅ Product updated! Awaiting admin re-approval.')
      } else {
        await sellerCreateProduct(body, token)
        setMessage('✅ Product submitted for admin approval!')
      }
      fetchProducts()
      setTimeout(() => setProductModal(false), 1500)
    } catch {
      setMessage('❌ Something went wrong')
    } finally { setSaveLoading(false) }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await sellerDeleteProduct(id, token)
    fetchProducts()
  }

  const getApprovalBadge = (isApproved: boolean) => {
    if (isApproved) return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
        <CheckCircle className="w-3 h-3" /> Live
      </span>
    )
    return (
      <span className="flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
        <Clock className="w-3 h-3" /> Pending
      </span>
    )
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: TrendingUp },
    { id: 'products', label: 'My Products', icon: Package },
    { id: 'upload', label: 'Upload Product', icon: Plus },
  ]

  if (!user || user.sellerStatus !== 'approved') return null

  // Reusable form fields (text inputs only)
  const textFields = [
    { label: 'Product Name *', key: 'name', type: 'text', placeholder: 'e.g. Handmade Watch' },
    { label: 'Price ($) *', key: 'price', type: 'number', placeholder: '29.99' },
    { label: 'Category', key: 'category', type: 'text', placeholder: 'e.g. Accessories' },
    { label: 'Stock Count', key: 'countInStock', type: 'number', placeholder: '50' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-primary-foreground">
              <Store className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Seller Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {user.name}!</p>
            </div>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
            ✅ Verified Seller
          </span>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border mb-8">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition -mb-px whitespace-nowrap ${
                activeTab === tab.id
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
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

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && !loading && (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: 'Total Revenue', icon: DollarSign, value: `$${(analytics?.totalRevenue || 0).toFixed(2)}`, color: 'text-green-600 bg-green-100' },
                { label: 'Total Products', icon: Package, value: analytics?.totalProducts || 0, color: 'text-blue-600 bg-blue-100' },
                { label: 'Units Sold', icon: ShoppingBag, value: analytics?.totalSold || 0, color: 'text-purple-600 bg-purple-100' },
              ].map((stat) => (
                <div key={stat.label} className="border border-border rounded-lg p-6">
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${stat.color}`}>
                    <stat.icon className="w-5 h-5" />
                  </div>
                  <p className="text-3xl font-bold">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                </div>
              ))}
            </div>

            <div className="border border-border rounded-lg p-6">
              <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Your Top Products
              </h2>
              {!analytics?.topProducts?.length ? (
                <div className="text-center py-8">
                  <ShoppingBag className="w-10 h-10 text-muted-foreground mx-auto mb-3" />
                  <p className="text-muted-foreground">No sales data yet. Start by uploading products!</p>
                  <Button className="mt-4" onClick={() => setActiveTab('upload')}>
                    Upload Your First Product
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  {analytics.topProducts.map((p, i) => (
                    <div key={p.name} className="flex items-center gap-4 p-3 bg-muted/30 rounded-lg">
                      <span className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">{i + 1}</span>
                      <div className="flex-1">
                        <p className="font-medium">{p.name}</p>
                        <p className="text-xs text-muted-foreground">{p.totalSold} units sold</p>
                      </div>
                      <p className="font-bold text-green-600">${p.revenue.toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border border-blue-200 bg-blue-50 rounded-lg p-4 flex items-start gap-3">
              <div className="text-blue-500 mt-0.5">💡</div>
              <div>
                <p className="text-sm font-semibold text-blue-700">How it works</p>
                <p className="text-sm text-blue-600">Upload a product → Admin reviews & approves → Product goes live on the store → You earn revenue from every sale!</p>
              </div>
            </div>
          </div>
        )}

        {/* MY PRODUCTS TAB */}
        {activeTab === 'products' && !loading && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <p className="text-muted-foreground">{products.length} products</p>
              <Button onClick={() => setActiveTab('upload')} className="gap-2">
                <Plus className="w-4 h-4" /> Upload New
              </Button>
            </div>
            {products.length === 0 ? (
              <div className="text-center py-16 border border-border rounded-lg">
                <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No products yet</h3>
                <p className="text-muted-foreground mb-6">Upload your first product to get started</p>
                <Button onClick={() => setActiveTab('upload')}>Upload Product</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
                  <div key={product._id} className="border border-border rounded-lg overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-40 object-cover" />
                    ) : (
                      <div className="w-full h-40 bg-muted flex items-center justify-center">
                        <Package className="w-10 h-10 text-muted-foreground" />
                      </div>
                    )}
                    <div className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <p className="font-semibold">{product.name}</p>
                        {getApprovalBadge(product.isApproved)}
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{product.category}</p>
                      <p className="text-primary font-bold">${product.price}</p>
                      <p className="text-xs text-muted-foreground mt-1">Stock: {product.countInStock}</p>
                      <div className="flex gap-2 mt-4">
                        <Button size="sm" variant="outline" className="flex-1 gap-1" onClick={() => openModal(product)}>
                          <Pencil className="w-3 h-3" /> Edit
                        </Button>
                        <Button size="sm" variant="destructive" className="gap-1" onClick={() => handleDelete(product._id)}>
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* UPLOAD TAB */}
        {activeTab === 'upload' && (
          <div className="max-w-xl mx-auto">
            <div className="border border-border rounded-lg p-6">
              <div className="flex items-center gap-3 mb-6">
                <Plus className="w-6 h-6 text-primary" />
                <h2 className="text-xl font-bold">Upload New Product</h2>
              </div>
              <div className="space-y-4">

                {/* Text fields */}
                {textFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-2">{field.label}</label>
                    <input type={field.type}
                      value={(productForm as any)[field.key]}
                      onChange={(e) => setProductForm({ ...productForm, [field.key]: e.target.value })}
                      placeholder={field.placeholder}
                      className="w-full px-3 py-2 rounded border border-border bg-background" />
                  </div>
                ))}

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium mb-2">Description</label>
                  <textarea
                    value={productForm.description}
                    onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                    placeholder="Describe your product..."
                    rows={4}
                    className="w-full px-3 py-2 rounded border border-border bg-background resize-none" />
                </div>

                {/* Image Upload */}
                <div>
                  <label className="block text-sm font-medium mb-2">Product Image</label>
                  <ImageUpload
                    value={productForm.image}
                    onChange={(url) => setProductForm({ ...productForm, image: url })}
                  />
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                  ⏳ Your product will be reviewed by admin before going live on the store.
                </div>

                {message && (
                  <p className={`text-sm px-4 py-2 rounded-lg ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                    {message}
                  </p>
                )}

                <div className="flex gap-3">
                  <Button variant="outline" className="flex-1"
                    onClick={() => {
                      setProductForm({ name: '', price: '', description: '', image: '', category: '', countInStock: '' })
                      setMessage('')
                    }}>
                    Clear
                  </Button>
                  <Button className="flex-1 gap-2" onClick={saveProduct} disabled={saveLoading}>
                    {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                    {saveLoading ? 'Submitting...' : 'Submit for Approval'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Edit Product Modal */}
      {productModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-6">Edit Product</h2>
            <div className="space-y-4">

              {/* Text fields */}
              {textFields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium mb-2">{field.label}</label>
                  <input type={field.type}
                    value={(productForm as any)[field.key]}
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

              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium mb-2">Product Image</label>
                <ImageUpload
                  value={productForm.image}
                  onChange={(url) => setProductForm({ ...productForm, image: url })}
                />
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-700">
                ⚠️ Editing will require admin re-approval before the product goes live again.
              </div>

              {message && (
                <p className={`text-sm px-4 py-2 rounded-lg ${message.startsWith('✅') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'}`}>
                  {message}
                </p>
              )}
            </div>
            <div className="flex gap-3 mt-6">
              <Button variant="outline" className="flex-1" onClick={() => setProductModal(false)}>Cancel</Button>
              <Button className="flex-1" onClick={saveProduct} disabled={saveLoading}>
                {saveLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}