import UpcomingMatches from "@/components/upcoming-matches"
import LatestNews from "@/components/latest-news"
// No longer importing YoutubeVideoSection
import { getRecentNews, getUpcomingMatches } from "@/lib/content-manager"
import { Play } from "lucide-react" // Import Play icon here

export const revalidate = 300;

export default async function HomePage() {
  const recentNews = await getRecentNews()
  const upcomingMatches = await getUpcomingMatches()

  // --- YouTube Video Details ---
  const youtubeLink = "https://www.youtube.com/watch?v=9sCiJYX1FSM&feature=youtu.be";
  const youtubeTitle = "საქართველო ეფუტსალება! – ფუტსალის ნაკრები ერო 2026-ზე ითამაშებს";
  const youtubeDescription = "ნახეთ საქართველოს ფუტსალის ნაკრების უახლესი მატჩები და სიახლეები ევრო 2026-ის შესარჩევი ეტაპიდან.";

  // --- Extract Video ID ---
  const videoIdMatch = youtubeLink.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|youtu\.be\/)([\w-]{11})(?:\S+)?/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  const embedUrl = videoId ? `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&showinfo=0&rel=0` : null;
  // --- End Video Details ---

  return (
    <div className="w-full">
      <div className="w-full max-w-[1200px] mx-auto px-4 py-6">


        <UpcomingMatches matches={upcomingMatches} />
        <LatestNews news={recentNews} />

                {/* --- Embedded YouTube Video Section --- */}
        {embedUrl && ( // Only render if we successfully got the embed URL
          <div className="relative w-full overflow-hidden rounded-lg shadow-lg mb-8 bg-black">
            {/* Embedded YouTube Video */}
            <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
              {/* Ensure iframe tag is correctly typed */}
              <iframe
                className="absolute top-0 left-0 w-full h-full rounded-lg"
                src={embedUrl}
                title={youtubeTitle}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              ></iframe>
            </div>

            {/* Overlay Content */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3 md:p-6 text-white">
              <div className="flex items-center text-red-500 mb-1">
                <Play className="w-4 h-4 mr-1.5" fill="currentColor" />
                <p className="text-xs font-medium">საქართველო ეფუტსალება</p>
              </div>
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-1 line-clamp-2">
                {youtubeTitle}
              </h3>
              <p className="text-xs sm:text-sm md:text-base text-white/80 line-clamp-2">
                {youtubeDescription}
              </p>
            </div>
          </div>
        )}
        {/* --- End YouTube Video Section --- */}
      </div>
    </div>
  )
}