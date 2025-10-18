"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Users, Star, Newspaper, User, Eye, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import StatsSection from "@/components/stats-section"
// FIX: Removed the import for EditableText

const leagueTabs = [
  { id: "premier", label: "უმაღლესი ლიგა", description: "საქართველოს რაგბის უმაღლესი ლიგა - ელიტური დივიზია" },
  { id: "espuarta", label: "ესპუართა", description: "ესპუართა ლიგის ჩემპიონატი და ტურნირები" },
]

export default function MensLeaguePage() {
  const [activeTab, setActiveTab] = useState("premier")
  const [expandedArticles, setExpandedArticles] = useState<{ [key: string]: boolean }>({})

  const toggleArticle = (articleId: string) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }))
  }

  const renderPremierLeague = () => (
    <div className="space-y-8">
      <StatsSection
        sectionKey="premier_league"
        title="უმაღლესი ლიგა"
        stats={[
          {
            icon: Trophy,
            numberKey: "premier_stat_1_number",
            labelKey: "premier_stat_1_label",
            defaultNumber: "საქართველოს ჩემპიონი",
            defaultLabel: "ტიტული",
          },
          {
            icon: Calendar,
            numberKey: "premier_stat_2_number",
            labelKey: "premier_stat_2_label",
            defaultNumber: "საქართველოს თასი",
            defaultLabel: "მიღწევა",
          },
          {
            icon: Users,
            numberKey: "premier_stat_3_number",
            labelKey: "premier_stat_3_label",
            defaultNumber: "საქართველოს ვიცე-ჩემპიონი",
            defaultLabel: "პოზიცია",
          },
          {
            icon: Star,
            numberKey: "premier_stat_4_number",
            labelKey: "premier_stat_4_label",
            defaultNumber: "30",
            defaultLabel: "მოთამაშე",
          },
        ]}
      />

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-red-500" />
            {/* FIX: Replaced EditableText with a span */}
            <span className="text-xl font-semibold">უმაღლესი ლიგის სიახლეები</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-4">
            <div className="border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="lg:w-48 lg:flex-shrink-0">
                  <img
                    src="/images/stats-background.png"
                    alt="უმაღლესი ლიგის სიახლეები"
                    className="w-full h-30 object-cover rounded"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <Badge variant="secondary" className="mb-2">
                    უმაღლესი ლიგა
                  </Badge>
                  {/* FIX: Replaced EditableText with h3 */}
                  <h3 className="font-semibold mb-2 break-words">ჩემპიონატის ბრძოლა მწვავდება</h3>
                  {/* FIX: Replaced EditableText with p */}
                  <p className="text-sm text-muted-foreground mb-3 break-words">
                    უმაღლესი ლიგის წამყვან გუნდებს შორის მხოლოდ 3 ქულა არის განსხვავება...
                  </p>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {/* FIX: Replaced EditableText with span */}
                        <span className="text-xs">სპორტული რეპორტიორი</span>
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {/* FIX: Replaced EditableText with span */}
                        <span className="text-xs">1250</span>
                      </span>
                    </div>
                    <Button variant="outline" size="sm">
                      ვრცლად <ArrowRight className="ml-1 h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderEspuarta = () => (
    <div className="space-y-8">
      <StatsSection
        sectionKey="espuarta_league"
        title="ესპუართა ლიგა"
        stats={[
            { icon: Trophy, defaultNumber: "ჩემპიონი", defaultLabel: "ტიტული" },
            { icon: Users, defaultNumber: "38:20", defaultLabel: "ფინალის ანგარიში" },
            { icon: Calendar, defaultNumber: "3 მაისი", defaultLabel: "ფინალის თარიღი" },
            { icon: Star, defaultNumber: "ავჭალა", defaultLabel: "ფინალის ადგილი" },
        ]}
      />

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-red-500" />
            {/* FIX: Replaced EditableText with span */}
            <span className="text-xl font-semibold">ესპუართა ლიგის სიახლეები</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
            <div className="p-4">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <div className="lg:col-span-2 min-w-0">
                  <Badge variant="secondary" className="mb-3">
                    ესპუართა ლიგა
                  </Badge>
                  {/* FIX: Replaced EditableText with h3 */}
                  <h3 className="text-xl font-bold mb-4 break-words">ლელო ესპუართა ლიგის ჩემპიონია</h3>
                  <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                    {/* FIX: Replaced EditableText with p */}
                    <p className="break-words text-sm text-muted-foreground">
                      3 მაისს, ავჭალის სარაგბო სტადიონზე ესპუართა ლიგის ფინალური შეხვედრა 'ბათუმთან' გვქონდა სადაც მეტოქე ანგარიშით 38:20 დავამარცხეთ და ესპუართა ლიგის ჩემპიონობა მინიმუმ ერთი წლით გავიხანგრძლივეთ.
                    </p>
                    {expandedArticles["espuarta-1"] && (
                      // FIX: Replaced EditableText with p
                      <p className="break-words text-sm text-muted-foreground">
                        ესპუართა ლიგის ფინალში უფროსებთან ერთად მონაწილეობა მიიღეს ახალგაზრდა მორაგბეებმაც რომლებიც მომავალი წლიდან კაცთა ლიგაში იასპარეზებენ.
                      </p>
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        {/* FIX: Replaced EditableText with span */}
                        <span className="text-xs">კლუბის ადმინისტრაცია</span>
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {/* FIX: Replaced EditableText with span */}
                        <span className="text-xs">1340</span>
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toggleArticle("espuarta-1")}>
                      {expandedArticles["espuarta-1"] ? (
                        <> შეკუმშვა <ChevronUp className="ml-1 h-3 w-3" /> </>
                      ) : (
                        <> ვრცლად <ChevronDown className="ml-1 h-3 w-3" /> </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a7818084-195b-47f1-b81d-988d070f9d7d.jpg-2XJwiAEI3Ai6oRta4QmmPa1LY1SYjU.jpeg" alt="ესპუართა ლიგის ჩემპიონები - გუნდური ფოტო" className="w-full h-48 object-cover rounded-lg" />
                  <img src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2244cb64-2a8e-4bfe-8448-442bbf6cde86.jpg-dofr3r9DWGOyiapOa3NbaXd4Z2Utwj.jpeg" alt="ესპუართა ლიგის მატჩის მომენტი" className="w-full h-48 object-cover rounded-lg" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderContent = () => {
    switch (activeTab) {
      case "premier": return renderPremierLeague()
      case "espuarta": return renderEspuarta()
      default: return renderPremierLeague()
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <div className="bg-red-50 dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="container">
          <div className="flex justify-end items-center h-12 gap-2 py-2">
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {leagueTabs.map((tab) => (
                <Button
                  key={tab.id}
                  variant={activeTab === tab.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveTab(tab.id)}
                  className={`text-xs whitespace-nowrap flex-shrink-0 ${
                    activeTab === tab.id
                      ? "bg-red-500 hover:bg-red-600 text-white"
                      : "text-red-600 hover:text-red-700 hover:bg-red-100 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-slate-700"
                  }`}
                >
                  {tab.label}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container py-8 px-4">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 text-white p-3 rounded-lg mr-4 flex-shrink-0">
              <Users className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              {/* FIX: Replaced EditableText with h1 */}
              <h1 className="text-4xl font-bold mb-1 break-words">კაცთა ლიგა</h1>
              {/* FIX: Replaced EditableText with p */}
              <p className="text-muted-foreground text-lg break-words">ლელოს კაცთა გუნდის ყველა აქტივობა</p>
            </div>
          </div>
          <nav className="text-sm text-muted-foreground">
            <span>მთავარი</span> / <span className="text-foreground">კაცთა ლიგა</span>
          </nav>
        </div>

        {renderContent()}
      </div>
    </div>
  )
}