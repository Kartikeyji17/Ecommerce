'use client'

import Link from 'next/link'
import { ShoppingCart, Menu, X, LogOut, User, Package, ChevronDown } from 'lucide-react'
import { useState, useRef, useEffect } from 'react'
import { useCart } from '@/context/cart-context'
import { useAuth } from '@/context/auth-context'
import { Button } from '@/components/ui/button'

export function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const { items } = useCart()
  const { user, logout } = useAuth()
  const cartCount = items.reduce((sum, item) => sum + item.quantity, 0)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

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
            <Link href="/products" className="text-sm font-medium hover:text-primary transition">Products</Link>
            <Link href="/about" className="text-sm font-medium hover:text-primary transition">About</Link>
            <Link href="/contact" className="text-sm font-medium hover:text-primary transition">Contact</Link>
          </div>

          {/* Right Side */}
          <div className="flex items-center gap-3">
            {user ? (
              <div className="relative hidden sm:block" ref={dropdownRef}>
                {/* Account Button */}
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-secondary transition"
                >
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground text-sm font-bold">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name?.split(' ')[0]}</span>
                  <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 w-56 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                    {/* User Info */}
                    <div className="px-4 py-3 border-b border-border">
                      <p className="font-semibold text-sm">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                    </div>

                    {/* Links */}
                    <Link
                      href="/profile"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition"
                    >
                      <User className="w-4 h-4 text-muted-foreground" />
                      My Profile
                    </Link>
                    <Link
                      href="/profile?tab=orders"
                      onClick={() => setIsDropdownOpen(false)}
                      className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition"
                    >
                      <Package className="w-4 h-4 text-muted-foreground" />
                      My Orders
                    </Link>

                    {user.isAdmin && (
                      <Link
                        href="/admin"
                        onClick={() => setIsDropdownOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-secondary transition"
                      >
                        <span className="text-xs font-bold px-1.5 py-0.5 bg-accent text-accent-foreground rounded">Admin</span>
                        Dashboard
                      </Link>
                    )}

                    <div className="border-t border-border mt-1 pt-1">
                      <button
                        onClick={() => { logout(); setIsDropdownOpen(false) }}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/10 transition w-full"
                      >
                        <LogOut className="w-4 h-4" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
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
              </Button>
            </Link>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-1">
            <Link href="/products" onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 hover:bg-secondary rounded-lg text-sm">Products</Link>
            <Link href="/about" onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 hover:bg-secondary rounded-lg text-sm">About</Link>
            <Link href="/contact" onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 hover:bg-secondary rounded-lg text-sm">Contact</Link>

            {user ? (
              <>
                <div className="border-t border-border pt-3 mt-2 px-3 py-2">
                  <p className="font-semibold text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">{user.email}</p>
                </div>
                <Link href="/profile" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg text-sm">
                  <User className="w-4 h-4" /> My Profile
                </Link>
                <Link href="/profile?tab=orders" onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2 hover:bg-secondary rounded-lg text-sm">
                  <Package className="w-4 h-4" /> My Orders
                </Link>
                {user.isAdmin && (
                  <Link href="/admin" onClick={() => setIsMenuOpen(false)}
                    className="block px-3 py-2 hover:bg-secondary rounded-lg text-sm">Admin Dashboard</Link>
                )}
                <button
                  onClick={() => { logout(); setIsMenuOpen(false) }}
                  className="flex items-center gap-2 px-3 py-2 text-destructive hover:bg-destructive/10 rounded-lg text-sm w-full"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </>
            ) : (
              <Link href="/auth/login" onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 hover:bg-secondary rounded-lg text-sm">Login</Link>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}