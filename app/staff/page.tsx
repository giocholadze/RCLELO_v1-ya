import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, Mail, Phone } from "lucide-react"

const staffMembers = [
  {
    id: 1,
    name: "ვასილ (ბათუ) კევლიშვილი",
    position: "პრეზიდენტი და თანადამფუძნებელი",
    department: "ხელმძღვანელობა",
    image: "/placeholder.svg?height=200&width=200",
    email: "president@lelo.ge",
    phone: "+995 555 123 456",
    experience: "20+ წელი",
  },
  {
    id: 2,
    name: "მთავარი მწვრთნელი",
    position: "მთავარი მწვრთნელი",
    department: "მწვრთნელობა",
    image: "/placeholder.svg?height=200&width=200",
    email: "coach@lelo.ge",
    phone: "+995 555 123 457",
    experience: "15+ წელი",
  },
  {
    id: 3,
    name: "ახალგაზრდული გუნდის მწვრთნელი",
    position: "ახალგაზრდული გუნდის მწვრთნელი",
    department: "აკადემია",
    image: "/placeholder.svg?height=200&width=200",
    email: "youth@lelo.ge",
    phone: "+995 555 123 458",
    experience: "10+ წელი",
  },
  {
    id: 4,
    name: "ფიზიკური მომზადების მწვრთნელი",
    position: "ფიზიკური მომზადების მწვრთნელი",
    department: "მწვრთნელობა",
    image: "/placeholder.svg?height=200&width=200",
    email: "fitness@lelo.ge",
    phone: "+995 555 123 459",
    experience: "8+ წელი",
  },
  {
    id: 5,
    name: "მედიცინის ექიმი",
    position: "მედიცინის ექიმი",
    department: "მედიცინა",
    image: "/placeholder.svg?height=200&width=200",
    email: "doctor@lelo.ge",
    phone: "+995 555 123 460",
    experience: "12+ წელი",
  },
  {
    id: 6,
    name: "ადმინისტრაციული მენეჯერი",
    position: "ადმინისტრაციული მენეჯერი",
    department: "ადმინისტრაცია",
    image: "/placeholder.svg?height=200&width=200",
    email: "admin@lelo.ge",
    phone: "+995 555 123 461",
    experience: "5+ წელი",
  },
]

const departments = ["ყველა", "ხელმძღვანელობა", "მწვრთნელობა", "აკადემია", "მედიცინა", "ადმინისტრაცია"]

export default function StaffPage() {
  return (
    <div className="container py-8">
      {/* Page Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="bg-red-500 text-white p-3 rounded-lg mr-4">
            <Users className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-4xl font-bold mb-1">Staff</h1>
            <p className="text-muted-foreground text-lg">Meet our dedicated team of professionals</p>
          </div>
        </div>
        <nav className="text-sm text-muted-foreground">
          <span>Home</span> / <span className="text-foreground">Staff</span>
        </nav>
      </div>

      {/* Department Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {departments.map((dept) => (
            <Badge key={dept} variant="outline" className="cursor-pointer hover:bg-red-50">
              {dept}
            </Badge>
          ))}
        </div>
      </div>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {staffMembers.map((member) => (
          <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img src={member.image || "/placeholder.svg"} alt={member.name} className="w-full h-64 object-cover" />
              <div className="absolute top-4 right-4">
                <Badge className="bg-red-500">{member.department}</Badge>
              </div>
            </div>
            <CardContent className="p-6">
              <h3 className="font-bold text-lg mb-1">{member.name}</h3>
              <p className="text-red-500 font-medium mb-2">{member.position}</p>
              <p className="text-sm text-muted-foreground mb-4">გამოცდილება: {member.experience}</p>

              <div className="space-y-2">
                <div className="flex items-center text-sm text-muted-foreground">
                  <Mail className="h-4 w-4 mr-2" />
                  {member.email}
                </div>
                <div className="flex items-center text-sm text-muted-foreground">
                  <Phone className="h-4 w-4 mr-2" />
                  {member.phone}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Team Stats */}
      <div className="mt-12 grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="text-center p-6">
          <CardContent className="p-0">
            <div className="bg-red-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="text-2xl font-bold">25+</h4>
            <p className="text-sm text-muted-foreground">სტაფის წევრი</p>
          </CardContent>
        </Card>

        <Card className="text-center p-6">
          <CardContent className="p-0">
            <div className="bg-red-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="text-2xl font-bold">8</h4>
            <p className="text-sm text-muted-foreground">მწვრთნელი</p>
          </CardContent>
        </Card>

        <Card className="text-center p-6">
          <CardContent className="p-0">
            <div className="bg-red-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="text-2xl font-bold">15+</h4>
            <p className="text-sm text-muted-foreground">წლიანი გამოცდილება</p>
          </CardContent>
        </Card>

        <Card className="text-center p-6">
          <CardContent className="p-0">
            <div className="bg-red-500 text-white w-12 h-12 rounded-lg flex items-center justify-center mx-auto mb-3">
              <Users className="h-6 w-6" />
            </div>
            <h4 className="text-2xl font-bold">5</h4>
            <p className="text-sm text-muted-foreground">დეპარტამენტი</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
