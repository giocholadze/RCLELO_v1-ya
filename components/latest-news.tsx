import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Newspaper, User } from "lucide-react"
import Link from "next/link"
import type { NewsItem } from "@/lib/types"
import EditableText from "@/components/editable-text"

interface LatestNewsProps {
  news: NewsItem[]
}

export default function LatestNews({ news }: LatestNewsProps) {
  return (
    <section className="mb-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center">
          <Newspaper className="mr-3 h-6 w-6 text-red-500" />
          <EditableText contentKey="recent_news_title" defaultValue="ბოლო სიახლეები" className="text-2xl font-bold" />
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {news.slice(0, 3).map((article, index) => (
          <Link key={article.id} href={`/news/${article.id}`} className="block">
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border-0 shadow-md cursor-pointer group">
              <div className="relative">
                <img
                  src={article.imageUrl || "/placeholder.svg?height=150&width=350"}
                  alt={article.title}
                  className="w-full h-32 md:h-36 object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-medium">
                  <div className="text-center">
                    <div className="text-sm font-bold">{new Date(article.publishedDate).getDate()}</div>
                    <div className="text-xs">
                      {new Date(article.publishedDate).toLocaleDateString("ka-GE", { month: "short" }).toUpperCase()}
                    </div>
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <Badge variant="secondary" className="mb-2 text-xs">
                  {article.category}
                </Badge>
                <h3 className="font-semibold text-base mb-2 line-clamp-2 leading-tight group-hover:text-red-500 transition-colors">
                  {article.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-3 line-clamp-3">{article.excerpt}</p>
                <div className="flex items-center text-xs text-muted-foreground">
                  <User className="h-3 w-3 mr-1" />
                  {article.author}
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
