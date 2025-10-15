"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Users, Mail, Phone } from "lucide-react"
import EditableText from "@/components/editable-text"

const staffMembers = [
  {
    id: 1,
    name: "გიორგი მელიქიძე",
    position: "მთავარი მწვრთნელი",
    email: "g.melikidze@lelo.ge",
    phone: "+995 555 123 456",
    image: "/placeholder-user.jpg",
  },
  {
    id: 2,
    name: "ნიკა კვარაცხელია",
    position: "ასისტენტი მწვრთნელი",
    email: "n.kvaratskhelia@lelo.ge",
    phone: "+995 555 234 567",
    image: "/placeholder-user.jpg",
  },
  {
    id: 3,
    name: "დავით ჩხაიძე",
    position: "ფიზიკური მომზადების მწვრთნელი",
    email: "d.chkhaidze@lelo.ge",
    phone: "+995 555 345 678",
    image: "/placeholder-user.jpg",
  },
  {
    id: 4,
    name: "თამარ გელაშვილი",
    position: "კლუბის მენეჯერი",
    email: "t.gelashvili@lelo.ge",
    phone: "+995 555 456 789",
    image: "/placeholder-user.jpg",
  },
]

export default function StaffPage() {
  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-red-500 text-white p-3 rounded-lg mr-4 flex-shrink-0">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <EditableText
              contentKey="staff_page_title"
              defaultValue="გუნდის პერსონალი"
              as="h1"
              className="text-4xl font-bold mb-1"
            />
            <EditableText
              contentKey="staff_page_description"
              defaultValue="გაიცანით ჩვენი გუნდის წევრები და სპეციალისტები"
              as="p"
              className="text-muted-foreground text-lg"
            />
          </div>
        </div>
        <nav className="text-sm text-muted-foreground">
          <span>მთავარი</span> / <span className="text-foreground">პერსონალი</span>
        </nav>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-64 object-cover" />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-sm text-white/90">{member.position}</p>
              </div>
            </div>
            <CardContent className="p-6 space-y-3">
              <div className="flex items-center text-sm">
                <Mail className="h-4 w-4 mr-2 text-red-500" />
                <a href={`mailto:${member.email}`} className="hover:text-red-500 transition-colors">
                  {member.email}
                </a>
              </div>
              <div className="flex items-center text-sm">
                <Phone className="h-4 w-4 mr-2 text-red-500" />
                <a href={`tel:${member.phone}`} className="hover:text-red-500 transition-colors">
                  {member.phone}
                </a>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
