'use client'

import { ThemeProvider } from 'next-themes'
import { useEffect, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import { useLowPerformanceMode } from './hooks/useLowPerformanceMode'

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false)
  const lowPerformanceMode = useLowPerformanceMode()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    root.dataset.motion = lowPerformanceMode ? 'optimized' : 'full'

    return () => {
      delete root.dataset.motion
    }
  }, [lowPerformanceMode])

  if (!mounted) {
    return <>{children}</>
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <MotionConfig reducedMotion="user">
        {children}
      </MotionConfig>
    </ThemeProvider>
  )
}
