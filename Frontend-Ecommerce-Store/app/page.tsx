import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { ProductCard } from '@/components/product-card'
import { NewsletterForm } from '@/components/newsletter-form'
import { getProducts } from '@/lib/api'

export default async function Home() {
  let products = [];

  try {
    products = await getProducts();
  } catch (error) {
    console.error("Error fetching products:", error);
  }

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
                    className="border-primary-foreground text-primary hover:bg-primary-foreground/10"
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

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Featured Products</h2>
            <p className="text-lg text-muted-foreground">
              Real products from backend
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.length > 0 ? (
              products.slice(0, 4).map((product: any) => (
                <ProductCard key={product._id} product={product} />
              ))
            ) : (
              <p>No products found</p>
            )}
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
              <div className="w-12 h-12 bg-white text-accent-foreground rounded-lg flex items-center justify-center font-bold text-xl">
                ⚡
              </div>
              <h3 className="text-xl font-bold">Fast Shipping</h3>
              <p className="text-muted-foreground">
                Free shipping on orders over $50. Most orders ship within 24 hours.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-white text-accent-foreground rounded-lg flex items-center justify-center font-bold text-xl">
                🛡️
              </div>
              <h3 className="text-xl font-bold">Secure Checkout</h3>
              <p className="text-muted-foreground">
                Industry-leading encryption keeps your data safe. Powered by Stripe.
              </p>
            </div>

            <div className="flex flex-col gap-4">
              <div className="w-12 h-12 bg-white text-accent-foreground rounded-lg flex items-center justify-center font-bold text-xl">
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
            <NewsletterForm />
          </div>
        </div>
      </section>
    </div>
  )
}