'use client'

import { useEffect } from 'react'
import { useTheme } from 'next-themes'
import * as SunCalc from 'suncalc'

export function AutoThemeDetector() {
  const { setTheme } = useTheme()

  useEffect(() => {
    const updateThemeBasedOnTime = (latitude?: number, longitude?: number) => {
      const now = new Date()

      // Use provided coordinates or default to San Francisco
      const lat = latitude ?? 37.7749
      const lon = longitude ?? -122.4194

      // Calculate sunrise and sunset times for today
      const times = SunCalc.getTimes(now, lat, lon)
      const sunrise = times.sunrise
      const sunset = times.sunset

      // Check if current time is between sunrise and sunset (daytime)
      const isDaytime = now >= sunrise && now <= sunset

      // Set theme based on time of day
      if (isDaytime) {
        setTheme('light')
      } else {
        setTheme('dark')
      }

      console.log('Auto theme:', {
        location: { lat, lon },
        sunrise: sunrise.toLocaleTimeString(),
        sunset: sunset.toLocaleTimeString(),
        now: now.toLocaleTimeString(),
        isDaytime,
        selectedTheme: isDaytime ? 'light' : 'dark'
      })
    }

    // Try to get user's location
    const getLocationAndUpdateTheme = () => {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            updateThemeBasedOnTime(latitude, longitude)
          },
          (error) => {
            console.log('Location access denied, using default location:', error.message)
            updateThemeBasedOnTime()
          }
        )
      } else {
        console.log('Geolocation not supported, using default location')
        updateThemeBasedOnTime()
      }
    }

    // Initial update
    getLocationAndUpdateTheme()

    // Update every minute to catch sunrise/sunset transitions
    const interval = setInterval(getLocationAndUpdateTheme, 60000)

    return () => clearInterval(interval)
  }, [setTheme])

  return null
}
