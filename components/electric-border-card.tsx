"use client"

import type React from "react"
import { useState, useRef } from "react"

export interface ContactLink {
  type: "social" | "phone" | "email" | "location"
  label: string
  value: string // URL for social, phone number, email, or location text
  icon: string // Nerd Font icon character
  ariaLabel: string
}

export interface BusinessCardProps {
  name: string
  title: string
  category?: string
  contactLinks?: ContactLink[]
}

export default function ElectricBorderCard({
  name,
  title,
  category = "Portfolio",
  contactLinks = [],
}: BusinessCardProps) {
  const [rotateX, setRotateX] = useState(15)
  const [rotateY, setRotateY] = useState(-20)
  const [rotateZ, setRotateZ] = useState(5)
  const [glowX, setGlowX] = useState(50)
  const [glowY, setGlowY] = useState(50)
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const card = cardRef.current
    const rect = card.getBoundingClientRect()

    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const mouseX = e.clientX - centerX
    const mouseY = e.clientY - centerY

    const maxRotation = 10
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
  }

  const handleMouseEnter = () => {
    setIsHovered(true)
  }

  const handleMouseLeave = () => {
    setIsHovered(false)
    setRotateX(15)
    setRotateY(-20)
    setRotateZ(5)
    setGlowX(50)
    setGlowY(50)
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

      <div
        ref={cardRef}
        className="card-3d-wrapper"
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`,
          transition: isHovered
            ? "transform 0.3s cubic-bezier(0.23, 1, 0.32, 1)"
            : "transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)",
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
            }}
          ></div>
          <div
            className="mouse-spotlight"
            style={{
              background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 255, 255, 0.15), transparent 40%)`,
            }}
          ></div>

          <div className="content-container">
            <div className="content-top">
              <p className="title-large title-name">{name}</p>
            </div>

            <hr className="divider" />

            <div className="content-bottom">
              <p className="description">{title}</p>

              {contactLinks.length > 0 && (
                <div className="contact-links-row">
                  {contactLinks.map((link, index) => (
                    <a
                      key={index}
                      href={getHref(link)}
                      target={link.type === "social" ? "_blank" : undefined}
                      rel={link.type === "social" ? "noopener noreferrer" : undefined}
                      className="contact-button nerd-icon"
                      aria-label={link.ariaLabel}
                      title={link.label}
                    >
                      {link.icon}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
