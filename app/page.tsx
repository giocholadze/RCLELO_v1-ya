import UpcomingMatches from "@/components/upcoming-matches"
import LatestNews from "@/components/latest-news"
import AboutSection from "@/components/about-section"
import { getRecentNews, getUpcomingMatches } from "@/lib/data"

export default async function HomePage() {
  const recentNews = await getRecentNews()
  const upcomingMatches = await getUpcomingMatches()

  return (
    <div className="w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
        <AboutSection />
        <UpcomingMatches matches={upcomingMatches} />
        <LatestNews news={recentNews} />
      </div>
    </div>
  )
}
