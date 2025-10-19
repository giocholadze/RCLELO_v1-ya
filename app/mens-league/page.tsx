"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Users, Star, Newspaper, User, Eye, ArrowRight, Loader2, MapPin } from "lucide-react"
import StatsSection from "@/components/stats-section"
import Link from "next/link"
import { getRecentNewsByCategories, getUpcomingMatchesByCategories } from "@/lib/content-manager"
import type { LeagueCategory, NewsItem, MatchFixture } from "@/lib/types"

const leagueTabs = [
  { id: "premier", label: "უმაღლესი ლიგა", category: "უმაღლესი" as LeagueCategory },
  { id: "espuarta", label: "ესპუართა", category: "ესპუართა" as LeagueCategory },
]

// Define the specific categories this page is interested in
const mensLeagueCategories: LeagueCategory[] = ["უმაღლესი", "ესპუართა"]

export default function MensLeaguePage() {
  const [activeTab, setActiveTab] = useState("premier")
  // 1. Add state for news, matches, and loading status
  const [news, setNews] = useState<NewsItem[]>([])
  const [matches, setMatches] = useState<MatchFixture[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 2. Fetch all relevant data when the component first loads
  useEffect(() => {
    const loadLeagueData = async () => {
      setIsLoading(true)
      // Fetch data for ALL men's categories at once
      const [fetchedNews, fetchedMatches] = await Promise.all([
        getRecentNewsByCategories(mensLeagueCategories, 10), // Fetch a few more to ensure each tab has data
        getUpcomingMatchesByCategories(mensLeagueCategories, 10),
      ])
      setNews(fetchedNews)
      setMatches(fetchedMatches)
      setIsLoading(false)
    }
    loadLeagueData()
  }, [])

  // 3. This single function now renders content dynamically
  const renderContent = () => {
    const activeCategory = leagueTabs.find(tab => tab.id === activeTab)?.category
    if (!activeCategory) return null

    // Filter the already-fetched data for the active category
    const filteredNews = news.filter(item => item.category === activeCategory).slice(0, 3)
    const filteredMatches = matches.filter(item => item.matchType === activeCategory).slice(0, 3)

    return (
        <div className="space-y-8">
            {/* Display StatsSection based on active tab */}
            {activeTab === 'premier' && (
                <StatsSection
                    sectionKey="premier_league"
                    title="უმაღლესი ლიგა"
                    stats={[
                        { icon: Trophy, defaultNumber: "საქართველოს ჩემპიონი", defaultLabel: "ტიტული" },
                        { icon: Calendar, defaultNumber: "საქართველოს თასი", defaultLabel: "მიღწევა" },
                        { icon: Users, defaultNumber: "საქართველოს ვიცე-ჩემპიონი", defaultLabel: "პოზიცია" },
                        { icon: Star, defaultNumber: "30", defaultLabel: "მოთამაშე" },
                    ]}
                />
            )}
            {activeTab === 'espuarta' && (
                 <StatsSection
                    sectionKey="espuarta_league"
                    title="ესპუართა ლიგა"
                    stats={[
                        { icon: Trophy, defaultNumber: "ჩემპიონი", defaultLabel: "ტიტული" },
                        { icon: Users, defaultNumber: "38:20", defaultLabel: "ფინალის ანგარიში" },
                        { icon: Calendar, defaultNumber: "3 მაისი", defaultLabel: "ფინალის თარიღი" },
                        { icon: Star, defaultNumber: "ავჭალა", defaultLabel: "ფინალის ადგილი" },
                    ]}
                />
            )}

            {/* Display Upcoming Matches for the selected category */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Calendar className="mr-2 h-5 w-5 text-red-500" />
                        <span className="text-xl font-semibold">მომავალი მატჩები</span>
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {filteredMatches.length > 0 ? (
                        filteredMatches.map(match => (
                            <div key={match.id} className="border-b last:border-b-0 py-4">
                                <div className="flex justify-between items-center">
                                    <div className="font-semibold">{match.homeTeam} vs {match.awayTeam}</div>
                                    <div className="text-sm text-muted-foreground">{new Date(match.matchDate).toLocaleDateString('ka-GE', {month: 'short', day: 'numeric'})}</div>
                                </div>
                                <div className="text-xs text-muted-foreground mt-1 flex items-center"><MapPin className="h-3 w-3 mr-1"/>{match.venue}</div>
                            </div>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center p-4">ამ კატეგორიაში მომავალი მატჩები არ მოიძებნა.</p>
                    )}
                </CardContent>
            </Card>

            {/* Display News for the selected category */}
            <Card className="border-0 shadow-md">
                <CardHeader>
                    <CardTitle className="flex items-center">
                        <Newspaper className="mr-2 h-5 w-5 text-red-500" />
                        <span className="text-xl font-semibold">სიახლეები</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                    {filteredNews.length > 0 ? (
                        filteredNews.map(article => (
                            <Link key={article.id} href={`/news/${article.id}`} className="block border rounded-lg p-4 hover:shadow-md transition-shadow">
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <img src={article.imageUrl || "/placeholder.svg"} alt={article.title} className="w-full sm:w-48 h-32 object-cover rounded"/>
                                    <div className="flex-1">
                                        <Badge variant="secondary" className="mb-2">{article.category}</Badge>
                                        <h3 className="font-semibold mb-2 line-clamp-2">{article.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{article.excerpt}</p>
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="flex items-center"><User className="h-3 w-3 mr-1"/>{article.author}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : (
                        <p className="text-muted-foreground text-center p-4">ამ კატეგორიაში სიახლეები არ მოიძებნა.</p>
                    )}
                </CardContent>
            </Card>
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
        
        {/* Render a loading spinner or the dynamic content */}
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