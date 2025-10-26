"use client" // FIX: Added "use client" directive

import { useState, useEffect } from "react" // Needed for Client Components with hooks
import { supabase } from "@/lib/supabase" // Or import getAllStaff if you prefer
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Loader2 } from "lucide-react" // Added Loader2

// Define the type for a single staff member (should match your lib/types.ts)
interface StaffMember {
  id: number
  name: string
  position?: string | null
  email?: string | null
  image_url?: string | null // Ensure this matches your DB column name
}

// --- START: Copy Sorting Logic ---
// Define the desired sort order for positions
const positionOrder: { [key: string]: number } = {
  "კლუბის პრეზიდენტი": 1, // Assuming "ბათუ კევლიშვილი" is the President
  "მთავარი მწვრთნელი": 2,
  "აუტის მწვრთნელი": 3,
  "ხაზის მწვრთნელები": 4,
  "ხაზის მწვრთნელი": 4,
  "ფიზ მომზადება": 5,
  "ფიზ. მომზადების მწვრთნელი": 5,
  "ფიზიო": 6,
  "ვიდეო ანალიტიკოსი": 7,
  // Add other positions from your data if needed
};

// Function to get the sort order value for a staff member
const getSortOrder = (person: StaffMember): number => {
    if (person.name === "ბათუ კევლიშვილი") {
        return 0; // Highest priority
    }
    const position = person.position?.trim();
    if (position && positionOrder[position] !== undefined) {
        return positionOrder[position];
    }
    return Infinity; // Put those without a defined position or null at the end
};
// --- END: Copy Sorting Logic ---


// The Page Component, now a Client Component
export default function StaffPage() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch and sort data inside useEffect for Client Components
  useEffect(() => {
    const fetchAndSortStaff = async () => {
        setIsLoading(true);
        const { data, error } = await supabase
            .from("staff")
            .select("*")
            .order("name", { ascending: true }); // Initial sort by name as secondary criterion

        if (error) {
            console.error("Error fetching staff for public page:", error);
            setStaff([]);
        } else if (data) {
            // Apply the custom sorting
            const sortedData = data.sort((a, b) => {
                const orderA = getSortOrder(a);
                const orderB = getSortOrder(b);
                if (orderA !== orderB) {
                    return orderA - orderB; // Sort by position order
                }
                return a.name.localeCompare(b.name); // Then by name
            });
            setStaff(sortedData);
        } else {
            setStaff([]);
        }
        setIsLoading(false);
    };

    fetchAndSortStaff();
  }, []); // Empty dependency array ensures this runs once on mount


  return (
    <div className="w-full max-w-6xl mx-auto px-4 py-8 md:py-12">
      <div className="mb-8 md:mb-12 text-center">
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4">
          <span className="text-red-500">პერსონალი</span>
        </h1>
        <p className="text-base sm:text-lg text-muted-foreground">გაიცანით ჩვენი გუნდი</p>
      </div>

      {isLoading ? (
          <div className="flex justify-center items-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-red-500" />
          </div>
      ) : staff.length === 0 ? (
          <div className="text-center py-12">
              <p className="text-muted-foreground">პერსონალის მონაცემები ვერ მოიძებნა.</p>
          </div>
      ) : (
          // Display the sorted staff using a grid layout
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {staff.map((person) => (
                  <Card key={person.id} className="overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
                      <div className="aspect-[4/5] w-full relative bg-gray-200 dark:bg-gray-700"> {/* Taller aspect ratio */}
                          <img
                              src={person.image_url || '/placeholder-user.jpg'}
                              alt={person.name}
                              className="absolute inset-0 w-full h-full object-cover" // object-cover looks better here
                              // onError IS NOW ALLOWED because this is a Client Component
                              onError={(e) => {
                                  // Type assertion needed because TS doesn't know it's an image element
                                  (e.target as HTMLImageElement).src = '/placeholder-user.jpg';
                              }}
                          />
                      </div>
                      <CardContent className="p-4 flex flex-col flex-grow justify-between">
                          <div>
                              <p className="font-semibold text-lg truncate mb-1">{person.name}</p>
                              {person.position && <p className="text-sm text-red-500 font-medium mb-2">{person.position}</p>}
                          </div>
                          {person.email && (
                              <a href={`mailto:${person.email}`} className="text-xs text-muted-foreground hover:text-primary flex items-center mt-2">
                                  <Mail className="w-3 h-3 mr-1.5" />
                                  {person.email}
                              </a>
                          )}
                      </CardContent>
                  </Card>
              ))}
          </div>
      )}
    </div>
  )
}