import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { User, Calendar, Eye } from "lucide-react"
import Link from "next/link"
import type { NewsItem } from "@/lib/types"

interface HeroSectionProps {
  featuredNews: NewsItem | null
}

export default function HeroSection({ featuredNews }: HeroSectionProps) {
  if (!featuredNews) return null

  return (
    <Link href={`/news/${featuredNews.id}`} className="block">
      <Card className="mb-6 overflow-hidden border-0 shadow-lg cursor-pointer group hover:shadow-xl transition-shadow">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-0">
          <div className="lg:col-span-2 relative">
            <img
              src={featuredNews.imageUrl || "/placeholder.svg?height=300&width=400"}
              alt={featuredNews.title}
              className="w-full h-64 lg:h-80 object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-red-500 hover:bg-red-600">{featuredNews.category}</Badge>
            </div>
          </div>
          <CardContent className="lg:col-span-3 p-6 lg:p-8 flex flex-col justify-center">
            <div className="text-red-500 font-bold mb-2 text-sm">უახლესი სიახლე</div>
            <h1 className="text-2xl lg:text-3xl font-bold mb-3 leading-tight group-hover:text-red-500 transition-colors">
              {featuredNews.title}
            </h1>
            <p className="text-muted-foreground mb-4 line-clamp-3">{featuredNews.excerpt}</p>
            <div className="flex items-center space-x-4 text-sm text-muted-foreground mb-6">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {featuredNews.author}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(featuredNews.publishedDate).toLocaleDateString()}
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {featuredNews.viewCount}
              </span>
            </div>
            <Button className="bg-red-500 hover:bg-red-600 w-full lg:w-auto">Read More</Button>
          </CardContent>
        </div>
      </Card>
    </Link>
  )
}
