"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Newspaper, User, Eye, ArrowRight, Loader2, MapPin, Calendar, BriefcaseMedical } from "lucide-react"
import StatsSection from "@/components/stats-section"
import Link from "next/link"
import { getRecentNewsByCategories, getUpcomingMatchesByCategories } from "@/lib/content-manager"
import type { LeagueCategory, NewsItem, MatchFixture } from "@/lib/types"

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

  // Handle setting the active tab from URL parameters
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && leagueTabs.some((t) => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  // Fetch all relevant data for all youth categories when the component first loads
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

  // This single function renders content dynamically based on the active tab
  const renderContent = () => {
    const activeCategory = leagueTabs.find(tab => tab.id === activeTab)?.category
    if (!activeCategory) return null

    const filteredNews = news.filter(item => item.category === activeCategory).slice(0, 3)
    const filteredMatches = matches.filter(item => item.matchType === activeCategory).slice(0, 3)

    return (
        <div className="space-y-8">
            {/* You can add StatsSections here for each youth league if you wish */}
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
             {activeTab === 'youth-b' && (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">ლიგა "ბ"-ის სტატისტიკა მალე დაემატება</p>
                  </div>
            )}
            {activeTab === 'festival' && (
                <div className="text-center py-12"><p className="text-muted-foreground">საფესტივალო-ს სტატისტიკა მალე დაემატება</p></div>
            )}

            {/* Display Upcoming Matches for the selected category */}
            <Card className="border-0 shadow-md">
                <CardHeader><CardTitle className="flex items-center"><Calendar className="mr-2 h-5 w-5 text-red-500" /><span className="text-xl font-semibold">მომავალი მატჩები</span></CardTitle></CardHeader>
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
                    ) : <p className="text-muted-foreground text-center p-4">ამ კატეგორიაში მომავალი მატჩები არ მოიძებნა.</p>}
                </CardContent>
            </Card>

            {/* Display News for the selected category */}
            <Card className="border-0 shadow-md">
                <CardHeader><CardTitle className="flex items-center"><Newspaper className="mr-2 h-5 w-5 text-red-500" /><span className="text-xl font-semibold">სიახლეები</span></CardTitle></CardHeader>
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
                                            <span className="flex items-center"><Eye className="h-3 w-3 mr-1"/>{article.viewCount}</span>
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))
                    ) : <p className="text-muted-foreground text-center p-4">ამ კატეგორიაში სიახლეები არ მოიძებნა.</p>}
                </CardContent>
            </Card>
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