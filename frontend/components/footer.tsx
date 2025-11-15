'use client'

import React from 'react'
import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground py-8 sm:py-10 md:py-12 px-3 sm:px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 md:gap-8 mb-6 sm:mb-8">
          <div>
            <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">Product</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-90">
              <li><Link href="#" className="hover:opacity-100 transition">Features</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Pricing</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Security</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">Company</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-90">
              <li><Link href="#" className="hover:opacity-100 transition">About</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Blog</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Contact</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">Legal</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-90">
              <li><Link href="#" className="hover:opacity-100 transition">Privacy</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Terms</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">Cookies</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-2 sm:mb-4 text-sm sm:text-base">Connect</h4>
            <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm opacity-90">
              <li><Link href="#" className="hover:opacity-100 transition">Twitter</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">GitHub</Link></li>
              <li><Link href="#" className="hover:opacity-100 transition">LinkedIn</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/20 pt-6 sm:pt-8 flex flex-col md:flex-row justify-between items-center gap-3 sm:gap-4">
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="w-5 sm:w-6 h-5 sm:h-6 rounded bg-primary-foreground text-primary flex items-center justify-center font-bold text-xs sm:text-sm">
              S
            </div>
            <span className="font-bold text-sm sm:text-base">Shortify</span>
          </div>
          <p className="text-xs sm:text-sm opacity-90 text-center md:text-right">
            © 2025 Shortify. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
