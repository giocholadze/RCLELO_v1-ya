"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Users, Loader2,  } from "lucide-react"
import StatsSection from "@/components/stats-section"
import { getRecentNewsByCategories, getUpcomingMatchesByCategories } from "@/lib/content-manager"
import type { LeagueCategory, NewsItem, MatchFixture } from "@/lib/types"
// 1. Import the reusable components
import UpcomingMatches from "@/components/upcoming-matches"
import LatestNews from "@/components/latest-news"

const leagueTabs = [
  { id: "youth-a", label: 'ლიგა "ა"', category: "ლიგა 'ა'" as LeagueCategory },
  { id: "youth-b", label: 'ლიგა "ბ"', category: "ლიგა 'ბ'" as LeagueCategory },
  { id: "festival", label: "საფესტივალო", category: "საფესტივალო" as LeagueCategory },
]

// Define the specific categories for this page
const youthLeagueCategories: LeagueCategory[] = ["ლიგა 'ა'", "ლიგა 'ბ'", "საფესტივალო"]

export default function YouthLeaguePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("youth-a")
  const [news, setNews] = useState<NewsItem[]>([])
  const [matches, setMatches] = useState<MatchFixture[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && leagueTabs.some((t) => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  useEffect(() => {
    const loadLeagueData = async () => {
      setIsLoading(true)
      const [fetchedNews, fetchedMatches] = await Promise.all([
        getRecentNewsByCategories(youthLeagueCategories, 10),
        getUpcomingMatchesByCategories(youthLeagueCategories, 10),
      ])
      setNews(fetchedNews)
      setMatches(fetchedMatches)
      setIsLoading(false)
    }
    loadLeagueData()
  }, [])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    router.push(`/youth-league?tab=${tabId}`)
  }

  const renderContent = () => {
    const activeCategory = leagueTabs.find(tab => tab.id === activeTab)?.category
    if (!activeCategory) return null

    const filteredNews = news.filter(item => item.category === activeCategory).slice(0, 3)
    const filteredMatches = matches.filter(item => item.matchType === activeCategory).slice(0, 3)

    return (
        <div className="space-y-8">
            {activeTab === 'youth-a' && (
                <StatsSection
                    sectionKey="youth_a_league"
                    title='ჭაბუკთა "ა" ლიგა'
                    stats={[
                        { icon: Trophy, defaultNumber: "მოგებული თასი", defaultLabel: "მიღწევა" },
                        { icon: Users, defaultNumber: "24", defaultLabel: "აკადემიის მოთამაშეები" },
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
        <div className="w-full max-w-[1200px] mx-auto px-4">
          <div className="flex justify-end items-center h-12 gap-2 py-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {leagueTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => handleTabChange(tab.id)}
                  className={`text-xs whitespace-nowrap flex-shrink-0 ${ activeTab === tab.id ? "bg-red-500 hover:bg-red-600 text-white" : "text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-slate-700" }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="w-full py-8">
        <div className="mb-8 w-full max-w-[1200px] mx-auto px-4">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 text-white p-3 rounded-lg mr-4 flex-shrink-0">
              <Users className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              <h1 className="text-4xl font-bold mb-1 break-words">ახალგაზრდული ლიგა</h1>
              <p className="text-muted-foreground text-lg break-words">მომავალი თაობის რაგბის ტალანტების განვითარება</p>
            </div>
          </div>
          <nav className="text-sm text-muted-foreground">
            <span>მთავარი</span> / <span className="text-foreground">ახალგაზრდული ლიგა</span>
          </nav>
        </div>

        <div className="w-full max-w-[1200px] mx-auto px-4">
            {isLoading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-12 w-12 animate-spin text-red-500"/>
                </div>
            ) : (
                renderContent()
            )}
        </div>
      </div>
    </div>
  )
}