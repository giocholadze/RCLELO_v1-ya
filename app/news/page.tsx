"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Search, User, Calendar } from "lucide-react"
import Link from "next/link"
import { getAllNewsFromStorage } from "@/lib/content-manager"
import type { NewsItem } from "@/lib/types"

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [searchTerm, setSearchTerm] = useState("")
  const [allNews, setAllNews] = useState<NewsItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    loadNews()
  }, [])

  const loadNews = async () => {
    setIsLoading(true)
    const news = await getAllNewsFromStorage()
    setAllNews(news)
    setIsLoading(false)
  }

  const categories = ["All", ...Array.from(new Set(allNews.map((n) => n.category)))]

  const filteredNews = allNews.filter((article) => {
    const matchesCategory = selectedCategory === "All" || article.category === selectedCategory
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  if (isLoading) {
    return (
      <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
        <div className="text-center">Loading news...</div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-4xl font-bold mb-1">სიახლეები</h1>
            <p className="text-muted-foreground text-lg">იყავით ინფორმირებული ყველა უახლესი სპორტული სიახლისა და განახლების შესახებ</p>
          </div>
          <div className="flex items-center space-x-2">
            <Input
              placeholder="მოძებნა..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-64"
            />
            <Button variant="outline" size="icon">
              <Search className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <nav className="text-sm text-muted-foreground">
          <span>მთავარი</span> / <span className="text-foreground">სიახლეები</span>
        </nav>
      </div>

      {/* Category Filter */}
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category)}
              className={selectedCategory === category ? "bg-red-500 hover:bg-red-600" : "hover:bg-red-50"}
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* News Grid */}
      {filteredNews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((article) => (
            <Link key={article.id} href={`/news/${article.id}`} className="block">
              <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group">
                <div className="relative">
                  <img
                    src={article.imageUrl || "/placeholder.svg?height=150&width=350"}
                    alt={article.title}
                    className="w-full h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 left-3 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                    <div className="text-center">
                      <div className="text-sm font-bold">{new Date(article.publishedDate).getDate()}</div>
                      <div className="text-xs">
                        {new Date(article.publishedDate).toLocaleDateString("en", { month: "short" }).toUpperCase()}
                      </div>
                    </div>
                  </div>
                </div>
                <CardContent className="p-5">
                  <Badge variant="secondary" className="mb-2">
                    {article.category}
                  </Badge>
                  <h3 className="font-semibold text-lg mb-2 line-clamp-2 group-hover:text-red-500 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 line-clamp-3">{article.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center space-x-4">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {article.author}
                      </span>
                      <span className="flex items-center">
                        <Calendar className="h-3 w-3 mr-1" />
                        {new Date(article.publishedDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📰</div>
          <h3 className="text-xl font-semibold mb-2">No news articles found</h3>
          <p className="text-muted-foreground mb-4">
            Try adjusting your search criteria or check back later for updates.
          </p>
          <Button
            onClick={() => {
              setSelectedCategory("all")
              setSearchTerm("")
            }}
          >
            View All News
          </Button>
        </div>
      )}
    </div>
  )
}
