'use client'

import React, { useState } from 'react'
import { ChevronDown } from 'lucide-react'

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const faqs = [
    {
      question: 'How does Shortify work?',
      answer: 'Shortify uses advanced algorithms to convert long URLs into short, memorable links. You can customize the short identifier and use your own domain for branding.'
    },
    {
      question: 'Can I use my own domain?',
      answer: 'Yes! You can add your own custom domain and create branded short links. We provide simple setup instructions for DNS configuration.'
    },
    {
      question: 'Is there a limit on link creation?',
      answer: 'No limits! Create as many short links and QR codes as you need. Our infrastructure can handle unlimited link creation.'
    },
    {
      question: 'How accurate is the analytics?',
      answer: 'Our analytics are real-time and highly accurate. We track clicks, geographic data, referrers, and device information for each link.'
    },
    {
      question: 'Can I delete or edit links?',
      answer: 'Yes, you can edit custom identifiers and delete links anytime from your dashboard. Deleted links will no longer redirect.'
    },
    {
      question: 'Is my data secure?',
      answer: 'We use enterprise-grade encryption and security measures. All data is encrypted in transit and at rest. We also comply with GDPR and other regulations.'
    },
    {
      question: 'What payment options do you accept?',
      answer: 'We offer free and premium plans. Premium plans can be paid with credit card, PayPal, or other payment methods. No credit card required for the free plan.'
    }
  ]

  return (
    <section id="faq" className="py-20 px-4">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-4xl font-bold text-center mb-4">Frequently Asked Questions</h2>
        <p className="text-center text-muted-foreground mb-12">
          Find answers to common questions about Shortify
        </p>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div 
              key={index}
              className="bg-card rounded-lg border border-border overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-4 flex items-center justify-between btn-smooth text-left hover:bg-muted/40"
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown 
                  className={`w-5 h-5 text-muted-foreground ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              {openIndex === index && (
                <div className="px-6 py-4 bg-muted/20 border-t border-border text-muted-foreground">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
