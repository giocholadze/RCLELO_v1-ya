import Link from "next/link"
import { Facebook, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  const sponsors = [
    "/sponsors/sponsor1.png",
    "/sponsors/sponsor2.png",
    "/sponsors/sponsor3.png",
    "/sponsors/sponsor4.png",
    "/sponsors/sponsor5.png",
    "/sponsors/sponsor6.png",
  ]

  return (
    <footer className="bg-gray-900 dark:bg-gray-950 text-white border-t border-gray-800 dark:border-gray-700 py-4">
      <div className="max-w-5xl mx-auto px-4">
        {/* Main Content in Single Row */}
        <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
          {/* Contact Info */}
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-xs font-bold mb-1.5">კონტაქტი</h3>
            <div className="space-y-0.5 text-[10px] text-gray-400 dark:text-gray-500">
              <p>ორთაჭალა, თბილისი</p>
              <p>ტელ: +995 XXX XX XX XX</p>
              <p>ელ-ფოსტა: info@lelo.ge</p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="flex-1 min-w-[150px]">
            <h3 className="text-xs font-bold mb-1.5">სწრაფი ბმულები</h3>
            <div className="space-y-0.5 text-[10px]">
              <Link
                href="/mens-league"
                className="block text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                მამაკაცთა ლიგა
              </Link>
              <Link
                href="/youth-league"
                className="block text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                ახალგაზრდული ლიგა
              </Link>
              <Link href="/news" className="block text-gray-400 dark:text-gray-500 hover:text-white transition-colors">
                სიახლეები
              </Link>
              <Link
                href="/gallery"
                className="block text-gray-400 dark:text-gray-500 hover:text-white transition-colors"
              >
                გალერეა
              </Link>
            </div>
          </div>

          {/* Social Media */}
          <div className="flex-1 min-w-[100px]">
            <h3 className="text-xs font-bold mb-1.5">სოციალური ქსელები</h3>
            <div className="flex gap-2">
              <a
                href="https://www.facebook.com/share/17Y1WGmHcY/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center bg-gray-800 dark:bg-gray-900 hover:bg-red-600 dark:hover:bg-red-600 rounded transition-colors"
              >
                <Facebook className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.instagram.com/lelotbilisiofficial?igsh=cTlxdmJiYXpsZWIy"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center bg-gray-800 dark:bg-gray-900 hover:bg-red-600 dark:hover:bg-red-600 rounded transition-colors"
              >
                <Instagram className="w-3.5 h-3.5" />
              </a>
              <a
                href="https://www.youtube.com/channel/UCas07l9J9HxwiOLtZ4tbbCg"
                target="_blank"
                rel="noopener noreferrer"
                className="w-7 h-7 flex items-center justify-center bg-gray-800 dark:bg-gray-900 hover:bg-red-600 dark:hover:bg-red-600 rounded transition-colors"
              >
                <Youtube className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Sponsors Section */}
          <div className="flex-1 min-w-[200px]">
            <h3 className="text-xs font-bold mb-1.5 text-center">სპონსორები</h3>
            <div className="grid grid-cols-3 gap-2">
              {sponsors.slice(0, 3).map((src, i) => (
                <img
                  key={i}
                  src={src || "/placeholder.svg"}
                  alt={`სპონსორი ${i + 1}`}
                  className="w-16 h-16 object-contain rounded bg-gray-800 dark:bg-gray-900 p-1.5"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 dark:border-gray-700 pt-2 text-center text-[10px] text-gray-500 dark:text-gray-600">
          <p>&copy; {new Date().getFullYear()} LELO Rugby Club. ყველა უფლება დაცულია.</p>
        </div>
      </div>
    </footer>
  )
}
