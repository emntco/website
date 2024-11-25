'use client'

import React, { useEffect, useState } from 'react'
import { useSpring, animated, SpringValue } from 'react-spring'
import { useTheme } from '..'
import { themeLocalStorageKey } from '../shared'
import { getImplicitPreference } from '../shared'

// Style props for animated SVG elements
interface AnimatedSvgStyleProps {
  transform?: SpringValue<string>
  cursor?: string
  opacity?: SpringValue<number>
}

// Props for animated SVG elements
interface AnimatedSvgProps extends React.SVGProps<SVGSVGElement> {
  style?: AnimatedSvgStyleProps
}

// Props for animated circle
interface AnimatedCircleProps extends React.SVGProps<SVGCircleElement> {
  style?: {
    r?: SpringValue<number>
    cx?: SpringValue<string>
    cy?: SpringValue<string>
  }
}

// Props for animated group
interface AnimatedGProps extends React.SVGProps<SVGGElement> {
  style?: {
    opacity?: SpringValue<number>
  }
}

const properties = {
  dark: {
    circle: {
      r: 9,
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
      r: 5,
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

// Create properly typed animated components
const AnimatedSvg = animated.svg as unknown as React.FC<AnimatedSvgProps>
const AnimatedCircle = animated.circle as unknown as React.FC<AnimatedCircleProps>
const AnimatedG = animated.g as unknown as React.FC<AnimatedGProps>

export const ThemeToggle: React.FC = () => {
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
    to: {
      transform: properties[isDark ? 'dark' : 'light'].svg.transform,
    },
    config: properties.springConfig,
  })

  const centerCircleProps = useSpring({
    to: {
      r: properties[isDark ? 'dark' : 'light'].circle.r,
    },
    config: properties.springConfig,
  })

  const maskedCircleProps = useSpring({
    to: {
      cx: properties[isDark ? 'dark' : 'light'].mask.cx,
      cy: properties[isDark ? 'dark' : 'light'].mask.cy,
    },
    config: properties.springConfig,
  })

  const linesProps = useSpring({
    to: {
      opacity: properties[isDark ? 'dark' : 'light'].lines.opacity,
    },
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
        width="24"
        height="24"
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
        <mask id="theme-toggle-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <AnimatedCircle
            style={{
              cx: maskedCircleProps.cx,
              cy: maskedCircleProps.cy,
            }}
            r="9"
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
          mask="url(#theme-toggle-mask)"
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
