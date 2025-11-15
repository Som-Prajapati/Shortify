'use client'

import React from 'react'

export default function OneStopSolution() {
  return (
    <section id="solution" className="py-20 px-4 bg-primary/5">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-4xl font-bold mb-8">
          Your One-Stop Solution for Branding and Managing Links
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          <div>
            <h3 className="text-2xl font-semibold mb-4">URL Shortening</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Create unlimited short links instantly</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Custom short identifiers for branding</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Support for multiple custom domains</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Real-time click tracking and analytics</span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-2xl font-semibold mb-4">QR Code Generation</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Generate QR codes for URLs and text</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Multiple size options for any use case</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Download QR codes as images</span>
              </li>
              <li className="flex gap-3">
                <span className="text-primary">✓</span>
                <span>Track QR code scans and engagement</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}
