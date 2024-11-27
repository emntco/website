'use client'
import { useHeaderTheme } from '@/providers/HeaderTheme'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import type { Header } from '@/payload-types'
import { Logo } from '@/components/Logo/Logo'
import { HeaderNav } from './Nav'

interface HeaderClientProps {
  header: Header
}

export const HeaderClient: React.FC<HeaderClientProps> = ({ header }) => {
  const [theme, setTheme] = useState<string | null>(null)
  const { headerTheme, setHeaderTheme } = useHeaderTheme()
  const pathname = usePathname()

  useEffect(() => {
    setHeaderTheme(null)
  }, [pathname, setHeaderTheme])

  useEffect(() => {
    if (headerTheme && headerTheme !== theme) setTheme(headerTheme)
  }, [headerTheme, theme])

  return (
    <header 
      className="container relative z-20" 
      {...(theme ? { 'data-theme': theme } : {})}
    >
      <div className="py-4 md:py-8 flex justify-between items-center">
        <Link href="/" className="flex-shrink-0">
          <Logo 
            loading="eager" 
            priority="high" 
            className="invert dark:invert-0 md:w-auto" 
          />
        </Link>
        <HeaderNav header={header} />
      </div>
    </header>
  )
}
