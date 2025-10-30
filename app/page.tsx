"use client"

import { useEffect, useState } from "react"
import ElectricBorderCard, { type ContactLink } from "@/components/electric-border-card"
import ScrollIndicator from "@/components/scroll-indicator"

export default function Home() {
  const [scrollProgress, setScrollProgress] = useState(0)

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight

      const progress = Math.min(scrollPosition / windowHeight, 1)
      setScrollProgress(progress)
    }

    // Use passive listener for better scroll performance
    window.addEventListener("scroll", handleScroll, { passive: true })
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scale = 1 - scrollProgress * 0.7
  const opacity = 1 - scrollProgress
  const translateY = scrollProgress * -150

  const contactLinks: ContactLink[] = [
    {
      type: "social",
      label: "LinkedIn",
      value: "https://linkedin.com/in/kevinsrajan",
      icon: "󰌻",
      ariaLabel: "Visit LinkedIn profile",
    },
    {
      type: "social",
      label: "Behance",
      value: "https://behance.net/kevinsrajan",
      icon: "󰌼",
      ariaLabel: "Visit Behance portfolio",
    },
    {
      type: "social",
      label: "GitHub",
      value: "https://github.com/kvnloo",
      icon: "󰊢",
      ariaLabel: "Visit GitHub profile",
    },
    {
      type: "phone",
      label: "Phone",
      value: "0000000",
      icon: "󰏲",
      ariaLabel: "Call phone number",
    },
    {
      type: "email",
      label: "Email",
      value: "test@test.com",
      icon: "󰇰",
      ariaLabel: "Send email",
    },
    {
      type: "location",
      label: "Location",
      value: "Chicago, IL",
      icon: "󰍎",
      ariaLabel: "View location on map",
    },
  ]

  return (
    <>
      <main
        className="portfolio-container"
        style={{
          opacity: opacity,
          transform: `translateY(${translateY}px) scale(${scale})`,
          willChange: scrollProgress > 0 && scrollProgress < 1 ? "transform, opacity" : "auto",
        }}
      >
        <ElectricBorderCard name="Kevin Rajan" title="Founder & CEO" category="Portfolio" contactLinks={contactLinks} />
      </main>

      <ScrollIndicator />
    </>
  )
}
