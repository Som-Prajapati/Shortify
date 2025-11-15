'use client'

import React from 'react'
import { Button } from '@/components/ui/button'

interface HeroProps {
  onGetStarted: () => void
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="pt-12 sm:pt-16 md:pt-20 pb-12 sm:pb-16 px-3 sm:px-4 md:px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-balance">
          Your One-Stop Solution for Branding and Managing Links
        </h1>
        <p className="text-sm sm:text-base md:text-lg lg:text-xl text-muted-foreground mb-6 sm:mb-8 max-w-2xl mx-auto text-balance">
          Create custom short links, generate QR codes, and manage your brand identity all in one powerful platform.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
          <Button 
            size="lg" 
            onClick={onGetStarted}
            className="bg-primary hover:bg-primary/90 btn-smooth text-sm sm:text-base w-full sm:w-auto"
          >
            Get Started Free
          </Button>
          <Button 
            size="lg" 
            variant="outline"
            className="btn-smooth text-sm sm:text-base w-full sm:w-auto"
          >
            View Demo
          </Button>
        </div>
      </div>
    </section>
  )
}
