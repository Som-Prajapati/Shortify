'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface DomainModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function DomainModal({ isOpen, onClose }: DomainModalProps) {
  const [domainName, setDomainName] = useState('')
  const [step, setStep] = useState<'input' | 'verify'>('input')
  const [verified, setVerified] = useState(false)

  const handleAddDomain = () => {
    if (domainName) {
      setStep('verify')
    }
  }

  const handleVerify = () => {
    setVerified(true)
    setTimeout(() => {
      onClose()
      setDomainName('')
      setStep('input')
      setVerified(false)
    }, 1000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card rounded-lg shadow-xl max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold mb-2">Add Custom Domain</h2>
        <p className="text-muted-foreground mb-6">
          Add your own domain to create branded short links.
        </p>

        {step === 'input' ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium block mb-2">Domain Name</label>
              <Input
                type="text"
                placeholder="example.com"
                value={domainName}
                onChange={(e) => setDomainName(e.target.value)}
              />
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <h4 className="font-semibold text-sm mb-3">Setup Instructions:</h4>
              <ol className="text-sm text-muted-foreground space-y-2">
                <li>1. Go to your domain provider</li>
                <li>2. Add a CNAME record pointing to our servers</li>
                <li>3. Wait for DNS propagation (5-30 minutes)</li>
                <li>4. Return here and click verify</li>
              </ol>
            </div>

            <Button 
              onClick={handleAddDomain}
              disabled={!domainName}
              className="w-full bg-primary hover:bg-primary/90"
            >
              Continue to Verification
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm font-medium mb-2">Domain to verify:</p>
              <p className="text-primary font-semibold">{domainName}</p>
            </div>

            <div className="bg-muted/30 p-4 rounded-lg">
              <p className="text-sm text-muted-foreground mb-3">
                Make sure your DNS records are set up correctly. This may take a few minutes to propagate.
              </p>
            </div>

            <Button 
              onClick={handleVerify}
              disabled={verified}
              className="w-full bg-primary hover:bg-primary/90"
            >
              {verified ? 'Verified ✓' : 'Verify Domain'}
            </Button>

            <Button 
              onClick={() => setStep('input')}
              variant="outline"
              className="w-full"
            >
              Back
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
