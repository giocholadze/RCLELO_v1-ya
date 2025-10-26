import { Button } from "@/components/ui/button"
import { Settings, HelpCircle, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  const sponsors = [
    "/sponsors/sponsor1.png",
    "/sponsors/sponsor2.png",
    "/sponsors/sponsor3.png",
    "/sponsors/sponsor4.png",
  ]

  return (
    <footer className="bg-muted/30 border-t mt-12">
      <div className="container py-6">
        {/* Sponsors Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 text-center text-muted-foreground">ჩვენი სპონსორები</h4>
          {/* FIX 1: Adjusted grid columns to 2 on small screens, 3 on md, 4 on lg */}
          {/* FIX 2: Increased gap (gap-6) for more spacing */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 items-center justify-items-center">
            {sponsors.map((sponsorSrc, index) => (
              // FIX 3: Increased padding (p-4) inside the sponsor div
              // FIX 4: Set a fixed width and height (w-32 h-20) for the container, adjust as needed
              <div key={index} className="bg-white p-4 rounded border shadow-sm hover:shadow-md transition-shadow flex items-center justify-center w-32 h-20 sm:w-40 sm:h-24">
                <img
                  src={sponsorSrc}
                  alt={`Sponsor ${index + 1}`}
                  // FIX 5: Use object-contain to make sure images fit within the bigger div without cropping
                  // Removed fixed height/width here, let parent div control dimensions
                  className="max-h-full max-w-full object-contain opacity-80 grayscale hover:grayscale-0 transition-all duration-300"
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
            <a href="https://www.youtube.com/channel/UCas07l9J9HxwiOLtZ4tbbCg" target="_blank" rel="noopener noreferrer">
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Youtube className="h-4 w-4" />
                </Button>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}