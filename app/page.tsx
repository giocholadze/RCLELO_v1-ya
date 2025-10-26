import UpcomingMatches from "@/components/upcoming-matches"
import LatestNews from "@/components/latest-news"
import { getRecentNews, getUpcomingMatches } from "@/lib/content-manager"

// Tell Next.js to revalidate (re-fetch data and re-render) this page
// at most once every 300 seconds (5 minutes)
export const revalidate = 300;

export default async function HomePage() {
  const recentNews = await getRecentNews()
  const upcomingMatches = await getUpcomingMatches()

  return (
    <div className="w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
        <UpcomingMatches matches={upcomingMatches} />
        <LatestNews news={recentNews} />
      </div>
    </div>
  )
}