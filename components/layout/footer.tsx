import { Button } from "@/components/ui/button"
import { Settings, HelpCircle, Facebook, Twitter, Instagram } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-muted/30 border-t mt-12">
      <div className="container py-6">
        {/* Sponsors Section */}
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3 text-center text-muted-foreground">ჩვენი სპონსორები</h4>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 items-center justify-items-center">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white p-2 rounded border shadow-sm hover:shadow-md transition-shadow">
                <img
                  src={`/placeholder.svg?height=40&width=80`}
                  alt={`Sponsor ${i}`}
                  className="h-8 w-auto opacity-70"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/lelo-logo-round-BQqGHxKzVvXjQqGzVvXjQqGzVvXj.png-kpK6e6CFxpZ4lZRbVHKiM4oRFSiHVe.png"
              alt="LELO"
              className="w-6 h-6 rounded-full object-cover"
            />
            <span className="text-sm text-muted-foreground">LELO Rugby Club</span>
            <span className="bg-red-500 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium">
              LC
            </span>
            <span className="bg-background border px-2 py-0.5 rounded-full text-xs text-muted-foreground">v1.0</span>
          </div>

          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Facebook className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Twitter className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Instagram className="h-4 w-4" />
            </Button>
            <div className="w-px h-4 bg-border mx-2" />
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <Settings className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <HelpCircle className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </footer>
  )
}
