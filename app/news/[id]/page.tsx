// app/news/[id]/page.tsx

// 1. Import necessary types and functions
import { notFound } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, User, Calendar, Clock, Facebook, Twitter, Share } from "lucide-react";
import Link from "next/link";
// Import Supabase client directly or a specific fetch function
import { supabase } from "@/lib/supabase";
import type { NewsItem } from "@/lib/types"; // Make sure NewsItem type is correct
import type { Metadata, ResolvingMetadata } from 'next'; // Import Metadata types
import Image from "next/image"; // Import Next.js Image component if needed for body

// --- Define Props Type ---
type Props = {
  params: { id: string };
  searchParams: { [key: string]: string | string[] | undefined };
};

// --- Function to fetch a SINGLE news item ---
// (More efficient than fetching all news)
async function getNewsItem(id: string): Promise<NewsItem | null> {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
        return null; // Invalid ID format
    }

    const { data, error } = await supabase
        .from('news')
        .select('*')
        .eq('id', numericId)
        .single();

    if (error || !data) {
        console.error("Error fetching single news item:", error);
        return null;
    }

    // Map database columns to your NewsItem type (ensure consistency)
    return {
        id: data.id,
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        author: data.author,
        category: data.category,
        publishedDate: data.published_date,
        viewCount: data.view_count,
        imageUrl: data.image_url,
        isArchived: data.is_archived
    };
}

// --- Dynamically Generate Metadata ---
export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.id;
  const newsItem = await getNewsItem(id);

  // Default values
  const siteUrl = "https://rclelo.ge"; // Define your base site URL
  const defaultTitle = "სიახლე | რაგბის კლუბი ლელო";
  const defaultDescription = "წაიკითხეთ ლელოს რაგბის კლუბის უახლესი ამბები.";
  // Make sure you have a default logo/image in your public folder
  const defaultImageUrl = `${siteUrl}/images/lelo-logo-og.png`; // Example default image path

  const pageTitle = newsItem?.title ? `${newsItem.title} | რაგბის კლუბი ლელო` : defaultTitle;
  const pageDescription = newsItem?.excerpt || defaultDescription;
  // Ensure imageUrl is absolute. If it's already absolute from Supabase, this is fine.
  // If it's relative, prepend siteUrl. Assuming Supabase URLs are absolute.
  const imageUrl = newsItem?.imageUrl || defaultImageUrl;
  const pageUrl = `${siteUrl}/news/${id}`;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      title: newsItem?.title || "რაგბის კლუბი ლელო", // Use article title or site title
      description: pageDescription,
      url: pageUrl,
      siteName: 'რაგბის კლუბი ლელო',
      images: [
        {
          url: imageUrl,
          // It's good practice to provide width/height if known, but optional
          // width: 1200,
          // height: 630,
          alt: newsItem?.title || "ლელოს ლოგო",
        },
      ],
      locale: 'ka_GE',
      type: 'article', // Correct type for news
      // Optional: Add article-specific tags if available
      // publishedTime: newsItem?.publishedDate,
      // authors: newsItem?.author ? [newsItem.author] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: newsItem?.title || "რაგბის კლუბი ლელო",
      description: pageDescription,
      // site: '@YourTwitterHandle', // Optional
      // creator: '@AuthorTwitterHandle', // Optional
      images: [imageUrl],
    },
  };
}


// --- The Page Component ---
export default async function NewsDetailPage({ params }: Props) {
  // Fetch only the specific article needed for the page
  const article = await getNewsItem(params.id);

  if (!article) {
    notFound(); // Trigger Next.js 404 page if article not found
  }

  // Fetch related articles (optional, could be moved to a separate component)
  // Note: Fetching all news here again is inefficient if only needed for related articles.
  // Consider creating a function `getRelatedNews(category, currentId)`
  const { data: relatedNewsData } = await supabase
        .from('news')
        .select('*')
        .eq('category', article.category)
        .neq('id', article.id) // Exclude the current article
        .limit(2) // Limit to 2 related articles
        .order('published_date', { ascending: false });

  const relatedArticles: NewsItem[] = (relatedNewsData || []).map(item => ({
        id: item.id,
        title: item.title,
        excerpt: item.excerpt,
        content: item.content, // Not strictly needed here
        author: item.author,
        category: item.category,
        publishedDate: item.published_date,
        viewCount: item.view_count,
        imageUrl: item.image_url,
        isArchived: item.is_archived
  }));

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
          <span className="text-foreground line-clamp-1">{article.title}</span> {/* Added line-clamp */}
        </nav>

        <article className="w-full">
          {/* Article Header */}
          <div className="mb-6">
            <Badge className="mb-3 bg-red-500">{article.category}</Badge>
            <h1 className="text-3xl sm:text-4xl font-bold mb-4">{article.title}</h1>
            <div className="flex flex-wrap gap-x-4 gap-y-2 text-muted-foreground text-sm"> {/* Adjusted gap */}
              <span className="flex items-center">
                <User className="h-4 w-4 mr-1.5" /> {/* Adjusted margin */}
                {article.author}
              </span>
              <span className="flex items-center">
                <Calendar className="h-4 w-4 mr-1.5" /> {/* Adjusted margin */}
                {new Date(article.publishedDate).toLocaleDateString("ka-GE", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
              <span className="flex items-center">
                <Clock className="h-4 w-4 mr-1.5" /> {/* Adjusted margin */}
                {new Date(article.publishedDate).toLocaleTimeString("ka-GE", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>

          {/* New layout for image and content */}
          {/* Using grid layout for better control */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {article.imageUrl && (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden"> {/* Use aspect ratio */}
                <Image // Use Next.js Image component
                  src={article.imageUrl}
                  alt={article.title}
                  fill // Use fill and object-cover
                  className="object-cover"
                  priority // Prioritize loading the main image
                />
              </div>
            )}

            {/* Content Area - Ensure it spans full width if no image */}
            <div className={`prose prose-lg dark:prose-invert max-w-none ${!article.imageUrl ? 'md:col-span-2' : ''}`}>
              {/* Display Excerpt */}
              {article.excerpt && (
                  <p className="text-xl text-muted-foreground font-medium leading-relaxed italic border-l-4 border-red-500 pl-4 mb-6">
                      {article.excerpt}
                  </p>
              )}
              {/* Display Main Content */}
              {/* Consider using a Markdown renderer if content is Markdown */}
              {/* For plain text with newlines: */}
              <div className="text-foreground leading-relaxed space-y-4">
                {article.content.split("\n").map((paragraph, index) => (
                    paragraph.trim() && <p key={index}>{paragraph}</p> // Render non-empty paragraphs
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
            {/* TODO: Implement actual sharing functionality */}
            <div className="flex items-center gap-2">
              <span className="text-muted-foreground mr-2">გაზიარება:</span>
              <Button variant="outline" size="sm" title="Share on Facebook (Not implemented)">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" title="Share on Twitter (Not implemented)">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" title="Share (Not implemented)">
                <Share className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </article>

        {/* Related Articles */}
        {relatedArticles.length > 0 && (
          <div className="mt-12 w-full">
            <h3 className="text-2xl font-bold mb-6">მსგავსი სიახლეები</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {relatedArticles.map((relatedArticle) => (
                  <Card key={relatedArticle.id} className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col sm:flex-row"> {/* Flex layout for card */}
                       {relatedArticle.imageUrl && (
                           <div className="w-full sm:w-1/3 h-48 sm:h-auto relative flex-shrink-0">
                               <Image
                                   src={relatedArticle.imageUrl}
                                   alt={relatedArticle.title}
                                   fill
                                   className="object-cover"
                               />
                           </div>
                       )}
                      <CardContent className={`p-4 flex flex-col justify-between ${relatedArticle.imageUrl ? 'sm:w-2/3' : 'w-full'}`}>
                          <div>
                              <h5 className="font-semibold mb-2 line-clamp-2">{relatedArticle.title}</h5>
                              <p className="text-sm text-muted-foreground mb-3 line-clamp-3">{relatedArticle.excerpt}</p>
                          </div>
                          <Link href={`/news/${relatedArticle.id}`} className="mt-auto">
                              <Button variant="outline" size="sm">
                                  ვრცლად
                              </Button>
                          </Link>
                      </CardContent>
                  </Card>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}