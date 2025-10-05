"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { useAuth } from "@/components/auth/auth-provider"
import NewsManager from "./news-manager"
import MatchManager from "./match-manager"
import ContentEditor from "./content-editor"
import ImageManager from "./image-manager"
import UserManager from "./user-manager"
import PlayerManager from "./player-manager"
import UpcomingMatchesManager from "./upcoming-matches-manager"

export default function AdminPanel() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-muted-foreground">წვდომა აკრძალულია. საჭიროა ადმინისტრატორის უფლებები.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold mb-8">ადმინისტრატორის პანელი</h1>

      <Tabs defaultValue="content" className="space-y-6">
        <TabsList className="grid w-full grid-cols-7">
          <TabsTrigger value="content">კონტენტი</TabsTrigger>
          <TabsTrigger value="news">სიახლეები</TabsTrigger>
          <TabsTrigger value="matches">მატჩები</TabsTrigger>
          <TabsTrigger value="upcoming">მომავალი მატჩები</TabsTrigger>
          <TabsTrigger value="players">მოთამაშეები</TabsTrigger>
          <TabsTrigger value="images">სურათები</TabsTrigger>
          <TabsTrigger value="users">მომხმარებლები</TabsTrigger>
        </TabsList>

        <TabsContent value="content">
          <ContentEditor />
        </TabsContent>

        <TabsContent value="news">
          <NewsManager />
        </TabsContent>

        <TabsContent value="matches">
          <MatchManager />
        </TabsContent>

        <TabsContent value="upcoming">
          <UpcomingMatchesManager />
        </TabsContent>

        <TabsContent value="players">
          <PlayerManager />
        </TabsContent>

        <TabsContent value="images">
          <ImageManager />
        </TabsContent>

        <TabsContent value="users">
          <UserManager />
        </TabsContent>
      </Tabs>
    </div>
  )
}
