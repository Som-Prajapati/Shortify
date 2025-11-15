'use client'

import React from 'react'
import { Copy, Trash2, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface UserHistoryProps {
  activeTab: string
}

export default function UserHistory({ activeTab }: UserHistoryProps) {
  const urlHistory = [
    {
      id: 1,
      shortUrl: 'short.link/abc123',
      originalUrl: 'https://example.com/very/long/url/that/needs/shortening',
      clicks: 1234,
      createdAt: '2 days ago'
    },
    {
      id: 2,
      shortUrl: 'short.link/xyz789',
      originalUrl: 'https://another-example.com/another/long/url',
      clicks: 567,
      createdAt: '5 days ago'
    },
    {
      id: 3,
      shortUrl: 'short.link/def456',
      originalUrl: 'https://third-example.com/marketing-campaign',
      clicks: 89,
      createdAt: '1 week ago'
    }
  ]

  const qrHistory = [
    {
      id: 1,
      content: 'https://example.com/product',
      type: 'URL',
      createdAt: '3 days ago'
    },
    {
      id: 2,
      content: 'john@example.com',
      type: 'Email',
      createdAt: '1 week ago'
    },
    {
      id: 3,
      content: '+1 234 567 8900',
      type: 'Phone',
      createdAt: '2 weeks ago'
    }
  ]

  return (
    <div className="mt-16 max-w-6xl mx-auto">
      <h3 className="text-2xl font-bold mb-6">
        {activeTab === 'url' ? 'Your Shortened URLs' : 'Your Generated QR Codes'}
      </h3>

      {activeTab === 'url' ? (
        <div className="space-y-3">
          {urlHistory.map((item) => (
            <div 
              key={item.id} 
              className="bg-card rounded-lg border border-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1 min-w-0">
                <p className="font-medium text-primary mb-1">{item.shortUrl}</p>
                <p className="text-sm text-muted-foreground truncate">{item.originalUrl}</p>
                <div className="flex gap-4 mt-2 text-xs text-muted-foreground">
                  <span>👁️ {item.clicks} clicks</span>
                  <span>{item.createdAt}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {qrHistory.map((item) => (
            <div 
              key={item.id} 
              className="bg-card rounded-lg border border-border p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
            >
              <div className="flex-1">
                <p className="font-medium mb-1">
                  <span className="px-2 py-1 text-xs bg-accent text-accent-foreground rounded mr-2">
                    {item.type}
                  </span>
                  {item.content}
                </p>
                <p className="text-sm text-muted-foreground">{item.createdAt}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Copy className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" className="text-destructive">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
