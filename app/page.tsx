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

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

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
      value: "+1234567890",
      icon: "󰏲",
      ariaLabel: "Call phone number",
    },
    {
      type: "email",
      label: "Email",
      value: "kevin@example.com",
      icon: "󰇰",
      ariaLabel: "Send email",
    },
    {
      type: "location",
      label: "Location",
      value: "San Francisco, CA",
      icon: "󰍎",
      ariaLabel: "View location on map",
    },
  ]

  return (
    <>
      <section
        className="portfolio-section"
        style={{
          opacity: 1 - scrollProgress,
          transform: `translateY(${scrollProgress * -100}px) scale(${1 - scrollProgress * 0.2})`,
        }}
      >
        <ElectricBorderCard name="Kevin Rajan" title="Founder & CEO" category="Portfolio" contactLinks={contactLinks} />
      </section>

      <section className="portfolio-section section-about">
        <div className="section-content">
          <h2 className="section-title">About</h2>
          <p className="section-text">Building innovative solutions for the modern web.</p>
        </div>
      </section>

      <section className="portfolio-section section-work">
        <div className="section-content">
          <h2 className="section-title">Work</h2>
          <p className="section-text">Explore my latest projects and collaborations.</p>
        </div>
      </section>

      <ScrollIndicator />
    </>
  )
}
