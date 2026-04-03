'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Heart, ShoppingCart, ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

// Mock product details
const MOCK_PRODUCTS: Record<string, any> = {
  '1': {
    id: '1',
    name: 'Classic Leather Watch',
    price: 129.99,
    rating: 4.5,
    reviews: 128,
    image: 'https://images.unsplash.com/photo-1523170335258-f5ed11844a49?w=600&h=600&fit=crop',
    category: 'Accessories',
    description:
      'A timeless leather watch that combines elegance with functionality. Handcrafted with premium genuine leather and precise Swiss movements.',
    features: [
      'Swiss quartz movement',
      'Genuine leather strap',
      'Water resistant up to 50m',
      'Date display window',
      'Scratch-resistant mineral crystal',
    ],
    inStock: true,
    colors: ['Black', 'Brown', 'Tan'],
  },
  '2': {
    id: '2',
    name: 'Premium Sunglasses',
    price: 199.99,
    rating: 4.8,
    reviews: 256,
    image: 'https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&h=600&fit=crop',
    category: 'Accessories',
    description:
      'Style meets protection with these premium UV-protective sunglasses. Perfect for any occasion with their versatile design.',
    features: [
      '100% UV protection',
      'Polarized lenses',
      'Lightweight frame',
      'Includes protective case',
      'Anti-reflective coating',
    ],
    inStock: true,
    colors: ['Black', 'Brown', 'Gold'],
  },
  '3': {
    id: '3',
    name: 'Wireless Headphones',
    price: 249.99,
    rating: 4.6,
    reviews: 189,
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600&h=600&fit=crop',
    category: 'Electronics',
    description:
      'Experience crystal-clear audio with active noise cancellation. Premium wireless headphones for the audiophile.',
    features: [
      '40-hour battery life',
      'Active noise cancellation',
      'Bluetooth 5.0',
      'Foldable design',
      'Built-in microphone',
    ],
    inStock: true,
    colors: ['Black', 'Silver'],
  },
  '4': {
    id: '4',
    name: 'Minimalist Backpack',
    price: 89.99,
    rating: 4.4,
    reviews: 95,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop',
    category: 'Bags',
    description:
      'Clean, minimalist design meets functionality. The perfect everyday backpack for work, travel, or school.',
    features: [
      '25L capacity',
      'Water-resistant material',
      'Laptop compartment',
      'Ergonomic design',
      'Multiple pockets',
    ],
    inStock: true,
    colors: ['Black', 'Navy', 'Grey'],
  },
}

export default function ProductDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const product = MOCK_PRODUCTS[params.id]
  const [quantity, setQuantity] = useState(1)
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || '')
  const { addItem } = useCart()

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product not found</h1>
          <Button onClick={() => router.push('/products')}>
            Back to Products
          </Button>
        </div>
      </div>
    )
  }

  const handleAddToCart = async () => {
    setIsAdding(true)
    await new Promise((resolve) => setTimeout(resolve, 300))

    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity,
      image: product.image,
    })

    setIsAdding(false)
    setQuantity(1)
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition mb-8"
        >
          <ChevronLeft className="w-4 h-4" />
          Back
        </button>

        {/* Product Details */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Image */}
          <div className="flex items-center justify-center bg-secondary/50 rounded-lg aspect-square overflow-hidden">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Info */}
          <div className="flex flex-col justify-between">
            <div>
              <div className="mb-4">
                <span className="text-sm text-primary font-semibold">{product.category}</span>
              </div>

              <h1 className="text-4xl font-bold mb-4">{product.name}</h1>

              {/* Rating */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <span
                      key={i}
                      className={`text-xl ${
                        i < Math.floor(product.rating) ? 'text-accent' : 'text-border'
                      }`}
                    >
                      ★
                    </span>
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>

              {/* Price */}
              <div className="mb-6">
                <p className="text-4xl font-bold text-primary">
                  ${product.price.toFixed(2)}
                </p>
              </div>

              {/* Description */}
              <p className="text-lg text-muted-foreground mb-8">{product.description}</p>

              {/* Features */}
              <div className="mb-8">
                <h3 className="font-bold mb-4">Key Features</h3>
                <ul className="space-y-2">
                  {product.features.map((feature: string, index: number) => (
                    <li key={index} className="flex items-center gap-3 text-sm">
                      <div className="w-2 h-2 bg-accent rounded-full" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Purchase Section */}
            <div className="space-y-4 border-t border-border pt-6">
              {/* Color Selection */}
              {product.colors && product.colors.length > 0 && (
                <div>
                  <label className="block text-sm font-medium mb-2">Color</label>
                  <div className="flex gap-2 flex-wrap">
                    {product.colors.map((color: string) => (
                      <button
                        key={color}
                        onClick={() => setSelectedColor(color)}
                        className={`px-4 py-2 rounded border transition ${
                          selectedColor === color
                            ? 'border-primary bg-primary text-primary-foreground'
                            : 'border-border hover:border-primary'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div>
                <label className="block text-sm font-medium mb-2">Quantity</label>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 rounded border border-border hover:bg-secondary"
                  >
                    −
                  </button>
                  <span className="w-12 text-center font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 rounded border border-border hover:bg-secondary"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Stock Status */}
              {product.inStock ? (
                <p className="text-sm text-green-600 font-medium">✓ In Stock</p>
              ) : (
                <p className="text-sm text-red-600 font-medium">Out of Stock</p>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 flex-col sm:flex-row">
                <Button
                  size="lg"
                  onClick={handleAddToCart}
                  disabled={isAdding || !product.inStock}
                  className="flex-1 gap-2"
                >
                  <ShoppingCart className="w-5 h-5" />
                  Add to Cart
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  onClick={() => setIsFavorite(!isFavorite)}
                >
                  <Heart
                    className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
                  />
                </Button>
              </div>

              {/* Info */}
              <div className="space-y-2 text-sm text-muted-foreground pt-4 border-t border-border">
                <p>✓ Free shipping on orders over $50</p>
                <p>✓ 30-day money back guarantee</p>
                <p>✓ Secure checkout with Stripe</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        <div className="border-t border-border pt-12">
          <h2 className="text-3xl font-bold mb-8">You might also like</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.values(MOCK_PRODUCTS)
              .filter((p: any) => p.id !== product.id)
              .slice(0, 4)
              .map((relatedProduct: any) => (
                <div
                  key={relatedProduct.id}
                  className="rounded-lg border border-border overflow-hidden hover:shadow-lg transition cursor-pointer"
                  onClick={() => router.push(`/products/${relatedProduct.id}`)}
                >
                  <div className="aspect-square overflow-hidden bg-secondary/50">
                    <img
                      src={relatedProduct.image}
                      alt={relatedProduct.name}
                      className="w-full h-full object-cover hover:scale-105 transition"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold line-clamp-2 mb-2">
                      {relatedProduct.name}
                    </h3>
                    <p className="text-primary font-bold">
                      ${relatedProduct.price.toFixed(2)}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
