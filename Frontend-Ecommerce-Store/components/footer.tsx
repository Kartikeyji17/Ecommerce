'use client'

import Link from 'next/link'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="w-full border-t border-border bg-secondary/30 mt-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="font-bold text-sm mb-4">About Store</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-foreground transition">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-foreground transition">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-foreground transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-bold text-sm mb-4">Support</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/contact" className="hover:text-foreground transition">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-foreground transition">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="hover:text-foreground transition">
                  Shipping Info
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-bold text-sm mb-4">Legal</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <Link href="/privacy" className="hover:text-foreground transition">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-foreground transition">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/returns" className="hover:text-foreground transition">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-bold text-sm mb-4">Newsletter</h3>
            <p className="text-sm text-muted-foreground mb-3">
              Subscribe to get special offers and updates.
            </p>
            <form className="flex gap-2" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-3 py-2 rounded bg-input text-sm text-foreground placeholder:text-muted-foreground"
              />
              <button className="px-3 py-2 bg-primary text-primary-foreground text-sm rounded hover:bg-primary/90 transition">
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-border pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
          <p>&copy; {currentYear} Store. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
              Twitter
            </a>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
              Facebook
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition">
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
