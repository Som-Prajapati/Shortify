'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Copy, Download, QrCode, Zap } from 'lucide-react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

interface QRGeneratorTabProps {
  isLoggedIn: boolean
  onLoginRequired: () => void
}

export default function QRGeneratorTab({ 
  isLoggedIn, 
  onLoginRequired 
}: QRGeneratorTabProps) {
  const [qrInput, setQrInput] = useState('')
  const [qrType, setQrType] = useState('url')
  const [qrSize, setQrSize] = useState('200')
  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)

  const handleGenerateQR = () => {
    if (!isLoggedIn) {
      onLoginRequired()
      return
    }

    if (!qrInput) {
      alert('Please enter content to generate QR code')
      return
    }

    setGenerated(true)
  }

  const handleDownload = () => {
    alert('QR code downloaded!')
  }

  const handleCopy = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-br from-card to-card/95 rounded-xl border border-border/50 p-6 sm:p-8 md:p-10 max-w-3xl mx-auto shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2.5 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-lg">
            <QrCode className="w-5 h-5 text-primary" />
          </div>
          <h3 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
            Generate QR Code
          </h3>
        </div>

        <div className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                Content Type
              </label>
              <Select value={qrType} onValueChange={setQrType}>
                <SelectTrigger className="text-xs sm:text-sm h-11 sm:h-10 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="url" className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10">URL</SelectItem>
                  <SelectItem value="text" className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10">Text</SelectItem>
                  <SelectItem value="email" className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10">Email</SelectItem>
                  <SelectItem value="phone" className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10">Phone</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
                QR Code Size
              </label>
              <Select value={qrSize} onValueChange={setQrSize}>
                <SelectTrigger className="text-xs sm:text-sm h-11 sm:h-10 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  <SelectItem value="150" className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10">Small (150px)</SelectItem>
                  <SelectItem value="200" className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10">Medium (200px)</SelectItem>
                  <SelectItem value="300" className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10">Large (300px)</SelectItem>
                  <SelectItem value="500" className="text-xs sm:text-sm cursor-pointer hover:bg-primary/10">Extra Large (500px)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="group">
            <label className="text-xs sm:text-sm font-semibold block mb-3 text-foreground/80">
              {qrType === 'url' ? 'URL' : qrType === 'email' ? 'Email Address' : qrType === 'phone' ? 'Phone Number' : 'Text'}
            </label>
            <Input
              type={qrType === 'url' ? 'url' : 'text'}
              placeholder={qrType === 'url' ? 'https://example.com' : qrType === 'email' ? 'name@example.com' : qrType === 'phone' ? '+1 234 567 8900' : 'Enter your text...'}
              value={qrInput}
              onChange={(e) => setQrInput(e.target.value)}
              className="text-xs sm:text-sm pl-4 py-3 sm:py-3.5 rounded-lg border-2 border-border/50 focus:border-primary/50 focus:shadow-lg focus:shadow-primary/10 transition-all duration-300 bg-card/50 backdrop-blur-sm"
            />
          </div>

          {generated && (
            <div className="bg-gradient-to-r from-primary/5 to-secondary/5 p-6 sm:p-8 rounded-lg border border-primary/20 backdrop-blur-sm flex flex-col items-center">
              <p className="text-xs sm:text-sm font-semibold text-foreground/70 mb-6">Your QR Code:</p>
              <div className="relative mb-6">
                <div 
                  className="bg-white p-6 rounded-lg border-4 border-gradient-to-r from-primary to-secondary shadow-xl hover:shadow-2xl transition-shadow duration-300"
                  style={{
                    width: qrSize + 'px',
                    height: qrSize + 'px',
                  }}
                >
                  <div className="w-full h-full bg-gradient-to-br from-primary to-secondary rounded opacity-80" />
                </div>
              </div>
              <div className="flex gap-3 flex-col sm:flex-row w-full">
                <Button 
                  variant="outline"
                  onClick={handleCopy}
                  className="flex-1 btn-smooth rounded-lg border-2 border-primary/30 hover:border-primary/50 hover:bg-primary/10 h-10 sm:h-11 transition-all duration-300"
                >
                  {copied ? (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4 mr-2" />
                      Copy
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleDownload}
                  className="flex-1 btn-smooth rounded-lg border-2 border-secondary/30 hover:border-secondary/50 hover:bg-secondary/10 h-10 sm:h-11 transition-all duration-300"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          )}

          <Button 
            onClick={handleGenerateQR}
            className="w-full bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 py-4 sm:py-5 md:py-6 btn-smooth text-sm sm:text-base rounded-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300 group relative overflow-hidden"
            size="lg"
          >
            <span className="flex items-center justify-center gap-2">
              <Zap className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
              Generate QR Code
            </span>
          </Button>
        </div>
      </div>
    </div>
  )
}
