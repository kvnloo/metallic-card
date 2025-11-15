"use client"

import { useEffect, useState, useRef } from "react"
import ElectricBorderCard, { type ContactLink } from "@/components/electric-border-card"
import ScrollIndicator from "@/components/scroll-indicator"
import { ThemeButton } from "@/components/theme-button"
import { throttleRAF } from "@/lib/performance-utils"

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)
  const rafIdRef = useRef<number | null>(null)

  useEffect(() => {
    // Throttled scroll handler using requestAnimationFrame
    const handleScroll = () => {
      // Cancel any pending animation frame
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }

      // Schedule update for next frame
      rafIdRef.current = requestAnimationFrame(() => {
        const scrollPosition = window.scrollY
        const windowHeight = window.innerHeight
        const progress = Math.min(scrollPosition / windowHeight, 1)
        setScrollProgress(progress)
        rafIdRef.current = null
      })
    }

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true })

    return () => {
      window.removeEventListener("scroll", handleScroll)
      // Cancel any pending animation frame on cleanup
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  // Memoize transform calculations
  const scale = 1 - scrollProgress * 0.7
  const opacity = 1 - scrollProgress
  const translateY = scrollProgress * -150

  // Only set willChange when actively scrolling (optimization)
  const shouldOptimizeTransform = scrollProgress > 0 && scrollProgress < 1

  const contactLinks: ContactLink[] = [
    {
      type: "social",
      label: "LinkedIn",
      value: "https://linkedin.com/in/kevinsrajan",
      icon: "linkedin",
      ariaLabel: "Visit LinkedIn profile",
    },
    {
      type: "social",
      label: "Resume",
      value: "/ai-eng.pdf",
      icon: "file-text",
      ariaLabel: "View resume PDF",
    },
    {
      type: "social",
      label: "Portfolio",
      value: "https://kvnloo.github.io/portfolio/",
      icon: "globe",
      ariaLabel: "Visit portfolio website",
    },
    {
      type: "social",
      label: "GitHub",
      value: "https://github.com/kvnloo",
      icon: "github",
      ariaLabel: "Visit GitHub profile",
    },
    {
      type: "social",
      label: "Behance",
      value: "https://behance.net/kevinsrajan",
      icon: "behance",
      ariaLabel: "Visit Behance portfolio",
    },
    {
      type: "phone",
      label: "Phone",
      value: "6306992872",
      icon: "phone",
      ariaLabel: "Call phone number",
    },
    {
      type: "email",
      label: "Email",
      value: "kevinsrajan@gmail.com",
      icon: "mail",
      ariaLabel: "Send email",
    },
    {
      type: "location",
      label: "Location",
      value: "Chicago, IL",
      icon: "map-pin",
      ariaLabel: "View location on map",
    },
  ]

  return (
    <>
      <main
        className="portfolio-container"
        style={{
          opacity: opacity,
          // Use translate3d for GPU acceleration
          // iOS Safari REQUIRES explicit -webkit- prefix (critical for scroll animations)
          WebkitTransform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          transform: `translate3d(0, ${translateY}px, 0) scale(${scale})`,
          willChange: shouldOptimizeTransform ? "transform, opacity" : "auto",
        }}
      >
        <ElectricBorderCard name="Kevin Rajan" title={{ role: "Founder & CEO", company: "zerø" }} contactLinks={contactLinks} />
      </main>

      <ScrollIndicator />
      <ThemeButton />
    </>
  )
}
