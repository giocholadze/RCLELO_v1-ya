"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"
import FormField from "@/components/ui/form-field"

// Define the type for a single staff member
interface StaffMember {
  id: number
  name: string
  position?: string | null
  email?: string | null
  image_url?: string | null
}

// Define the desired sort order for prioritized positions
const positionOrder: { [key: string]: number } = {
  // Assign lower numbers to higher priority positions
  // Assuming "ბათუ კევლიშვილი" is handled by the name check below
  "კლუბის პრეზიდენტი": 1, // Keep president high, though Batu is handled separately
  "მთავარი მწვრთნელი": 2,
  "აუტის მწვრთნელი": 3,
  "ხაზის მწვრთნელები": 4, // Might need exact position title if it varies
  "ხაზის მწვრთნელი": 4,   // Added singular form just in case
  "ფიზ მომზადება": 5,
  "ფიზ. მომზადების მწვრთნელი": 5, // Added more specific title
  "ფიზიო": 6,
  "ვიდეო ანალიტიკოსი": 7,
  // *** Only include roles you want prioritized ABOVE others ***
  // Roles like 'Manager' are NOT listed here, so they get the default high number below
};

// Function to get the sort order value for a staff member
const getSortOrder = (person: StaffMember): number => {
    // Special case for "ბათუ კევლიშვილი" to always be first
    if (person.name === "ბათუ კევლიშვილი") {
        return 0;
    }
    const position = person.position?.trim(); // Trim whitespace
    if (position && positionOrder[position] !== undefined) {
        // Return the defined order for known prioritized positions
        return positionOrder[position];
    }
    // Return a high number for all other positions (managers, null, undefined etc.)
    // to place them after the prioritized roles
    return 999; // Using 999 instead of Infinity for simplicity
};


export default function PersonalManager() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [formData, setFormData] = useState({ name: "", position: "", email: "", image_url: "" })

  const fetchStaff = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("staff").select("*").order("name", { ascending: true }) // Keep secondary sort by name

    if (error) {
      console.error("Error fetching staff:", error)
      setStaff([])
    } else {
      // Sort the fetched data using the updated logic
      const sortedData = (data || []).sort((a, b) => {
          const orderA = getSortOrder(a);
          const orderB = getSortOrder(b);
          if (orderA !== orderB) {
              return orderA - orderB; // Sort by custom position order first
          }
          // If orders are the same (e.g., both are prioritized coaches, or both are 'other'), sort by name
          return a.name.localeCompare(b.name);
      });
      setStaff(sortedData)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStaff()
  }, [])

  const handleSave = async () => {
    if (!formData.name.trim()) {
      alert("Name is a required field.")
      return
    }

    const dataToSave = {
        name: formData.name,
        position: formData.position || null,
        email: formData.email || null,
        image_url: formData.image_url || null,
    }

    try {
        if (editingStaff) {
          const { error } = await supabase.from("staff").update(dataToSave).eq("id", editingStaff.id)
          if (error) throw error
        } else {
          const { error } = await supabase.from("staff").insert(dataToSave)
          if (error) throw error
        }
        await fetchStaff() // Re-fetch and re-sort
        setIsDialogOpen(false)
        setEditingStaff(null)
    } catch (error) {
        console.error("Error saving staff:", error)
        alert("Failed to save staff member. Check console for details.")
    }
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      const { error } = await supabase.from("staff").delete().eq("id", id)
      if (error) console.error("Error deleting staff:", error)
      await fetchStaff() // Re-fetch and re-sort
    }
  }

  const openModal = (staffMember: StaffMember | null) => {
    setEditingStaff(staffMember)
    setFormData({
        name: staffMember?.name || "",
        position: staffMember?.position || "",
        email: staffMember?.email || "",
        image_url: staffMember?.image_url || "",
    })
    setIsDialogOpen(true)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Staff / Personnel Manager</CardTitle>
          <Button onClick={() => openModal(null)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Staff Member
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin text-red-500" /></div>
        ) : (
             // Reverted to list layout (space-y-2)
            <div className="space-y-2">
            {/* Map over the now sorted staff array */}
            {staff.map((person) => (
              // FIX 1: Increased padding from p-3 to p-4 for more height
              <div key={person.id} className="flex items-center justify-between border rounded-lg p-4">
                 <img
                    src={person.image_url || '/placeholder-user.jpg'}
                    alt={person.name}
                    // Kept increased image size
                    className="w-24 h-24 object-cover rounded-full mr-4 flex-shrink-0"
                    onError={(e) => (e.currentTarget.src = '/placeholder-user.jpg')}
                 />
                 <div className="flex-1 min-w-0">
                     <p className="font-semibold text-lg truncate">{person.name}</p>
                     {person.position && <p className="text-sm text-muted-foreground truncate">{person.position}</p>}
                     {person.email && <p className="text-xs text-muted-foreground truncate">{person.email}</p>}
                 </div>
                 <div className="flex gap-2 ml-4">
                      {/* Reverted button styles */}
                     <Button variant="outline" size="sm" onClick={() => openModal(person)}><Pencil className="h-4 w-4" /></Button>
                     <Button variant="destructive" size="sm" onClick={() => handleDelete(person.id)}><Trash2 className="h-4 w-4" /></Button>
                 </div>
              </div>
            ))}
            </div>
        )}
         {staff.length === 0 && !isLoading && (
              <div className="text-center py-12">
                  <p className="text-muted-foreground">No staff members found.</p>
              </div>
          )}
      </CardContent>

      {/* Dialog remains the same */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingStaff ? "Edit Staff Member" : "Add New Staff Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div>
                <Label htmlFor="name">Name (Required)</Label>
                <Input id="name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value })} />
            </div>
             <div>
                <Label htmlFor="position">Position (Optional)</Label>
                <Input id="position" value={formData.position || ''} onChange={(e) => setFormData({...formData, position: e.target.value })} />
            </div>
            <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" type="email" value={formData.email || ''} onChange={(e) => setFormData({...formData, email: e.target.value })} />
            </div>

            <FormField
                type="image"
                label="Staff Photo (Optional)"
                value={formData.image_url || ''}
                onChange={(newUrl) => setFormData({ ...formData, image_url: newUrl })}
                category="staff-images"
                placeholder="Upload staff photo"
            />

            <Button onClick={handleSave} className="w-full">
                {editingStaff ? "Save Changes" : "Create Staff Member"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  )
}