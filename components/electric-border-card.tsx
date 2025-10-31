"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo } from "react"
import { Linkedin, Github, Phone, Mail, MapPin, Palette, type LucideIcon } from "lucide-react"
import { throttleRAF, getPerformanceSettings } from "@/lib/performance-utils"

export interface ContactLink {
  type: "social" | "phone" | "email" | "location"
  label: string
  value: string // URL for social, phone number, email, or location text
  icon: string // Icon name (e.g., "linkedin", "github", "phone", "mail", "map-pin", "behance")
  ariaLabel: string
}

// Icon mapping
const iconMap: Record<string, LucideIcon> = {
  linkedin: Linkedin,
  github: Github,
  phone: Phone,
  mail: Mail,
  "map-pin": MapPin,
  behance: Palette, // Lucide doesn't have Behance, using Palette as creative portfolio icon
}

export interface BusinessCardProps {
  name: string
  title: string | { role: string; company?: string }
  contactLinks?: ContactLink[]
}

export default function ElectricBorderCard({ name, title, contactLinks = [] }: BusinessCardProps) {
  const [rotateX, setRotateX] = useState(15)
  const [rotateY, setRotateY] = useState(-20)
  const [rotateZ, setRotateZ] = useState(5)
  const [glowX, setGlowX] = useState(50)
  const [glowY, setGlowY] = useState(50)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)
  const rafIdRef = useRef<number | null>(null)

  // Get performance settings based on device capabilities
  const perfSettings = useMemo(() => getPerformanceSettings(), [])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    // Cancel any pending RAF
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
    }

    // Throttle updates using RAF for 60fps
    rafIdRef.current = requestAnimationFrame(() => {
      if (!cardRef.current) return

      const card = cardRef.current
      const rect = card.getBoundingClientRect()

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const mouseX = e.clientX - centerX
      const mouseY = e.clientY - centerY

      // Use device-appropriate max rotation
      const maxRotation = perfSettings.maxRotation
      const dampingFactor = 0.8

      const normalizedX = (mouseX / (rect.width / 2)) * dampingFactor
      const normalizedY = (mouseY / (rect.height / 2)) * dampingFactor

      const rotationY = normalizedX * maxRotation
      const rotationX = -normalizedY * maxRotation
      const rotationZ = normalizedX * 3

      setRotateX(15 + rotationX)
      setRotateY(-20 + rotationY)
      setRotateZ(5 + rotationZ)

      const glowXPos = ((e.clientX - rect.left) / rect.width) * 100
      const glowYPos = ((e.clientY - rect.top) / rect.height) * 100
      setGlowX(glowXPos)
      setGlowY(glowYPos)

      rafIdRef.current = null
    })
  }

  // Cleanup RAF on unmount
  useEffect(() => {
    return () => {
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
      }
    }
  }, [])

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()

    // Set initial glow position to where mouse entered
    const glowXPos = ((e.clientX - rect.left) / rect.width) * 100
    const glowYPos = ((e.clientY - rect.top) / rect.height) * 100
    setGlowX(glowXPos)
    setGlowY(glowYPos)

    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(15)
    setRotateY(-20)
    setRotateZ(5)
    // Don't reset glow position - keep it where the mouse left
  }

  const getHref = (link: ContactLink): string => {
    switch (link.type) {
      case "social":
        return link.value
      case "phone":
        return `tel:${link.value}`
      case "email":
        return `mailto:${link.value}`
      case "location":
        return `https://maps.google.com/?q=${encodeURIComponent(link.value)}`
      default:
        return link.value
    }
  }

  return (
    <>
      {/* Only render complex SVG filter on desktop for performance */}
      {perfSettings.enableComplexFilters && (
        <svg className="svg-container">
          <defs>
            <filter id="turbulent-displace" colorInterpolationFilters="sRGB" x="-20%" y="-20%" width="140%" height="140%">
              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="1" />
              <feOffset in="noise1" dx="0" dy="0" result="offsetNoise1">
                <animate attributeName="dy" values="700; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
              </feOffset>

              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="1" />
              <feOffset in="noise2" dx="0" dy="0" result="offsetNoise2">
                <animate attributeName="dy" values="0; -700" dur="6s" repeatCount="indefinite" calcMode="linear" />
              </feOffset>

              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise1" seed="2" />
              <feOffset in="noise1" dx="0" dy="0" result="offsetNoise3">
                <animate attributeName="dx" values="490; 0" dur="6s" repeatCount="indefinite" calcMode="linear" />
              </feOffset>

              <feTurbulence type="turbulence" baseFrequency="0.02" numOctaves="10" result="noise2" seed="2" />
              <feOffset in="noise2" dx="0" dy="0" result="offsetNoise4">
                <animate attributeName="dx" values="0; -490" dur="6s" repeatCount="indefinite" calcMode="linear" />
              </feOffset>

              <feComposite in="offsetNoise1" in2="offsetNoise2" result="part1" />
              <feComposite in="offsetNoise3" in2="offsetNoise4" result="part2" />
              <feBlend in="part1" in2="part2" mode="color-dodge" result="combinedNoise" />

              <feDisplacementMap
                in="SourceGraphic"
                in2="combinedNoise"
                scale="30"
                xChannelSelector="R"
                yChannelSelector="B"
              />
            </filter>
          </defs>
        </svg>
      )}

      <div
        ref={cardRef}
        className="card-3d-wrapper"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          // Use translate3d for GPU acceleration
          // iOS Safari REQUIRES explicit -webkit- prefix (critical for animations)
          WebkitTransform: `translate3d(0, 0, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          transform: `translate3d(0, 0, 0) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          // Only enable transitions if device supports them
          // iOS Safari REQUIRES explicit -webkit- prefix for transitions
          WebkitTransition: perfSettings.enableTransitions
            ? isHovered
              ? "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
              : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)"
            : "none",
          transition: perfSettings.enableTransitions
            ? isHovered
              ? "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
              : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)"
            : "none",
          // Only set willChange when hovering for performance
          willChange: isHovered ? "transform" : "auto",
        }}
      >
        <div className="card-container">
          <div className="inner-container">
            <div className="border-outer">
              <div className="main-card"></div>
            </div>
            <div className="glow-layer-1"></div>
            <div className="glow-layer-2"></div>
          </div>

          <div className="overlay-1"></div>
          <div className="overlay-2"></div>
          <div
            className="background-glow"
            style={{
              background: `radial-gradient(circle at ${glowX}% ${glowY}%, var(--silver-bright), transparent 50%, var(--electric-border-color))`,
              opacity: isHovered ? 0.3 : 0,
              // iOS Safari REQUIRES explicit -webkit- prefix
              WebkitTransition: 'opacity 0.3s ease',
              transition: 'opacity 0.3s ease',
            }}
          ></div>
          <div
            className="mouse-spotlight"
            style={{
              background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.15), transparent 40%)`,
              opacity: isHovered ? 1 : 0,
              // iOS Safari REQUIRES explicit -webkit- prefix
              WebkitTransition: 'opacity 0.3s ease',
              transition: 'opacity 0.3s ease',
            }}
          ></div>

          <div className="content-container">
            <div className="content-top">
              <p className="title-large title-name">{name}</p>
            </div>

            <div className="content-bottom">
              <p className="description">
                {typeof title === 'string' ? (
                  title
                ) : (
                  <>
                    {title.role}
                    {title.company && (
                      <>
                        {' | '}
                        <strong>{title.company}</strong>
                      </>
                    )}
                  </>
                )}
              </p>

              {contactLinks.length > 0 && (
                <div className="contact-links-row">
                  {contactLinks.map((link, index) => {
                    const IconComponent = iconMap[link.icon]
                    return (
                      <a
                        key={index}
                        href={getHref(link)}
                        target={link.type === "social" ? "_blank" : undefined}
                        rel={link.type === "social" ? "noopener noreferrer" : undefined}
                        className="contact-button"
                        aria-label={link.ariaLabel}
                        title={link.label}
                        style={{ color: `var(--icon-color-${index + 1})` }}
                      >
                        {IconComponent ? <IconComponent size={20} /> : null}
                      </a>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
