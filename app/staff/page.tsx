"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Users, Mail, Phone, Loader2 } from "lucide-react"
import EditableText from "@/components/editable-text"
import { getAllStaff } from "@/lib/content-manager" // Import the new function
import type { StaffMember } from "@/lib/types"     // Import the new type

export default function StaffPage() {
  // 1. Add state for loading and staff members
  const [staffMembers, setStaffMembers] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 2. Fetch data from Supabase when the component loads
  useEffect(() => {
    const loadStaff = async () => {
      setIsLoading(true)
      const data = await getAllStaff()
      setStaffMembers(data)
      setIsLoading(false)
    }
    loadStaff()
  }, [])

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
      {/* Page Header (remains the same) */}
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

      {/* Staff Grid - Now dynamic */}
      {isLoading ? (
        // 3. Show a loading spinner while data is being fetched
        <div className="flex justify-center items-center py-20">
          <Loader2 className="h-12 w-12 animate-spin text-red-500" />
        </div>
      ) : (
        // 4. Map over the live data from the database
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {staffMembers.map((member) => (
            <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img src={member.image || "/placeholder-user.jpg"} alt={member.name} className="w-full h-64 object-cover" />
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{member.name}</h3>
                  <p className="text-sm text-white/90">{member.position}</p>
                </div>
              </div>
              <CardContent className="p-6 space-y-3">
                {member.email && (
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-red-500" />
                    <a href={`mailto:${member.email}`} className="hover:text-red-500 transition-colors">
                      {member.email}
                    </a>
                  </div>
                )}
                {/* <div className="flex items-center text-sm">
                  <Phone className="h-4 w-4 mr-2 text-red-500" />
                </div> */}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}