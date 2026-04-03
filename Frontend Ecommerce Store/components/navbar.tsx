'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, LogOut, User } from 'lucide-react'
import { useState } from 'react'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { items } = useCart()
  const { user, logout } = useAuth()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-primary-foreground">
              ✨
            </div>
            <span className="hidden sm:inline">Store</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition">
              Products
            </Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition">
              About
            </Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition">
              Contact
            </Link>
          </div>

          {/* Right side icons */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="hidden sm:flex items-center gap-2">
                <span className="text-sm text-muted-foreground">{user.name}</span>
                {user.isAdmin && (
                  <Link href="/admin" className="text-xs font-semibold px-2 py-1 bg-accent text-accent-foreground rounded">
                    Admin
                  </Link>
                )}
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={logout}
                  className="gap-2"
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </div>
            ) : (
              <Link href="/auth/login">
                <Button variant="outline" size="sm" className="gap-2">
                  <User className="w-4 h-4" />
                  <span className="hidden sm:inline">Login</span>
                </Button>
              </Link>
            )}

            {/* Cart */}
            <Link href="/cart">
              <Button variant="outline" size="sm" className="relative gap-2">
                <ShoppingCart className="w-4 h-4" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-accent text-accent-foreground text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
                <span className="hidden sm:inline text-xs">{cartCount > 0 ? cartCount : ''}</span>
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button
              className="md:hidden p-2"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link href="/products" className="block px-2 py-2 hover:bg-secondary rounded">
              Products
            </Link>
            <Link href="/about" className="block px-2 py-2 hover:bg-secondary rounded">
              About
            </Link>
            <Link href="/contact" className="block px-2 py-2 hover:bg-secondary rounded">
              Contact
            </Link>
            {user ? (
              <>
                <div className="px-2 py-2 text-sm">{user.name}</div>
                {user.isAdmin && (
                  <Link href="/admin" className="block px-2 py-2 hover:bg-secondary rounded">
                    Admin Dashboard
                  </Link>
                )}
                <Button
                  variant="ghost"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                >
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <Link href="/auth/login" className="block px-2 py-2 hover:bg-secondary rounded">
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
