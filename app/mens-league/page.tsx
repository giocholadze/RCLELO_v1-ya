"use client"

// 1. Import necessary hooks
import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from 'next/navigation' // Import useSearchParams

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, Users, Star, Loader2 } from "lucide-react"
import StatsSection from "@/components/stats-section"
import { getRecentNewsByCategories, getUpcomingMatchesByCategories } from "@/lib/content-manager"
import type { LeagueCategory, NewsItem, MatchFixture } from "@/lib/types"
import UpcomingMatches from "@/components/upcoming-matches"
import LatestNews from "@/components/latest-news"

const leagueTabs = [
  { id: "premier", label: "უმაღლესი ლიგა", category: "უმაღლესი" as LeagueCategory },
  { id: "espuarta", label: "ესპუართა", category: "ესპუართა" as LeagueCategory },
]

const mensLeagueCategories: LeagueCategory[] = ["უმაღლესი", "ესპუართა"]

// Wrap the main component logic to use Suspense for searchParams
function MensLeagueContent() {
  const searchParams = useSearchParams()
  const initialTab = searchParams.get('tab') || "premier" // Get tab from URL or default

  // 2. Initialize activeTab state based on the URL parameter
  const [activeTab, setActiveTab] = useState(initialTab)
  const [news, setNews] = useState<NewsItem[]>([])
  const [matches, setMatches] = useState<MatchFixture[]>([])
  const [isLoading, setIsLoading] = useState(true)

   // 3. Add useEffect to sync state if URL changes *after* initial load (optional but good practice)
   useEffect(() => {
    const currentTab = searchParams.get('tab') || "premier";
    if (currentTab !== activeTab && (currentTab === "premier" || currentTab === "espuarta")) {
        setActiveTab(currentTab);
    }
   }, [searchParams, activeTab]);


  useEffect(() => {
    const loadLeagueData = async () => {
      setIsLoading(true)
      const [fetchedNews, fetchedMatches] = await Promise.all([
        getRecentNewsByCategories(mensLeagueCategories, 10),
        getUpcomingMatchesByCategories(mensLeagueCategories, 10),
      ])
      setNews(fetchedNews)
      setMatches(fetchedMatches)
      setIsLoading(false)
    }
    loadLeagueData()
  }, []) // Data fetching still runs once on load

  const renderContent = () => {
    const activeCategory = leagueTabs.find(tab => tab.id === activeTab)?.category
    if (!activeCategory) return null

    // Filter based on the current activeTab state
    const filteredNews = news.filter(item => item.category === activeCategory).slice(0, 3)
    const filteredMatches = matches.filter(item => item.matchType === activeCategory).slice(0, 3)

    return (
        <div className="space-y-8">
            {activeTab === 'premier' && (
                <StatsSection
                    sectionKey="premier_league"
                    title="უმაღლესი ლიგა"
                    stats={[
                        { icon: Trophy, defaultNumber: "საქართველოს ჩემპიონი", defaultLabel: "6" },
                        { icon: Calendar, defaultNumber: "საქართველოს მედალი", defaultLabel: "6" },
                    ]}
                />
            )}
            {activeTab === 'espuarta' && (
                 <StatsSection
                    sectionKey="espuarta_league"
                    title="ესპუართა ლიგა"
                    stats={[
                       // Add stats for espuarta if available
                    ]}
                />
            )}
            <UpcomingMatches matches={filteredMatches} />
            <LatestNews news={filteredNews} />
        </div>
    )
  }

  return (
    <>
      {/* Tab Buttons remain the same, controlling the state */}
      <div className="bg-red-50 dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="container">
          <div className="flex justify-end items-center h-12 gap-2 py-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {leagueTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)} // This updates the state
                  className={`text-xs whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 px-4">
        <div className="mb-8">
            {/* Header section remains the same */}
            <div className="flex items-center mb-4">
               <div className="bg-red-500 text-white p-3 rounded-lg mr-4 flex-shrink-0">
                 <Users className="h-8 w-8" />
               </div>
               <div className="min-w-0">
                 <h1 className="text-4xl font-bold mb-1 break-words">კაცთა ლიგა</h1>
                 <p className="text-muted-foreground text-lg break-words">ლელოს კაცთა გუნდის ყველა აქტივობა</p>
               </div>
             </div>
             <nav className="text-sm text-muted-foreground">
               <span>მთავარი</span> / <span className="text-foreground">კაცთა ლიგა</span>
             </nav>
        </div>

        {isLoading ? (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="h-12 w-12 animate-spin text-red-500"/>
            </div>
        ) : (
            renderContent() // Renders content based on activeTab state
        )}
      </div>
    </>
  )
}

// 4. Export the page component wrapped in Suspense
export default function MensLeaguePage() {
    return (
        <Suspense fallback={<Loader />}> {/* Add a simple loader */}
            <MensLeagueContent />
        </Suspense>
    )
}

// Simple Loader component for Suspense
function Loader() {
    return (
        <div className="flex justify-center items-center py-20">
             <Loader2 className="h-12 w-12 animate-spin text-red-500"/>
        </div>
    )
}