'use client'

import React from 'react'
import { Zap, Shield, Gauge, BarChart3, Palette, Clock } from 'lucide-react'

export default function Features() {
  const features = [
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Powered by Redis and Bloom filters for instant link creation and redirection.'
    },
    {
      icon: Palette,
      title: 'Custom Branding',
      description: 'Use your own domain to create branded short links that reflect your brand.'
    },
    {
      icon: BarChart3,
      title: 'Detailed Analytics',
      description: 'Track clicks, traffic patterns, and engagement with comprehensive statistics.'
    },
    {
      icon: Shield,
      title: 'Secure & Reliable',
      description: 'Enterprise-grade security and 99.9% uptime guarantee for your links.'
    },
    {
      icon: Gauge,
      title: 'Easy Management',
      description: 'Intuitive dashboard to manage, edit, and delete your links anytime.'
    },
    {
      icon: Clock,
      title: 'QR Codes',
      description: 'Generate QR codes for any URL or text with customizable sizes.'
    }
  ]

  return (
    <section id="features" className="py-12 sm:py-16 md:py-20 px-3 sm:px-4 md:px-6">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-2 sm:mb-4">Powerful Features</h2>
        <p className="text-center text-xs sm:text-sm md:text-base text-muted-foreground mb-8 sm:mb-12 md:mb-16 max-w-2xl mx-auto">
          Everything you need to create, manage, and track your shortened links with confidence.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <div 
                key={index}
                className="bg-card rounded-lg border border-border p-4 sm:p-5 md:p-6 hover:border-primary transition"
              >
                <Icon className="w-8 sm:w-10 md:w-12 h-8 sm:h-10 md:h-12 text-primary mb-3 sm:mb-4" />
                <h3 className="text-base sm:text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-xs sm:text-sm md:text-base text-muted-foreground">{feature.description}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
