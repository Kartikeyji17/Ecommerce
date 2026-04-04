'use client'

import { useState, useMemo } from 'react'
import { ChevronDown } from 'lucide-react'
import { ProductCard } from '@/components/product-card'
import { Button } from '@/components/ui/button'

const MOCK_PRODUCTS = [
  {
    id: '1',
    name: 'Classic Leather Watch',
    price: 129.99,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Premium Sunglasses',
    price: 199.99,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 4.8,
  },
  {
    id: '3',
    name: 'Wireless Headphones',
    price: 249.99,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.6,
  },
  {
    id: '4',
    name: 'Minimalist Backpack',
    price: 89.99,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=400&fit=crop',
    category: 'Bags',
    rating: 4.4,
  },
  {
    id: '5',
    name: 'Leather Messenger Bag',
    price: 159.99,
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&h=400&fit=crop',
    category: 'Bags',
    rating: 4.7,
  },
  {
    id: '6',
    name: 'Silk Scarf',
    price: 49.99,
    image: 'https://images.unsplash.com/photo-1520689414822-ab7625dfb3b0?w=400&h=400&fit=crop',
    category: 'Accessories',
    rating: 4.3,
  },
  {
    id: '7',
    name: 'Premium Camera',
    price: 599.99,
    image: 'https://images.unsplash.com/photo-1606986628025-35d57e735ae0?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.9,
  },
  {
    id: '8',
    name: 'Wireless Mouse',
    price: 79.99,
    image: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400&h=400&fit=crop',
    category: 'Electronics',
    rating: 4.5,
  },
]

const CATEGORIES = ['All', 'Accessories', 'Electronics', 'Bags']
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
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedPriceRange, setSelectedPriceRange] = useState(PRICE_RANGES[0])
  const [sortBy, setSortBy] = useState('featured')
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...MOCK_PRODUCTS]

    // Filter by category
    if (selectedCategory !== 'All') {
      products = products.filter((p) => p.category === selectedCategory)
    }

    // Filter by price
    products = products.filter(
      (p) => p.price >= selectedPriceRange.min && p.price <= selectedPriceRange.max
    )

    // Sort
    switch (sortBy) {
      case 'price-asc':
        products.sort((a, b) => a.price - b.price)
        break
      case 'price-desc':
        products.sort((a, b) => b.price - a.price)
        break
      case 'rating':
        products.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'newest':
        // Could be based on creation date in real app
        products.reverse()
        break
    }

    return products
  }, [selectedCategory, selectedPriceRange, sortBy])

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

        <div className="flex gap-6 flex-col lg:flex-row">
          {/* Sidebar Filters */}
          <div
            className={`lg:block lg:w-64 ${
              isFilterOpen ? 'block' : 'hidden'
            } space-y-6 pb-6 lg:pb-0`}
          >
            {/* Categories */}
            <div className="border-b border-border pb-6">
              <h3 className="font-bold mb-4">Categories</h3>
              <div className="space-y-2">
                {CATEGORIES.map((category) => (
                  <label
                    key={category}
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition"
                  >
                    <input
                      type="radio"
                      name="category"
                      checked={selectedCategory === category}
                      onChange={() => setSelectedCategory(category)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{category}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="border-b border-border pb-6">
              <h3 className="font-bold mb-4">Price Range</h3>
              <div className="space-y-2">
                {PRICE_RANGES.map((range) => (
                  <label
                    key={range.label}
                    className="flex items-center gap-2 cursor-pointer hover:text-primary transition"
                  >
                    <input
                      type="radio"
                      name="price"
                      checked={selectedPriceRange.label === range.label}
                      onChange={() => setSelectedPriceRange(range)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm">{range.label}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                setSelectedCategory('All')
                setSelectedPriceRange(PRICE_RANGES[0])
              }}
            >
              Clear Filters
            </Button>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Sort and Mobile Filter Toggle */}
            <div className="flex items-center justify-between gap-4 mb-6 pb-6 border-b border-border">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAndSortedProducts.length} products
              </p>

              <div className="flex items-center gap-3">
                {/* Sort Dropdown */}
                <div className="relative">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="appearance-none px-3 py-2 pr-8 border border-border rounded bg-background text-sm"
                  >
                    {SORT_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none" />
                </div>

                {/* Mobile Filter Toggle */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="lg:hidden"
                >
                  {isFilterOpen ? 'Hide' : 'Show'} Filters
                </Button>
              </div>
            </div>

            {/* Products Grid */}
            {filteredAndSortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredAndSortedProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">No products found</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSelectedCategory('All')
                    setSelectedPriceRange(PRICE_RANGES[0])
                  }}
                >
                  Clear Filters
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
