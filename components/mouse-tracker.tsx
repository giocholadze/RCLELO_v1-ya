"use client"

import { useEffect } from "react"

export default function MouseTracker() {
  useEffect(() => {
    let timeoutId: NodeJS.Timeout

    const handleMouseMove = (e: MouseEvent) => {
      document.documentElement.style.setProperty("--mouse-x", `${e.clientX}px`)
      document.documentElement.style.setProperty("--mouse-y", `${e.clientY}px`)

      document.body.classList.add("mouse-moving")

      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        document.body.classList.remove("mouse-moving")
      }, 100)
    }

    const handleTouchStart = (e: TouchEvent) => {
      const touch = e.touches[0]
      if (touch) {
        document.documentElement.style.setProperty("--mouse-x", `${touch.clientX}px`)
        document.documentElement.style.setProperty("--mouse-y", `${touch.clientY}px`)
        document.body.classList.add("mouse-moving")

        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          document.body.classList.remove("mouse-moving")
        }, 300)
      }
    }

    const handleMobileNavTouch = (e: TouchEvent) => {
      const target = e.target as HTMLElement
      const navItem = target.closest(".mobile-nav-item, .mobile-nav-subitem")

      if (navItem && e.touches[0]) {
        const rect = navItem.getBoundingClientRect()
        const touch = e.touches[0]
        const x = ((touch.clientX - rect.left) / rect.width) * 100
        const y = ((touch.clientY - rect.top) / rect.height) * 100

        navItem.style.setProperty("--touch-x", `${x}%`)
        navItem.style.setProperty("--touch-y", `${y}%`)
        navItem.classList.add("touching")

        setTimeout(() => {
          navItem.classList.remove("touching")
        }, 300)
      }
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("touchstart", handleTouchStart)
    document.addEventListener("touchstart", handleMobileNavTouch)

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("touchstart", handleTouchStart)
      document.removeEventListener("touchstart", handleMobileNavTouch)
      clearTimeout(timeoutId)
    }
  }, [])

  return null
}
