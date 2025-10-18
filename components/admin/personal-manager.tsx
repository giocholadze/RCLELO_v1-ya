"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Pencil, Trash2, Plus, Loader2 } from "lucide-react"
// 1. Import your reusable FormField component
import FormField from "@/components/ui/form-field"

// Define the type for a single staff member
interface StaffMember {
  id: number
  name: string
  position?: string | null
  email?: string | null
  image_url?: string | null
}

export default function PersonalManager() {
  const [staff, setStaff] = useState<StaffMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingStaff, setEditingStaff] = useState<StaffMember | null>(null)
  const [formData, setFormData] = useState({ name: "", position: "", email: "", image_url: "" })
  
  const fetchStaff = async () => {
    setIsLoading(true)
    const { data, error } = await supabase.from("staff").select("*").order("name", { ascending: true })
    if (error) {
      console.error("Error fetching staff:", error)
    } else {
      setStaff(data || [])
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

    if (editingStaff) {
      const { error } = await supabase.from("staff").update(dataToSave).eq("id", editingStaff.id)
      if (error) console.error("Error updating staff:", error)
    } else {
      const { error } = await supabase.from("staff").insert(dataToSave)
      if (error) console.error("Error creating staff:", error)
    }

    await fetchStaff()
    setIsDialogOpen(false)
    setEditingStaff(null)
  }

  const handleDelete = async (id: number) => {
    if (confirm("Are you sure you want to delete this staff member?")) {
      const { error } = await supabase.from("staff").delete().eq("id", id)
      if (error) console.error("Error deleting staff:", error)
      await fetchStaff()
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
            <div className="flex justify-center items-center p-8"><Loader2 className="h-8 w-8 animate-spin" /></div>
        ) : (
            <div className="space-y-2">
            {staff.map((person) => (
                <div key={person.id} className="flex items-center justify-between border rounded-lg p-3">
                  <img src={person.image_url || '/placeholder-user.jpg'} alt={person.name} className="w-16 h-16 object-cover rounded-full mr-4"/>
                  <div className="flex-1">
                      <p className="font-semibold text-lg">{person.name}</p>
                      {person.position && <p className="text-sm text-muted-foreground">{person.position}</p>}
                      {person.email && <p className="text-xs text-muted-foreground">{person.email}</p>}
                  </div>
                  <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openModal(person)}><Pencil className="h-4 w-4" /></Button>
                      <Button variant="destructive" size="sm" onClick={() => handleDelete(person.id)}><Trash2 className="h-4 w-4" /></Button>
                  </div>
                </div>
            ))}
            </div>
        )}
      </CardContent>
      
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
                <Input id="position" value={formData.position} onChange={(e) => setFormData({...formData, position: e.target.value })} />
            </div>
            <div>
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" type="email" value={formData.email} onChange={(e) => setFormData({...formData, email: e.target.value })} />
            </div>
            
            {/* 2. UPDATE: Replace the placeholder with your actual reusable image uploader */}
            <FormField
                type="image"
                label="Staff Photo (Optional)"
                value={formData.image_url}
                onChange={(newUrl) => setFormData({ ...formData, image_url: newUrl })}
                category="staff-images" // This MUST match the bucket name you created in Supabase
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