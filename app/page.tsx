import UpcomingMatches from "@/components/upcoming-matches"
import LatestNews from "@/components/latest-news"
import AboutSection from "@/components/about-section"
import { getRecentNews, getUpcomingMatches } from "@/lib/content-manager"

export default async function HomePage() {
  const recentNews = await getRecentNews()
  const upcomingMatches = await getUpcomingMatches()

  return (
    <div className="w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
        {/* FIX: Pass the 'matches' prop to the AboutSection component */}
        <AboutSection matches={upcomingMatches} />
        <UpcomingMatches matches={upcomingMatches} />
        <LatestNews news={recentNews} />
      </div>
    </div>
  )
}

