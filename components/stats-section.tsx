"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Trophy, Calendar, Users, Star } from "lucide-react"
import EditableText from "@/components/editable-text"

interface StatsSectionProps {
  sectionKey: string
  title?: string
  stats?: Array<{
    icon: any
    numberKey: string
    labelKey: string
    defaultNumber: string
    defaultLabel: string
  }>
}

export default function StatsSection({ sectionKey, title, stats }: StatsSectionProps) {
  const defaultStats = [
    {
      icon: Trophy,
      numberKey: `${sectionKey}_stat_1_number`,
      labelKey: `${sectionKey}_stat_1_label`,
      defaultNumber: "ჩემპიონი",
      defaultLabel: "ტიტული",
    },
    {
      icon: Calendar,
      numberKey: `${sectionKey}_stat_2_number`,
      labelKey: `${sectionKey}_stat_2_label`,
      defaultNumber: "თასი",
      defaultLabel: "მიღწევა",
    },
    {
      icon: Users,
      numberKey: `${sectionKey}_stat_3_number`,
      labelKey: `${sectionKey}_stat_3_label`,
      defaultNumber: "ვიცე-ჩემპიონი",
      defaultLabel: "პოზიცია",
    },
    {
      icon: Star,
      numberKey: `${sectionKey}_stat_4_number`,
      labelKey: `${sectionKey}_stat_4_label`,
      defaultNumber: "30",
      defaultLabel: "მოთამაშე",
    },
  ]

  const statsToRender = stats || defaultStats

  return (
    <div className="space-y-6">
      {title && (
        <div className="text-center">
          <EditableText
            contentKey={`${sectionKey}_title`}
            defaultValue={title}
            as="h2"
            className="text-3xl font-bold mb-2"
          />
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
                <EditableText
                  contentKey={stat.numberKey}
                  defaultValue={stat.defaultNumber}
                  as="h3"
                  className="text-lg font-bold break-words"
                />
                <EditableText
                  contentKey={stat.labelKey}
                  defaultValue={stat.defaultLabel}
                  as="p"
                  className="text-sm text-muted-foreground"
                />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
