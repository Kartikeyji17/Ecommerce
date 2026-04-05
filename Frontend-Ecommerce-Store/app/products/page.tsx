'use client'

import { useState, useMemo, useEffect } from 'react'
import { ChevronDown, Loader2 } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'
import { getProducts } from '@/lib/api'

const PRICE_RANGES = [
  { label: 'All Prices', min: 0, max: Infinity },
  { label: 'Under $50', min: 0, max: 50 },
  { label: '$50 - $150', min: 50, max: 150 },
  { label: '$150 - $300', min: 150, max: 300 },
  { label: 'Over $300', min: 300, max: Infinity },
]

const SORT_OPTIONS = [
  { label: 'Featured', value: 'featured' },
  { label: 'Price: Low to High', value: 'price-asc' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Newest', value: 'newest' },
  { label: 'Rating', value: 'rating' },
]

export default function ProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0])
  const [sortBy, setSortBy] = useState('featured')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const data = await getProducts()
        if (Array.isArray(data)) setProducts(data)
      } catch (err) {
        console.error('Failed to fetch products:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  // Dynamic categories from real data
  const categories = useMemo(() => {
    const cats = products.map((p) => p.category).filter(Boolean)
    return ['All', ...Array.from(new Set(cats))]
  }, [products])

  const filteredAndSortedProducts = useMemo(() => {
    let list = [...products]

    if (selectedCategory !== 'All') {
      list = list.filter((p) =>
        p.category?.toLowerCase() === selectedCategory.toLowerCase()
      )
    }

    list = list.filter(
      (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
    )

    switch (sortBy) {
      case 'price-asc':
        list.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        list.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        list.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    return list
  }, [products, selectedCategory, selectedPriceRange, sortBy])

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Our Products</h1>
          <p className="text-lg text-muted-foreground">
            Browse our curated collection of premium products
          </p>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center py-24">
            <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
          </div>
        )}

        {!loading && (
          <div className="flex gap-6 flex-col lg:flex-row">

            {/* Sidebar Filters */}
            <div className={`lg:block lg:w-64 ${isFilterOpen ? 'block' : 'hidden'} space-y-6 pb-6 lg:pb-0`}>

              {/* Categories — dynamic from real data */}
              <div className="border-b border-border pb-6">
                <h3 className="font-bold mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <label key={category}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                      <input type="radio" name="category"
                        checked={selectedCategory === category}
                        onChange={() => setSelectedCategory(category)}
                        className="w-4 h-4" />
                      <span className="text-sm capitalize">{category}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div className="border-b border-border pb-6">
                <h3 className="font-bold mb-4">Price Range</h3>
                <div className="space-y-2">
                  {PRICE_RANGES.map((range) => (
                    <label key={range.label}
                      className="flex items-center gap-2 cursor-pointer hover:text-primary transition">
                      <input type="radio" name="price"
                        checked={selectedPriceRange.label === range.label}
                        onChange={() => setSelectedPriceRange(range)}
                        className="w-4 h-4" />
                      <span className="text-sm">{range.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full"
                onClick={() => {
                  setSelectedCategory('All')
                  setSelectedPriceRange(PRICE_RANGES[0])
                }}>
                Clear Filters
              </Button>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
                <p className="text-sm text-muted-foreground">
                  Showing {filteredAndSortedProducts.length} products
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                      className="appearance-none px-3 py-2 pr-8 border border-border rounded bg-background text-sm">
                      {SORT_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                  </div>
                  <Button variant="outline" size="sm"
                    onClick={() => setIsFilterOpen(!isFilterOpen)}
                    className="lg:hidden">
                    {isFilterOpen ? 'Hide' : 'Show'} Filters
                  </Button>
                </div>
              </div>

              {/* Products Grid */}
              {filteredAndSortedProducts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredAndSortedProducts.map((product) => (
                    <ProductCard
                      key={product._id}
                      product={{
                        id: product._id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        category: product.category,
                        rating: product.rating,
                        countInStock: product.countInStock,
                      }}
                    />
                  ))}
                </div>
              ) : (
                <div className="text-center py-12 border border-border rounded-lg">
                  <p className="text-lg text-muted-foreground mb-4">No products found</p>
                  <Button variant="outline"
                    onClick={() => {
                      setSelectedCategory('All')
                      setSelectedPriceRange(PRICE_RANGES[0])
                    }}>
                    Clear Filters
                  </Button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}