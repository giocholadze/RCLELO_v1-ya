"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sun, Moon, Menu, X, ChevronRight, User, LogOut } from "lucide-react"
import { useAuth } from "@/components/auth/auth-provider"
import { logout } from "@/lib/auth"

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [isDark, setIsDark] = useState(false)
  const [expandedItems, setExpandedItems] = useState<{ [key: string]: boolean }>({})
  // 1. FIX: Removed 'refreshUser'
  const { user, isAdmin } = useAuth()

  // This useEffect handles theme initialization
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme")
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true)
      document.documentElement.classList.add("dark")
    } else {
      setIsDark(false)
      document.documentElement.classList.remove("dark")
    }
  }, [])

  // This useEffect prevents scrolling when the mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [mobileMenuOpen])

  // All your helper functions are correct and preserved here
  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    if (newTheme) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
    if (mobileMenuOpen) setExpandedItems({})
  }

  const closeMobileMenu = () => {
    setMobileMenuOpen(false)
    setExpandedItems({})
  }

  const toggleExpanded = (item: string) => {
    setExpandedItems((prev) => ({ ...prev, [item]: !prev[item] }))
  }
  
  // 2. FIX: Made handleLogout async to work with Supabase
  const handleLogout = async () => {
    await logout()
    closeMobileMenu()
  }

  const navigationItems = [
    { title: "მთავარი გვერდი", href: "/", subItems: [] },
    { title: "კაცთა ლიგა", href: "/mens-league", subItems: [
        { title: "უმაღლესი ლიგა", href: "/mens-league?tab=premier" },
        { title: "ესპუართა", href: "/mens-league?tab=espuarta" },
        { title: "მოთამაშეები", href: "/mens-players" },
    ]},
    { title: "ახალგაზრდული ლიგა", href: "/youth-league", subItems: [
        { title: 'ლიგა "ა"', href: "/youth-league?tab=youth-a" },
        { title: 'ლიგა "ბ"', href: "/youth-league?tab=youth-b" },
        { title: "საფესტივალო", href: "/youth-league?tab=festival" },
        { title: "მოთამაშეები", href: "/youth-players" },
    ]},
    { title: "სიახლეები", href: "/news", subItems: [] },
    { title: "გალერეა", href: "/gallery", subItems: [] },
    { title: "პერსონალი", href: "/staff", subItems: [] },
  ]

  return (
    <>
      {/* Top Navigation */}
      <div className="bg-background border-b h-10 sticky top-0 z-50">
        <div className="w-full max-w-[1200px] mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <div className="flex items-center">
              <span className="font-semibold text-xs text-muted-foreground">ლელო რაგბის კლუბი</span>
            </div>
            <div className="flex items-center gap-2">
              {user ? (
                <div className="flex items-center gap-2">
                  {/* 3. FIX: Changed user.username to user.email */}
                  <span className="text-xs text-muted-foreground hidden sm:inline">{user.email}</span>
                  {isAdmin && (
                    <Link href="/admin">
                      <Button variant="ghost" size="sm" className="h-7 text-xs">ადმინი</Button>
                    </Link>
                  )}
                  <Button variant="ghost" size="sm" onClick={handleLogout} className="h-7 w-7 p-0">
                    <LogOut className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ) : (
                <Link href="/auth">
                  <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                    <User className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              )}
              <Button variant="ghost" size="sm" onClick={toggleTheme} className="h-7 w-7 p-0 hover:bg-muted">
                {isDark ? <Sun className="h-3.5 w-3.5" /> : <Moon className="h-3.5 w-3.5" />}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header with Navigation */}
      <header className="bg-background shadow-sm h-14 relative border-b sticky top-10 z-40">
        <div className="w-full max-w-[1200px] mx-auto px-4 h-full">
          <div className="flex justify-between items-center h-full">
            <Link href="/" className="flex items-center hover:scale-105 transition-transform">
              <img src="public\images\favicon.ico" alt="ლელო რაგბის კლუბი" className="w-9 h-9 rounded-full mr-3 shadow-md object-cover" />
              <span className="text-xl font-bold">ლელო</span>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6">
              {navigationItems.slice(0, 1).map(item => ( // Just "მთავარი გვერდი"
                <Link key={item.href} href={item.href} className="font-medium hover:text-red-500 transition-colors text-sm">{item.title}</Link>
              ))}
              {navigationItems.slice(1, 3).map(item => ( // Mens & Youth Leagues with dropdowns
                <div key={item.href} className="relative group">
                  <Link href={item.href} className="font-medium hover:text-red-500 transition-colors text-sm">{item.title}</Link>
                  <div className="absolute top-full left-0 mt-1 bg-background border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 min-w-48">
                    {item.subItems.map(sub => (
                      <Link key={sub.href} href={sub.href} className="block px-4 py-2 text-sm hover:bg-muted">{sub.title}</Link>
                    ))}
                  </div>
                </div>
              ))}
              {navigationItems.slice(3).map(item => ( // News, Gallery, Staff
                <Link key={item.href} href={item.href} className="font-medium hover:text-red-500 transition-colors text-sm">{item.title}</Link>
              ))}
            </nav>

            {/* Hamburger Menu Button */}
            <Button variant="ghost" className="md:hidden h-8 w-8 p-0" onClick={toggleMobileMenu} aria-label="Toggle menu">
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden animate-in fade-in duration-300" onClick={closeMobileMenu} />
            <div className="fixed top-0 left-0 h-full w-80 max-w-[85vw] bg-background border-r shadow-2xl z-50 md:hidden overflow-y-auto animate-in slide-in-from-left duration-300">
              <div className="flex items-center justify-between p-4 border-b">
                <div className="flex items-center">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lelo-logo-round-BQqGHxKzVvXjQqGzVvXjQqGzVvXj.png-kpK6e6CFxpZ4lZRbVHKiM4oRFSiHVe.png" alt="ლელო რაგბის კლუბი" className="w-8 h-8 rounded-full mr-2 object-cover" />
                  <span className="font-bold text-lg">ლელო</span>
                </div>
                <Button variant="ghost" size="sm" onClick={closeMobileMenu} className="h-8 w-8 p-0"><X className="h-5 w-5" /></Button>
              </div>
              <div className="p-4">
                <nav className="space-y-2">
                  {navigationItems.map((item, index) => (
                    <div key={index} className="space-y-1">
                      {item.subItems.length > 0 ? (
                        <>
                          <button onClick={() => toggleExpanded(item.title)} className="w-full flex items-center justify-between p-3 text-left font-medium hover:bg-red-50 dark:hover:bg-red-950/20 rounded-lg transition-all duration-200">
                            <span>{item.title}</span>
                            <div className={`transition-transform duration-200 ${expandedItems[item.title] ? "rotate-90" : ""}`}>
                              <ChevronRight className="h-4 w-4" />
                            </div>
                          </button>
                          <div className={`overflow-hidden transition-all duration-300 ${expandedItems[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                            <div className="ml-4 space-y-1 pt-1">
                              {item.subItems.map((subItem, subIndex) => (
                                <Link key={subIndex} href={subItem.href} className="block p-2 text-sm text-muted-foreground hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 rounded transition-all duration-200 transform hover:translate-x-1" onClick={closeMobileMenu}>
                                  {subItem.title}
                                </Link>
                              ))}
                            </div>
                          </div>
                        </>
                      ) : (
                        <Link href={item.href} className="block p-3 font-medium hover:bg-red-50 dark:hover:bg-red-950/20 hover:text-red-500 rounded-lg transition-all duration-200 transform hover:translate-x-1" onClick={closeMobileMenu}>
                          {item.title}
                        </Link>
                      )}
                    </div>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t space-y-3">
                  {user && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Logged in: {user.email}</div>
                      {isAdmin && (
                        <Link href="/admin" onClick={closeMobileMenu}>
                          <Button variant="outline" size="sm" className="w-full bg-transparent">Admin Panel</Button>
                        </Link>
                      )}
                      <Button variant="outline" size="sm" onClick={handleLogout} className="w-full bg-transparent">Logout</Button>
                    </div>
                  )}
                  {!user && (
                    <Link href="/auth" onClick={closeMobileMenu}>
                      <Button variant="outline" size="sm" className="w-full bg-transparent">Login / Register</Button>
                    </Link>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Theme</span>
                    <Button variant="outline" size="sm" onClick={toggleTheme} className="h-8 transition-all duration-200 bg-transparent">
                      {isDark ? ( <> <Sun className="h-4 w-4 mr-1" /> Light </> ) : ( <> <Moon className="h-4 w-4 mr-1" /> Dark </> )}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </header>
    </>
  )
}