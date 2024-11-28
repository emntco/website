'use client'

import React, { useState, useEffect } from 'react'
import type { Header as HeaderType } from '@/payload-types'
import { CMSLink } from '@/components/Link'
import Link from 'next/link'
import { ThemeToggle } from '@/providers/Theme/ThemeToggle'
import { MenuIcon, SearchIcon, X } from 'lucide-react'

export const HeaderNav: React.FC<{ header: HeaderType }> = ({ header }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navItems = header?.navItems || []

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.classList.add('overflow-hidden')
    } else {
      document.body.classList.remove('overflow-hidden')
    }

    return () => {
      document.body.classList.remove('overflow-hidden')
    }
  }, [isMobileMenuOpen])

  // Handle mobile link clicks
  const handleMobileLinkClick = () => {
    setIsMobileMenuOpen(false)
  }

  return (
    <>
      {/* Desktop Navigation */}
      <nav className="hidden md:flex gap-4 items-center">
        {navItems.map(({ link }, i) => {
          return <CMSLink key={i} {...link} appearance="link" className="text-lg" />
        })}
        <ThemeToggle maskId="theme-toggle-mask-desktop" />
        <Link href="/search">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
      </nav>

      {/* Mobile Navigation */}
      <nav className="flex md:hidden items-center gap-2">
        <ThemeToggle maskId="theme-toggle-mask-mobile" />
        <Link href="/search" className="p-2">
          <span className="sr-only">Search</span>
          <SearchIcon className="w-5 text-primary" />
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2"
          aria-label="Open menu"
        >
          <MenuIcon className="w-5 text-primary" />
        </button>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-50 bg-background md:hidden animate-in fade-in duration-200"
          onClick={handleMobileLinkClick} // Close menu when clicking the overlay
        >
          <div className="container" onClick={e => e.stopPropagation()}>
            <div className="py-4 flex justify-end">
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="p-2"
                aria-label="Close menu"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex flex-col space-y-4">
              {navItems.map(({ link }, i) => (
                <div key={i} onClick={handleMobileLinkClick}>
                  <CMSLink 
                    {...link} 
                    appearance="link" 
                    className="text-xl py-2"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
