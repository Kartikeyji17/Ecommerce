'use client'

import Link from 'next/link'
import Image from 'next/image'
import { Heart, ShoppingCart } from 'lucide-react'
import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { useCart } from '@/context/cart-context'

interface ProductCardProps {
  product: {
    id: string
    name: string
    price: number
    image: string
    category?: string
    rating?: number
  }
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorite, setIsFavorite] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const { addItem } = useCart()

  const handleAddToCart = async () => {
    setIsAdding(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 300))
    
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      quantity: 1,
      image: product.image,
    })
    
    setIsAdding(false)
  }

  return (
    <div className="group flex flex-col h-full rounded-lg border border-border bg-card overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image Container */}
      <div className="relative overflow-hidden bg-secondary/50 aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Favorite button */}
        <button
          onClick={() => setIsFavorite(!isFavorite)}
          className="absolute top-3 right-3 p-2 bg-background rounded-full shadow-md hover:bg-primary hover:text-primary-foreground transition"
        >
          <Heart
            className={`w-5 h-5 ${isFavorite ? 'fill-current' : ''}`}
          />
        </button>

        {/* Category badge */}
        {product.category && (
          <div className="absolute bottom-3 left-3 bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
            {product.category}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4">
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm line-clamp-2 hover:text-primary transition mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mb-3">
            <div className="flex gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <span
                  key={i}
                  className={`text-xs ${
                    i < Math.floor(product.rating!) ? 'text-accent' : 'text-border'
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <span className="text-xs text-muted-foreground">({product.rating})</span>
          </div>
        )}

        {/* Price and Action */}
        <div className="flex items-end justify-between gap-2 mt-auto pt-4 border-t border-border">
          <div>
            <p className="text-lg font-bold text-primary">
              ${product.price.toFixed(2)}
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isAdding}
            className="gap-2"
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span>
          </Button>
        </div>
      </div>
    </div>
  )
}
