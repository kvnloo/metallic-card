"use client"

import { useEffect, useState } from "react"

export default function ScrollIndicator() {
  const [activeSection, setActiveSection] = useState(0)
  const sections = ["Home", "About", "Work"]

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY
      const windowHeight = window.innerHeight
      const section = Math.min(Math.floor(scrollPosition / windowHeight), sections.length - 1)
      setActiveSection(section)
    }

    window.addEventListener("scroll", handleScroll)
    handleScroll() // Initial check
    return () => window.removeEventListener("scroll", handleScroll)
  }, [sections.length])

  const scrollToSection = (index: number) => {
    window.scrollTo({
      top: index * window.innerHeight,
      behavior: "smooth",
    })
  }

  return (
    <div className="scroll-indicator">
      {sections.map((section, index) => (
        <button
          key={section}
          className={`scroll-dot ${index === activeSection ? "active" : ""}`}
          onClick={() => scrollToSection(index)}
          aria-label={`Go to ${section} section`}
          title={section}
        />
      ))}
    </div>
  )
}
