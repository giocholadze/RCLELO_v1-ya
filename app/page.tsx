import UpcomingMatches from "@/components/upcoming-matches"
import LatestNews from "@/components/latest-news"
import { getRecentNews, getUpcomingMatches } from "@/lib/content-manager"
import { Play } from "lucide-react" // Import Play icon

export const revalidate = 300;

export default async function HomePage() {
  const recentNews = await getRecentNews()
  const upcomingMatches = await getUpcomingMatches()

  // --- YouTube Video Details ---
  const youtubeLink = "https://www.youtube.com/watch?v=9sCiJYX1FSM"; // Standard watch link
  // Removed title and description variables as they won't be displayed

  // --- Extract Video ID ---
  const videoIdMatch = youtubeLink.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|youtu\.be\/)([\w-]{11})(?:\S+)?/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  // Simplified embed URL for maximum compatibility
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  // --- End Video Details ---

  return (
    <div className="w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 py-6">
        <UpcomingMatches matches={upcomingMatches} />
        <LatestNews news={recentNews} />

                {/* --- Embedded YouTube Video Section --- */}
        {embedUrl && (
          <div className="relative w-full overflow-hidden rounded-lg shadow-lg mb-8 bg-black">
            {/* Embedded YouTube Video */}
            <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={embedUrl}
                // Using a generic title now
                title="YouTube video player"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                referrerPolicy="strict-origin-when-cross-origin"
                allowFullScreen
              ></iframe>
            </div>

            {/* Overlay Content - Removed title and description */}
            {/* You could optionally leave a very minimal overlay or remove it entirely */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none">
                {/* Overlay is now just a subtle shadow, no text */}
            </div>
          </div>
        )}
        {/* --- End YouTube Video Section --- */}

      </div>
    </div>
  )
}