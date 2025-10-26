"use client" // Add this line

import { Play } from "lucide-react"

interface YoutubeVideoSectionProps {
  videoUrl: string; // YouTube video URL
  title: string;    // Title for the video section
  description: string; // Description below the title
}

export default function YoutubeVideoSection({ videoUrl, title, description }: YoutubeVideoSectionProps) {
  // Extract video ID from the YouTube URL
  // Added a check to ensure videoUrl exists before matching
  const videoIdMatch = videoUrl ? videoUrl.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=)|youtu\.be\/)([\w-]{11})(?:\S+)?/) : null;
  const videoId = videoIdMatch ? videoIdMatch[1] : null;

  if (!videoId) {
    console.error("Could not extract YouTube video ID from URL:", videoUrl); // Log error
    return null; // Don't render if video ID can't be extracted
  }

  // Construct embed URL
  const embedUrl = `https://www.youtube.com/embed/${videoId}?autoplay=0&controls=1&showinfo=0&rel=0`;

  return (
    <div className="relative w-full overflow-hidden rounded-lg shadow-lg mb-8 bg-black">
      {/* Embedded YouTube Video */}
      <div className="relative" style={{ paddingTop: '56.25%' }}> {/* 16:9 aspect ratio */}
        <iframe
          className="absolute top-0 left-0 w-full h-full rounded-lg"
          src={embedUrl}
          title={title}
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
          {title}
        </h3>
        <p className="text-xs sm:text-sm md:text-base text-white/80 line-clamp-2">
          {description}
        </p>
      </div>
    </div>
  )
}