'use client'

import React, { useEffect, useState } from 'react'
import { useSpring, animated, SpringValue } from 'react-spring'
import { useTheme } from '..'
import { themeLocalStorageKey } from '../shared'
import { getImplicitPreference } from '../shared'

// Base animated style props
interface AnimatedStyleProps {
  transform?: SpringValue<string>
  opacity?: SpringValue<number>
}

// SVG specific animated props
interface AnimatedSvgProps {
  xmlns?: string
  width?: string | number
  height?: string | number
  viewBox?: string
  fill?: string
  strokeWidth?: string | number
  strokeLinecap?: 'round' | 'butt' | 'square'
  strokeLinejoin?: 'round' | 'bevel' | 'miter'
  stroke?: string
  style?: AnimatedStyleProps & {
    cursor?: string
  }
  className?: string
  onClick?: () => void
  onDoubleClick?: () => void
  children?: React.ReactNode
}

// Circle specific animated props
interface AnimatedCircleProps {
  cx?: string | number
  cy?: string | number
  r?: string | number
  fill?: string
  mask?: string
  style?: {
    r?: SpringValue<number>
    cx?: SpringValue<string>
    cy?: SpringValue<string>
  }
}

// Group specific animated props
interface AnimatedGProps {
  stroke?: string
  style?: {
    opacity?: SpringValue<number>
  }
  children?: React.ReactNode
}

interface ThemeToggleProps {
  maskId?: string
}

const properties = {
  dark: {
    circle: {
      r: 8,
    },
    mask: {
      cx: '50%',
      cy: '23%',
    },
    svg: {
      transform: 'rotate(40deg)',
    },
    lines: {
      opacity: 0,
    },
  },
  light: {
    circle: {
      r: 4,
    },
    mask: {
      cx: '100%',
      cy: '0%',
    },
    svg: {
      transform: 'rotate(90deg)',
    },
    lines: {
      opacity: 1,
    },
  },
  springConfig: { mass: 1, tension: 200, friction: 30 },
}

const AnimatedSvg = animated.svg as unknown as React.FC<AnimatedSvgProps>
const AnimatedCircle = animated.circle as unknown as React.FC<AnimatedCircleProps>
const AnimatedG = animated.g as unknown as React.FC<AnimatedGProps>

export const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  maskId = "theme-toggle-mask" 
}) => {
  const { setTheme, theme } = useTheme()
  const [isAuto, setIsAuto] = useState(true)
  const [isDark, setIsDark] = useState(false)

  useEffect(() => {
    const preference = window.localStorage.getItem(themeLocalStorageKey)
    setIsAuto(!preference)
    
    if (preference) {
      setIsDark(preference === 'dark')
    } else {
      const implicitPreference = getImplicitPreference()
      setIsDark(implicitPreference === 'dark')
    }
  }, [theme])

  const svgContainerProps = useSpring({
    transform: properties[isDark ? 'dark' : 'light'].svg.transform,
    config: properties.springConfig,
  })

  const centerCircleProps = useSpring({
    r: properties[isDark ? 'dark' : 'light'].circle.r,
    config: properties.springConfig,
  })

  const maskedCircleProps = useSpring({
    cx: properties[isDark ? 'dark' : 'light'].mask.cx,
    cy: properties[isDark ? 'dark' : 'light'].mask.cy,
    config: properties.springConfig,
  })

  const linesProps = useSpring({
    opacity: properties[isDark ? 'dark' : 'light'].lines.opacity,
    config: properties.springConfig,
  })

  const toggle = () => {
    if (isAuto) {
      setIsAuto(false)
      const currentImplicit = getImplicitPreference()
      const newTheme = currentImplicit === 'dark' ? 'light' : 'dark'
      setTheme(newTheme)
      setIsDark(newTheme === 'dark')
    } else {
      const newTheme = isDark ? 'light' : 'dark'
      setTheme(newTheme)
      setIsDark(!isDark)
    }
  }

  const handleDoubleClick = () => {
    setIsAuto(true)
    setTheme(null)
    const implicitPreference = getImplicitPreference()
    setIsDark(implicitPreference === 'dark')
  }

  return (
    <div className="relative">
      <AnimatedSvg
        xmlns="http://www.w3.org/2000/svg"
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        stroke="currentColor"
        onClick={toggle}
        onDoubleClick={handleDoubleClick}
        style={{
          cursor: 'pointer',
          transform: svgContainerProps.transform,
        }}
        className="text-foreground hover:opacity-70 transition-opacity"
      >
        <mask id={maskId}>
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <AnimatedCircle
            style={{
              cx: maskedCircleProps.cx,
              cy: maskedCircleProps.cy,
            }}
            r="8"
            fill="black"
          />
        </mask>

        <AnimatedCircle
          cx="12"
          cy="12"
          style={{
            r: centerCircleProps.r,
          }}
          fill="currentColor"
          mask={`url(#${maskId})`}
        />
        <AnimatedG
          stroke="currentColor"
          style={{
            opacity: linesProps.opacity,
          }}
        >
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </AnimatedG>
      </AnimatedSvg>
    </div>
  )
}
