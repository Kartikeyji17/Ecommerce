'use client'

import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'

// Mock featured products
const FEATURED_PRODUCTS = [
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
]

export default function Home() {
  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-primary to-primary/80 text-primary-foreground py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="flex flex-col gap-6">
              <h1 className="text-4xl md:text-5xl font-bold leading-tight text-balance">
                Discover Your Perfect Style
              </h1>
              <p className="text-lg text-primary-foreground/90 text-pretty">
                Curated collection of premium products designed for the modern lifestyle. Quality, style, and excellence in every piece.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link href="/products">
                  <Button
                    size="lg"
                    className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2"
                  >
                    Shop Now
                    <ArrowRight className="w-4 h-4" />
                  </Button>
                </Link>
                <Link href="/about">
                  <Button
                    size="lg"
                    variant="outline"
                    className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10"
                  >
                    Learn More
                  </Button>
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap gap-4 text-sm pt-4">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  Free Shipping on Orders Over $50
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-foreground rounded-full" />
                  30-Day Money Back Guarantee
                </div>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative h-96 md:h-full">
              <div className="absolute inset-0 bg-gradient-to-br from-accent/20 to-accent/5 rounded-lg" />
              <img
                src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop"
                alt="Featured Product"
                className="w-full h-full object-cover rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">
              Handpicked selection of our most loved items
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURED_PRODUCTS.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/products">
              <Button size="lg" variant="outline" className="gap-2">
                View All Products
                <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-secondary/50">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-bold text-xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over $50. Most orders ship within 24 hours.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-bold text-xl">
                🛡️
              </div>
              <h3 className="text-xl font-bold">Secure Checkout</h3>
              <p className="text-muted-foreground">
                Industry-leading encryption keeps your data safe. Powered by Stripe.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-lg flex items-center justify-center font-bold text-xl">
                ✨
              </div>
              <h3 className="text-xl font-bold">Premium Quality</h3>
              <p className="text-muted-foreground">
                All products carefully selected and tested for quality and durability.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-lg bg-accent text-accent-foreground p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-lg mb-8 text-accent-foreground/90 max-w-2xl mx-auto">
              Get exclusive offers, new product launches, and special discounts delivered to your inbox.
            </p>
            <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => { e.preventDefault() }}>
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded bg-accent-foreground text-accent placeholder:text-accent/50"
              />
              <Button className="bg-accent-foreground text-accent hover:bg-accent-foreground/90">
                Subscribe
              </Button>
            </form>
          </div>
        </div>
      </section>
    </div>
  )
}
