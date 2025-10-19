import { Button } from "@/components/ui/button"
// 1. Import the Youtube icon
import { Settings, HelpCircle, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  // 2. Define the array of sponsor image paths
  const sponsors = [
    "/sponsors/sponsor1.png",
    "/sponsors/sponsor2.png",
    "/sponsors/sponsor3.png",
    "/sponsors/sponsor4.png",
    "/sponsors/sponsor5.png",
    "/sponsors/sponsor6.png", // Assuming you have a 6th sponsor image
  ]

  return (
    <footer className="bg-muted/30 border-t mt-12">
      <div className="container py-6">
        {/* Sponsors Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 text-center text-muted-foreground">ჩვენი სპონსორები</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 items-center justify-items-center">
            {/* 3. Map over the sponsors array to display the real images */}
            {sponsors.map((sponsorSrc, index) => (
              <div key={index} className="bg-white p-2 rounded border shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={sponsorSrc}
                  alt={`Sponsor ${index + 1}`}
                  className="h-8 w-auto opacity-80 grayscale hover:grayscale-0 transition-all duration-300"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <img
            src="/images/favicon.ico"
            alt="LELO"
            className="w-6 h-6 object-contain"
            />
            <span className="text-sm text-muted-foreground">LELO Rugby Club</span>
            <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
              LC
            </span>
            <span className="bg-background border px-2 py-0.5 rounded-full text-xs text-muted-foreground">v1.0</span>
          </div>

          <div className="flex items-center gap-2">
            {/* 4. Wrap buttons in <a> tags to make them links */}
            <a href="https://www.facebook.com/LeloSaracensTbilisi" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Facebook className="h-4 w-4" />
                </Button>
            </a>
            <a href="https://www.instagram.com/lelotbilisiofficial" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Instagram className="h-4 w-4" />
                </Button>
            </a>
            {/* 5. Add the YouTube button and link */}
            <a href="https://www.youtube.com/channel/UCas07l9J9HxwiOLtZ4tbbCg" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Youtube className="h-4 w-4" />
                </Button>
            </a>
            {/* 6. Removed the Settings and HelpCircle buttons */}
          </div>
        </div>
      </div>
    </footer>
  )
}