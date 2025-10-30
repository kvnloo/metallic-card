"use client"

import { useEffect, useState } from "react"
import ElectricBorderCard, { type SocialLink, type ContactInfo } from "@/components/electric-border-card"
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

  const socialLinks: SocialLink[] = [
    {
      platform: "linkedin",
      url: "https://linkedin.com/in/kevinsrajan",
      icon: "󰌻",
      ariaLabel: "LinkedIn",
    },
    {
      platform: "behance",
      url: "https://behance.net/kevinsrajan",
      icon: "󰌼",
      ariaLabel: "Behance",
    },
    {
      platform: "github",
      url: "https://github.com/kvnloo",
      icon: "󰊢",
      ariaLabel: "GitHub",
    },
  ]

  const contactInfo: ContactInfo = {
    phone: "+1234567890",
    email: "kevin@example.com",
    location: "San Francisco, CA",
  }

  return (
    <>
      <section
        className="portfolio-section"
        style={{
          opacity: 1 - scrollProgress,
          transform: `translateY(${scrollProgress * -100}px) scale(${1 - scrollProgress * 0.2})`,
        }}
      >
        <ElectricBorderCard
          name="Kevin Rajan"
          title="Founder & CEO"
          category="Portfolio"
          socialLinks={socialLinks}
          contactInfo={contactInfo}
        />
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
