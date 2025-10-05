import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Ticket } from "lucide-react"
import type { MatchFixture } from "@/lib/types"
import EditableText from "@/components/editable-text"

interface UpcomingMatchesProps {
  matches: MatchFixture[]
}

export default function UpcomingMatches({ matches }: UpcomingMatchesProps) {
  if (!matches.length) return null

  return (
    <section className="mb-8">
      <h2 className="text-2xl font-bold mb-6 flex items-center">
        <Calendar className="mr-3 h-6 w-6 text-red-500" />
        <EditableText
          contentKey="upcoming_matches_title"
          defaultValue="მომავალი მატჩები"
          className="text-2xl font-bold"
        />
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {matches.map((match) => (
          <Card key={match.id} className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="p-5">
              <div className="flex justify-between items-start mb-4">
                <div className="bg-red-500 text-white p-3 rounded-lg text-center">
                  <div className="text-xl font-bold">{new Date(match.matchDate).getDate()}</div>
                  <div className="text-xs">
                    {new Date(match.matchDate).toLocaleDateString("ka-GE", { month: "short" }).toUpperCase()}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-base font-semibold">
                    {new Date(match.matchDate).toLocaleTimeString("ka-GE", { hour: "2-digit", minute: "2-digit" })}
                  </div>
                </div>
              </div>

              <div className="text-center mb-4">
                <div className="text-xs text-muted-foreground mb-2">{match.matchType}</div>
                <div className="flex items-center justify-center space-x-4">
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mb-2"></div>
                    <div className="font-medium text-sm">{match.homeTeam}</div>
                  </div>
                  <div className="text-lg font-bold text-muted-foreground">VS</div>
                  <div className="text-center">
                    <div className="w-10 h-10 bg-gray-200 rounded-full mb-2"></div>
                    <div className="font-medium text-sm">{match.awayTeam}</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-center text-sm text-muted-foreground mb-4">
                <MapPin className="h-4 w-4 mr-1" />
                {match.venue}
              </div>

              <Button className="w-full bg-red-500 hover:bg-red-600" size="sm">
                <Ticket className="mr-2 h-4 w-4" />
                <EditableText
                  contentKey="buy_tickets_text"
                  defaultValue="ბილეთების შეძენა"
                  className="text-sm font-medium text-white"
                />
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
