'use client'

import React, { useEffect, useState } from 'react'
import { useSpring, animated, SpringValue } from 'react-spring'
import { useTheme } from '..'
import { themeLocalStorageKey } from '../shared'
import { getImplicitPreference } from '../shared'

// Add proper types for the animated properties
interface AnimatedProps {
  transform?: SpringValue<string>
  opacity?: SpringValue<number>
  cx?: SpringValue<string>
  cy?: SpringValue<string>
  r?: SpringValue<number>
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
    transform: properties[isDark ? 'dark' : 'light'].svg.transform,
    config: properties.springConfig,
  }) as AnimatedProps

  const centerCircleProps = useSpring({
    r: properties[isDark ? 'dark' : 'light'].circle.r,
    config: properties.springConfig,
  }) as AnimatedProps

  const maskedCircleProps = useSpring({
    cx: properties[isDark ? 'dark' : 'light'].mask.cx,
    cy: properties[isDark ? 'dark' : 'light'].mask.cy,
    config: properties.springConfig,
  }) as AnimatedProps

  const linesProps = useSpring({
    opacity: properties[isDark ? 'dark' : 'light'].lines.opacity,
    config: properties.springConfig,
  }) as AnimatedProps

  const toggle = () => {
    if (isAuto) {
      // First click switches from auto to manual
      setIsAuto(false)
      const currentImplicit = getImplicitPreference()
      const newTheme = currentImplicit === 'dark' ? 'light' : 'dark'
      setTheme(newTheme)
      setIsDark(newTheme === 'dark')
    } else {
      // Subsequent clicks toggle between light and dark
      const newTheme = isDark ? 'light' : 'dark'
      setTheme(newTheme)
      setIsDark(!isDark)
    }
  }

  // Double click to reset to auto
  const handleDoubleClick = () => {
    setIsAuto(true)
    setTheme(null)
    const implicitPreference = getImplicitPreference()
    setIsDark(implicitPreference === 'dark')
  }

  return (
    <div className="relative">
      <animated.svg
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
          ...svgContainerProps,
        }}
        className="text-foreground hover:opacity-70 transition-opacity"
      >
        <mask id="theme-toggle-mask">
          <rect x="0" y="0" width="100%" height="100%" fill="white" />
          <animated.circle style={maskedCircleProps} r="9" fill="black" />
        </mask>

        <animated.circle
          cx="12"
          cy="12"
          style={centerCircleProps}
          fill="currentColor"
          mask="url(#theme-toggle-mask)"
        />
        <animated.g stroke="currentColor" style={linesProps}>
          <line x1="12" y1="1" x2="12" y2="3" />
          <line x1="12" y1="21" x2="12" y2="23" />
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
          <line x1="1" y1="12" x2="3" y2="12" />
          <line x1="21" y1="12" x2="23" y2="12" />
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
        </animated.g>
      </animated.svg>
    </div>
  )
}
