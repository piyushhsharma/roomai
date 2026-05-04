'use client'

import { useState } from 'react'

export default function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <nav className="w-full bg-page-bg/50 backdrop-blur-sm border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-black text-text-primary">📷</span>
          <span className="text-xl font-bold text-text-primary">RoomAI</span>
        </div>

        {/* Desktop Nav Links */}
        <div className="hidden md:flex items-center space-x-8">
          <a href="#how-it-works" className="text-text-sub hover:text-text-primary transition-colors">
            How it works
          </a>
          <a href="#examples" className="text-text-sub hover:text-text-primary transition-colors">
            Examples
          </a>
          <a href="#pricing" className="text-text-sub hover:text-text-primary transition-colors">
            Pricing
          </a>
        </div>

        {/* Right Side Buttons */}
        <div className="flex items-center space-x-4">
          <a 
            href="/login" 
            className="text-text-sub hover:text-text-primary transition-colors"
          >
            Sign in
          </a>
          <a 
            href="/signup" 
            className="bg-accent text-white rounded-full px-5 py-2 hover:bg-accent/90 transition-colors"
          >
            Get Started
          </a>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden text-text-primary"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-border">
          <div className="px-8 py-4 space-y-4">
            <a href="#how-it-works" className="block text-text-sub hover:text-text-primary transition-colors">
              How it works
            </a>
            <a href="#examples" className="block text-text-sub hover:text-text-primary transition-colors">
              Examples
            </a>
            <a href="#pricing" className="block text-text-sub hover:text-text-primary transition-colors">
              Pricing
            </a>
            <div className="pt-4 space-y-4">
              <a 
                href="/login" 
                className="block text-text-sub hover:text-text-primary transition-colors"
              >
                Sign in
              </a>
              <a 
                href="/signup" 
                className="block w-full bg-accent text-white rounded-full px-5 py-2 hover:bg-accent/90 transition-colors text-center"
              >
                Get Started
              </a>
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}
