'use client'

import React, { useState } from 'react'
import { X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  mode: 'login' | 'signup'
  onModeChange: (mode: 'login' | 'signup') => void
  onSuccess: () => void
}

export default function AuthModal({ isOpen, onClose, mode, onModeChange, onSuccess }: AuthModalProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    
    // Simulate API call
    setTimeout(() => {
      setLoading(false)
      onSuccess()
      setEmail('')
      setPassword('')
      setName('')
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

        <h2 className="text-2xl font-bold mb-2">
          {mode === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>
        <p className="text-muted-foreground mb-6">
          {mode === 'login' 
            ? 'Sign in to your account to continue' 
            : 'Join Shortify to start creating links'}
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="text-sm font-medium block mb-1">Name</label>
              <Input
                type="text"
                placeholder="Your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1">Email</label>
            <Input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1">Password</label>
            <Input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {mode === 'signup' && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" required className="rounded" />
              I agree to the terms and conditions
            </label>
          )}

          <Button 
            type="submit" 
            className="w-full bg-primary hover:bg-primary/90"
            disabled={loading}
          >
            {loading ? 'Please wait...' : (mode === 'login' ? 'Sign In' : 'Sign Up')}
          </Button>
        </form>

        <div className="mt-6 pt-6 border-t border-border">
          <p className="text-sm text-center text-muted-foreground mb-4">Or continue with</p>
          <div className="flex gap-3">
            <Button variant="outline" className="flex-1" disabled>Google</Button>
            <Button variant="outline" className="flex-1" disabled>GitHub</Button>
            <Button variant="outline" className="flex-1" disabled>Discord</Button>
          </div>
        </div>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            {mode === 'login' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => onModeChange(mode === 'login' ? 'signup' : 'login')}
              className="text-primary hover:underline font-medium"
            >
              {mode === 'login' ? 'Sign up' : 'Sign in'}
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
