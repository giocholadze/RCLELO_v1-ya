"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Trophy, Users, Star, Loader2 } from "lucide-react"
import StatsSection from "@/components/stats-section"
import { getRecentNewsByCategories, getUpcomingMatchesByCategories } from "@/lib/content-manager"
import type { LeagueCategory, NewsItem, MatchFixture } from "@/lib/types"
// 1. Import the reusable components
import UpcomingMatches from "@/components/upcoming-matches"
import LatestNews from "@/components/latest-news"

const leagueTabs = [
  { id: "premier", label: "უმაღლესი ლიგა", category: "უმაღლესი" as LeagueCategory },
  { id: "espuarta", label: "ესპუართა", category: "ესპუართა" as LeagueCategory },
]

const mensLeagueCategories: LeagueCategory[] = ["უმაღლესი", "ესპუართა"]

export default function MensLeaguePage() {
  const [activeTab, setActiveTab] = useState("premier")
  const [news, setNews] = useState<NewsItem[]>([])
  const [matches, setMatches] = useState<MatchFixture[]>([])
  const [isLoading, setIsLoading] = useState(true)

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
  }, [])

  const renderContent = () => {
    const activeCategory = leagueTabs.find(tab => tab.id === activeTab)?.category
    if (!activeCategory) return null

    const filteredNews = news.filter(item => item.category === activeCategory).slice(0, 3)
    const filteredMatches = matches.filter(item => item.matchType === activeCategory).slice(0, 3)

    return (
        <div className="space-y-8">
            {/* Stats Sections remain the same */}
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
                    ]}
                />
            )}

            {/* 2. FIX: Use the reusable components to display the data */}
            <UpcomingMatches matches={filteredMatches} />
            <LatestNews news={filteredNews} />
        </div>
    )
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="bg-red-50 dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="container">
          <div className="flex justify-end items-center h-12 gap-2 py-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {leagueTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
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
            renderContent()
        )}
      </div>
    </div>
  )
}