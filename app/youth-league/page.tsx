"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trophy, Users, Newspaper, User, Eye, ArrowRight, ChevronDown, ChevronUp } from "lucide-react"
import StatsSection from "@/components/stats-section"
import EditableText from "@/components/editable-text"

const leagueTabs = [
  { id: "youth-a", label: 'ლიგა "ა"', description: "18 წლამდე ასაკის ჭაბუკთა ელიტური ლიგა" },
  { id: "youth-b", label: 'ლიგა "ბ"', description: "16 წლამდე ასაკის ჭაბუკთა განვითარების ლიგა" },
  { id: "festival", label: "საფესტივალო", description: "სეზონური ფესტივალები და სპეციალური ღონისძიებები" },
]

export default function YouthLeaguePage() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("youth-a")
  const [expandedArticles, setExpandedArticles] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab && leagueTabs.some((t) => t.id === tab)) {
      setActiveTab(tab)
    }
  }, [searchParams])

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId)
    router.push(`/youth-league?tab=${tabId}`)
  }

  const toggleArticle = (articleId: string) => {
    setExpandedArticles((prev) => ({
      ...prev,
      [articleId]: !prev[articleId],
    }))
  }

  const renderYouthA = () => (
    <div className="space-y-8 w-full max-w-[1200px] mx-auto px-4">
      <StatsSection
        sectionKey="youth_a_league"
        title='ჭაბუკთა "ა" ლიგა'
        stats={[
          {
            icon: Trophy,
            numberKey: "youth_a_stat_1_number",
            labelKey: "youth_a_stat_1_label",
            defaultNumber: "მოგებული თასი",
            defaultLabel: "მიღწევა",
          },
          {
            icon: Users,
            numberKey: "youth_a_stat_2_number",
            labelKey: "youth_a_stat_2_label",
            defaultNumber: "24",
            defaultLabel: "აკადემიის მოთამაშეები",
          },
        ]}
      />

      {/* Youth A League News */}
      <Card className="border-0 shadow-md w-full">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Newspaper className="mr-2 h-5 w-5 text-red-500" />
            <EditableText
              contentKey="youth_a_news_title"
              defaultValue='ჭაბუკთა "ა" ლიგის სიახლეები'
              className="text-xl font-semibold"
            />
          </CardTitle>
        </CardHeader>
        <CardContent className="p-4">
          <div className="space-y-6">
            {/* First News Article */}
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Badge variant="secondary" className="mb-3">
                      ჭაბუკთა "ა" ლიგა
                    </Badge>
                    <EditableText
                      contentKey="youth_a_news_1_headline"
                      defaultValue='ჭაბუკთა "ა" ლიგა | "ლელომ" ტიტული უმძიმეს ბრძოლაში დაიცვა'
                      as="h3"
                      className="text-xl font-bold mb-4"
                    />

                    <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                      <EditableText
                        contentKey="youth_a_news_1_excerpt"
                        defaultValue="ბოლო 10 წლის მანძილზე უფროსი ასაკის ჭაბუკ მორაგბეთა პირველობის ტიტულის მფლობელს 'აია'-'ლელოს' რიგით მე-8 დაპირისპირება (მათ შორის ფინალში მეოთხედ) არკვევდა..."
                        type="textarea"
                        as="p"
                        className="text-sm text-muted-foreground"
                      />

                      {expandedArticles["youth-a-1"] && (
                        <>
                          <EditableText
                            contentKey="youth_a_news_1_content_1"
                            defaultValue="აღნიშნულ პერიოდში დიდ დიღმელები 6-ჯერ გახდნენ ჩემპიონები (ერთხელ ფინალში 'ხვამლს' მოუგეს), 'აიამ' კი ტიტულის მოპოვება 2-ჯერ მოახერხა."
                            type="textarea"
                            as="p"
                            className="text-sm text-muted-foreground"
                          />
                          <EditableText
                            contentKey="youth_a_news_1_content_2"
                            defaultValue="უკვე მრავალი წელია, რაც 'ლელო' საქართველოს ახალგაზრდული და ეროვნული ნაკრების მთავარ დონორს წარმოადგენს."
                            type="textarea"
                            as="p"
                            className="text-sm text-muted-foreground"
                          />
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-xs text-muted-foreground space-x-4">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <EditableText
                            contentKey="youth_a_news_1_author"
                            defaultValue="სპორტული რეპორტიორი"
                            className="text-xs"
                          />
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <EditableText
                            contentKey="youth_a_news_1_views"
                            defaultValue="1850"
                            type="number"
                            className="text-xs"
                          />
                        </span>
                      </div>
                      <Button variant="outline" size="sm" onClick={() => toggleArticle("youth-a-1")}>
                        {expandedArticles["youth-a-1"] ? (
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
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4bebcd1a-e285-44dd-9d18-e67be8b94575.jpg-lPuPFwmePbLuJFxxjut63NadgkFNnw.jpeg"
                      alt="ჭაბუკთა ა ლიგის ჩემპიონები"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/9effce02-587b-4035-8ef7-61fd1783116f.jpg-kpK6e6CFxpZ4lZRbVHKiM4oRFSiHVe.jpeg"
                      alt="ჭაბუკთა ა ლიგის ჩემპიონები"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Second News Article */}
            <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="p-6">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-2">
                    <Badge variant="secondary" className="mb-3">
                      ჭაბუკთა "ა" ლიგა
                    </Badge>
                    <EditableText
                      contentKey="youth_a_news_2_headline"
                      defaultValue='ლელო ჭაბუკთა "ა" ლიგის 7 კაცა ტურნირის გამარჯვებულია'
                      as="h3"
                      className="text-xl font-bold mb-4"
                    />
                    <div className="text-sm text-muted-foreground space-y-3 leading-relaxed">
                      <EditableText
                        contentKey="youth_a_news_2_content"
                        defaultValue='12 აპრილს ლოკომოტივის ბაზაზე გაიმართა ჭაბუკთა "ა" ლიგის 7 კაცა ტურნირი სადაც გამარჯვებული, საქართველოს ჩემპიონი ხორბალაძე-შანიძის გუნდმა გახდა.'
                        type="textarea"
                        as="p"
                        className="text-sm text-muted-foreground"
                      />
                    </div>
                    <div className="flex items-center justify-between mt-4">
                      <div className="flex items-center text-xs text-muted-foreground space-x-4">
                        <span className="flex items-center">
                          <User className="h-3 w-3 mr-1" />
                          <EditableText
                            contentKey="youth_a_news_2_author"
                            defaultValue="ტურნირის ორგანიზატორები"
                            className="text-xs"
                          />
                        </span>
                        <span className="flex items-center">
                          <Eye className="h-3 w-3 mr-1" />
                          <EditableText
                            contentKey="youth_a_news_2_views"
                            defaultValue="920"
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
                  <div>
                    <img
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1fd63848-f6b3-4c77-9efa-9cff3663dc6c.jpg-CqcaMUcbbEF3vXtVeUoF0xFPDleh0O.jpeg"
                      alt="7 კაცა ტურნირის გამარჯვებული გუნდი"
                      className="w-full h-64 object-cover rounded-lg"
                    />
                  </div>
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
      case "youth-a":
        return renderYouthA()
      case "youth-b":
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">ლიგა "ბ" - მალე დაემატება</p>
          </div>
        )
      case "festival":
        return (
          <div className="text-center py-12">
            <p className="text-muted-foreground">საფესტივალო - მალე დაემატება</p>
          </div>
        )
      default:
        return renderYouthA()
    }
  }

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
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
                  onClick={() => handleTabChange(tab.id)}
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

      <div className="w-full py-8">
        {/* Page Header */}
        <div className="mb-8 w-full max-w-[1200px] mx-auto px-4">
          <div className="flex items-center mb-4">
            <div className="bg-red-500 text-white p-3 rounded-lg mr-4 flex-shrink-0">
              <Users className="h-8 w-8" />
            </div>
            <div className="min-w-0">
              <EditableText
                contentKey="youth_league_title"
                defaultValue="ახალგაზრდული ლიგა"
                as="h1"
                className="text-4xl font-bold mb-1 break-words"
              />
              <EditableText
                contentKey="youth_league_description"
                defaultValue="მომავალი თაობის რაგბის ტალანტების განვითარება"
                as="p"
                className="text-muted-foreground text-lg break-words"
              />
            </div>
          </div>
          <nav className="text-sm text-muted-foreground">
            <span>მთავარი</span> / <span className="text-foreground">ახალგაზრდული ლიგა</span>
          </nav>
        </div>

        {/* League Content */}
        {renderContent()}
      </div>
    </div>
  )
}
