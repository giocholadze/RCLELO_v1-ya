import { notFound } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, User, Calendar, Clock, Facebook, Twitter, Share } from "lucide-react"
import Link from "next/link"
import { getAllNewsFromStorage } from "@/lib/content-manager"

interface NewsDetailPageProps {
  params: {
    id: string
  }
}

export default async function NewsDetailPage({ params }: NewsDetailPageProps) {
  const allNews = await getAllNewsFromStorage()
  const article = allNews.find((n) => n.id === Number.parseInt(params.id))

  if (!article) {
    notFound()
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="w-full">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground">
          <Link href="/" className="hover:text-red-500">
            მთავარი
          </Link>
          {" / "}
          <Link href="/news" className="hover:text-red-500">
            სიახლეები
          </Link>
          {" / "}
          <span className="text-foreground">{article.title}</span>
        </nav>

        <article className="w-full">
          {/* Article Header */}
          <div className="mb-6">
            <Badge className="mb-3 bg-red-500">{article.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex flex-wrap gap-4 text-muted-foreground text-sm">
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1" />
                {article.author}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(article.publishedDate).toLocaleDateString("ka-GE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                {new Date(article.publishedDate).toLocaleTimeString("ka-GE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* New layout for image and content */}
          <div className="flex flex-col md:flex-row mb-8"> {/* Added flex container */}
            {article.imageUrl && (
              <div className="mb-6 md:mb-0 md:w-1/2 md:pr-8"> {/* Image container */}
                <img
                  src={article.imageUrl || "/placeholder.svg"}
                  alt={article.title}
                  className="w-full h-auto object-cover rounded-lg" // Removed max-h, added h-auto
                />
              </div>
            )}

            <div className="prose prose-lg max-w-none flex-grow"> {/* Content takes remaining space */}
              <div className="text-xl text-muted-foreground mb-6 font-medium leading-relaxed">{article.excerpt}</div>
              <div className="text-foreground leading-relaxed">
                {article.content.split("\n").map((paragraph, index) => (
                  <p key={index} className="mb-4">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Article Footer */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 py-6 border-t">
            <Link href="/news">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                უკან სიახლეებზე
              </Button>
            </Link>
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground mr-2">გაზიარება:</span>
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
        <div className="mt-12 w-full">
          <h3 className="text-2xl font-bold mb-6">მსგავსი სიახლეები</h3>
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
                        ვრცლად
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