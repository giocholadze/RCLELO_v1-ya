import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Calendar, Clock, Eye, Facebook, Twitter, Share } from "lucide-react"
import Link from "next/link"
import { getAllNews } from "@/lib/data"

interface NewsDetailPageProps {
  params: {
    id: string
  }
}

export default function NewsDetailPage({ params }: NewsDetailPageProps) {
  const allNews = getAllNews()
  const article = allNews.find((n) => n.id === Number.parseInt(params.id))

  if (!article) {
    notFound()
  }

  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-red-500">
            Home
          </Link>
          {" / "}
          <Link href="/news" className="hover:text-red-500">
            News
          </Link>
          {" / "}
          <span className="text-foreground">{article.title}</span>
        </nav>

        <article>
          {/* Article Header */}
          <div className="mb-6">
            <Badge className="mb-3 bg-red-500">{article.category}</Badge>
            <h1 className="text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {article.author}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(article.publishedDate).toLocaleDateString("en", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(article.publishedDate).toLocaleTimeString("en", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
              <span className="flex items-center">
                <Eye className="h-4 w-4 mr-1" />
                {article.viewCount} views
              </span>
            </div>
          </div>

          {/* Article Image */}
          {article.imageUrl && (
            <div className="mb-6">
              <img
                src={article.imageUrl || "/placeholder.svg"}
                alt={article.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Article Content */}
          <div className="prose prose-lg max-w-none mb-8">
            <div className="text-xl text-muted-foreground mb-6 font-medium leading-relaxed">{article.excerpt}</div>
            <div className="text-foreground leading-relaxed">
              {article.content.split("\n").map((paragraph, index) => (
                <p key={index} className="mb-4">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>

          {/* Article Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6 border-t">
            <Link href="/news">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to News
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground mr-2">Share:</span>
              <Button variant="outline" size="sm">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {allNews
              .filter((a) => a.id !== article.id && a.category === article.category)
              .slice(0, 2)
              .map((relatedArticle) => (
                <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={relatedArticle.imageUrl || "/placeholder.svg?height=200&width=350"}
                    alt={relatedArticle.title}
                    className="w-full h-48 object-cover"
                  />
                  <CardContent className="p-4">
                    <h5 className="font-semibold mb-2">{relatedArticle.title}</h5>
                    <p className="text-sm text-muted-foreground mb-3">{relatedArticle.excerpt}</p>
                    <Link href={`/news/${relatedArticle.id}`}>
                      <Button variant="outline" size="sm">
                        Read More
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))}
          </div>
        </div>
      </div>
    </div>
  )
}
