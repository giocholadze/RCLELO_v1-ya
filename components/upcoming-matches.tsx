import { Card, CardContent } from "@/components/ui/card"
import { Calendar, MapPin } from "lucide-react"
import type { MatchFixture } from "@/lib/types"

interface UpcomingMatchesProps {
  matches: MatchFixture[]
}

export default function UpcomingMatches({ matches }: UpcomingMatchesProps) {
  if (!matches.length) return null

  return (
    <section className="mb-8 w-full">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Calendar className="mr-3 h-6 w-6 text-red-500" />
        <span className="text-2xl font-bold">მომავალი მატჩები</span>
      </h2>
      {/* THIS IS THE FIX: Changed grid-cols-2 to lg:grid-cols-3 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-6">
                <div className="bg-red-500 text-white p-4 rounded-lg text-center min-w-[70px]">
                  <div className="text-2xl font-bold">{new Date(match.matchDate).getDate()}</div>
                  <div className="text-sm">
                    {new Date(match.matchDate).toLocaleDateString("ka-GE", { month: "short" }).toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-semibold">
                    {new Date(match.matchDate).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>
              <div className="text-center mb-6">
                <div className="text-base font-semibold text-muted-foreground mb-4">{match.matchType}</div>
                <div className="flex items-center justify-center space-x-6">
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 mx-auto"></div>
                    <div className="font-semibold text-base">{match.homeTeam}</div>
                  </div>
                  <div className="text-2xl font-bold text-muted-foreground">VS</div>
                  <div className="text-center flex-1">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-3 mx-auto"></div>
                    <div className="font-semibold text-base">{match.awayTeam}</div>
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-center text-base text-muted-foreground">
                <MapPin className="h-5 w-5 mr-2" />
                {match.venue}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}