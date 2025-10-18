"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Calendar, Users, Star } from "lucide-react"
// import EditableText from "@/components/ui/editable-text" // REMOVED

interface StatsSectionProps {
  sectionKey: string
  title?: string
  stats?: Array<{
    icon: any
    numberKey?: string
    labelKey?: string
    defaultNumber: string
    defaultLabel: string
  }>
}

export default function StatsSection({ sectionKey, title, stats }: StatsSectionProps) {
  const defaultStats = [
    { icon: Trophy, defaultNumber: "ჩემპიონი", defaultLabel: "ტიტული" },
    { icon: Calendar, defaultNumber: "თასი", defaultLabel: "მიღწევა" },
    { icon: Users, defaultNumber: "ვიცე-ჩემპიონი", defaultLabel: "პოზიცია" },
    { icon: Star, defaultNumber: "30", defaultLabel: "მოთამაშე" },
  ]

  const statsToRender = stats || defaultStats

  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          {/* REPLACED EditableText */}
          <h2 className="text-3xl font-bold mb-2">{title}</h2>
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {statsToRender.map((stat, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow border-0 shadow-md">
            <CardContent className="flex items-center p-6">
              <div className="bg-red-500 text-white p-3 rounded-lg mr-4 flex-shrink-0">
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="min-w-0 flex-1">
                {/* REPLACED EditableText */}
                <h3 className="text-lg font-bold break-words">{stat.defaultNumber}</h3>
                {/* REPLACED EditableText */}
                <p className="text-sm text-muted-foreground">{stat.defaultLabel}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
