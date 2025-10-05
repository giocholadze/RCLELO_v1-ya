import { Suspense } from "react"
import UpcomingMatches from "@/components/upcoming-matches"
import LatestNews from "@/components/latest-news"
import AboutSection from "@/components/about-section"
import { getRecentNews, getUpcomingMatches } from "@/lib/data"

export default function HomePage() {
  const recentNews = getRecentNews()
  const upcomingMatches = getUpcomingMatches()

  return (
    <div className="container py-6">
      <Suspense fallback={<div>Loading...</div>}>
        <AboutSection />
        <UpcomingMatches matches={upcomingMatches} />
        <LatestNews news={recentNews} />
      </Suspense>
    </div>
  )
}
