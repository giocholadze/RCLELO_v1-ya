"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Trophy, Users, Star, Newspaper, User, Eye, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import StatsSection from "@/components/stats-section"
import EditableText from "@/components/editable-text"

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
            <EditableText
              contentKey="premier_news_title"
              defaultValue="უმაღლესი ლიგის სიახლეები"
              className="text-xl font-semibold"
            />
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
                  <EditableText
                    contentKey="premier_news_headline"
                    defaultValue="ჩემპიონატის ბრძოლა მწვავდება"
                    as="h3"
                    className="font-semibold mb-2 break-words"
                  />
                  <EditableText
                    contentKey="premier_news_excerpt"
                    defaultValue="უმაღლესი ლიგის წამყვან გუნდებს შორის მხოლოდ 3 ქულა არის განსხვავება..."
                    type="textarea"
                    as="p"
                    className="text-sm text-muted-foreground mb-3 break-words"
                  />
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <EditableText
                          contentKey="premier_news_author"
                          defaultValue="სპორტული რეპორტიორი"
                          className="text-xs"
                        />
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        <EditableText
                          contentKey="premier_news_views"
                          defaultValue="1250"
                          type="number"
                          className="text-xs"
                        />
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
          {
            icon: Trophy,
            numberKey: "espuarta_stat_1_number",
            labelKey: "espuarta_stat_1_label",
            defaultNumber: "ჩემპიონი",
            defaultLabel: "ტიტული",
          },
          {
            icon: Users,
            numberKey: "espuarta_stat_2_number",
            labelKey: "espuarta_stat_2_label",
            defaultNumber: "38:20",
            defaultLabel: "ფინალის ანგარიში",
          },
          {
            icon: Calendar,
            numberKey: "espuarta_stat_3_number",
            labelKey: "espuarta_stat_3_label",
            defaultNumber: "3 მაისი",
            defaultLabel: "ფინალის თარიღი",
          },
          {
            icon: Star,
            numberKey: "espuarta_stat_4_number",
            labelKey: "espuarta_stat_4_label",
            defaultNumber: "ავჭალა",
            defaultLabel: "ფინალის ადგილი",
          },
        ]}
      />

      <Card className="border-0 shadow-md">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-red-500" />
            <EditableText
              contentKey="espuarta_news_title"
              defaultValue="ესპუართა ლიგის სიახლეები"
              className="text-xl font-semibold"
            />
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
                  <EditableText
                    contentKey="espuarta_news_headline"
                    defaultValue="ლელო ესპუართა ლიგის ჩემპიონია"
                    as="h3"
                    className="text-xl font-bold mb-4 break-words"
                  />
                  <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                    <EditableText
                      contentKey="espuarta_news_content_1"
                      defaultValue="3 მაისს, ავჭალის სარაგბო სტადიონზე ესპუართა ლიგის ფინალური შეხვედრა 'ბათუმთან' გვქონდა სადაც მეტოქე ანგარიშით 38:20 დავამარცხეთ და ესპუართა ლიგის ჩემპიონობა მინიმუმ ერთი წლით გავიხანგრძლივეთ."
                      type="textarea"
                      as="p"
                      className="break-words text-sm text-muted-foreground"
                    />

                    {expandedArticles["espuarta-1"] && (
                      <EditableText
                        contentKey="espuarta_news_content_2"
                        defaultValue="ესპუართა ლიგის ფინალში უფროსებთან ერთად მონაწილეობა მიიღეს ახალგაზრდა მორაგბეებმაც რომლებიც მომავალი წლიდან კაცთა ლიგაში იასპარეზებენ."
                        type="textarea"
                        as="p"
                        className="break-words text-sm text-muted-foreground"
                      />
                    )}
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mt-4">
                    <div className="flex items-center text-xs text-muted-foreground space-x-4">
                      <span className="flex items-center">
                        <User className="h-3 w-3 mr-1" />
                        <EditableText
                          contentKey="espuarta_news_author"
                          defaultValue="კლუბის ადმინისტრაცია"
                          className="text-xs"
                        />
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        <EditableText
                          contentKey="espuarta_news_views"
                          defaultValue="1340"
                          type="number"
                          className="text-xs"
                        />
                      </span>
                    </div>
                    <Button variant="outline" size="sm" onClick={() => toggleArticle("espuarta-1")}>
                      {expandedArticles["espuarta-1"] ? (
                        <>
                          შეკუმშვა <ChevronUp className="ml-1 h-3 w-3" />
                        </>
                      ) : (
                        <>
                          ვრცლად <ChevronDown className="ml-1 h-3 w-3" />
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div className="space-y-4">
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a7818084-195b-47f1-b81d-988d070f9d7d.jpg-2XJwiAEI3Ai6oRta4QmmPa1LY1SYjU.jpeg"
                    alt="ესპუართა ლიგის ჩემპიონები - გუნდური ფოტო"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <img
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/2244cb64-2a8e-4bfe-8448-442bbf6cde86.jpg-dofr3r9DWGOyiapOa3NbaXd4Z2Utwj.jpeg"
                    alt="ესპუართა ლიგის მატჩის მომენტი"
                    className="w-full h-48 object-cover rounded-lg"
                  />
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
      case "premier":
        return renderPremierLeague()
      case "espuarta":
        return renderEspuarta()
      default:
        return renderPremierLeague()
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Secondary Navigation */}
      <div className="bg-red-50 dark:bg-slate-800 border-b dark:border-slate-700">
        <div className="w-full max-w-[1200px] mx-auto px-4">
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

      <div className="w-full max-w-[1200px] mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 text-white p-3 rounded-lg mr-4 flex-shrink-0">
              <Users className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              <EditableText
                contentKey="mens_league_title"
                defaultValue="კაცთა ლიგა"
                as="h1"
                className="text-4xl font-bold mb-1 break-words"
              />
              <EditableText
                contentKey="mens_league_description"
                defaultValue="ლელოს კაცთა გუნდის ყველა აქტივობა"
                as="p"
                className="text-muted-foreground text-lg break-words"
              />
            </div>
          </div>
          <nav className="text-sm text-muted-foreground">
            <span>მთავარი</span> / <span className="text-foreground">კაცთა ლიგა</span>
          </nav>
        </div>

        {/* League Content */}
        {renderContent()}
      </div>
    </div>
  )
}
