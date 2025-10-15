import { supabase } from "./supabase"
import type { EditableContent, NewsItem, MatchFixture, Image, PlayerCard } from "./types"

// REMOVED "use client" - Now works on both server and client!

// Content Management
export async function getEditableContent(): Promise<EditableContent[]> {
  const { data, error } = await supabase.from("editable_content").select("*")

  if (error) {
    console.error("Error fetching content:", error)
    return getDefaultContent()
  }

  if (!data || data.length === 0) {
    return getDefaultContent()
  }

  return data.map((item) => ({
    id: item.id,
    key: item.key,
    value: item.value,
    type: item.type as "text" | "number" | "textarea",
    section: item.section,
  }))
}

export async function saveEditableContent(content: EditableContent[]): Promise<void> {
  for (const item of content) {
    await supabase.from("editable_content").upsert(
      {
        id: item.id,
        key: item.key,
        value: item.value,
        type: item.type,
        section: item.section,
      },
      { onConflict: "key" },
    )
  }
}

export async function updateContent(key: string, value: string): Promise<void> {
  const { error } = await supabase.from("editable_content").upsert(
    {
      id: Date.now().toString(),
      key,
      value,
      type: "text",
      section: "general",
    },
    { onConflict: "key" },
  )

  if (error) {
    console.error("Error updating content:", error)
  }
}

export async function getContentValue(key: string, defaultValue = ""): Promise<string> {
  const { data, error } = await supabase.from("editable_content").select("value").eq("key", key).single()

  if (error || !data) return defaultValue
  return data.value
}

function getDefaultContent(): EditableContent[] {
  return [
    {
      id: "1",
      key: "about_title",
      value: "ჩვენს შესახებ",
      type: "text",
      section: "about",
    },
    {
      id: "2",
      key: "about_description",
      value:
        'რაგბის კლუბი „ლელო", დაარსებული 1980 წელს თბილისში, წარმოადგენს ერთ-ერთ ყველაზე წარმატებულ და ტიტულოვან კლუბს ქართულ რაგბიში.',
      type: "textarea",
      section: "about",
    },
    {
      id: "3",
      key: "history_title",
      value: "ისტორია და მიღწევები",
      type: "text",
      section: "about",
    },
    {
      id: "4",
      key: "infrastructure_title",
      value: "ინფრასტრუქტურა და აკადემია",
      type: "text",
      section: "about",
    },
  ]
}

// News CRUD
export async function getAllNewsFromStorage(): Promise<NewsItem[]> {
  const { data, error } = await supabase.from("news").select("*").order("published_date", { ascending: false })

  if (error) {
    console.error("Error fetching news:", error)
    return []
  }

  return data.map((item) => ({
    id: item.id,
    title: item.title,
    excerpt: item.excerpt,
    content: item.content,
    author: item.author,
    category: item.category,
    publishedDate: item.published_date,
    viewCount: item.view_count,
    imageUrl: item.image_url,
    isArchived: item.is_archived,
  }))
}

export async function saveNewsToStorage(news: NewsItem[]): Promise<void> {
  // Not needed with database
}

export async function createNews(newsItem: Omit<NewsItem, "id">): Promise<NewsItem> {
  const { data, error } = await supabase
    .from("news")
    .insert({
      title: newsItem.title,
      excerpt: newsItem.excerpt,
      content: newsItem.content,
      author: newsItem.author,
      category: newsItem.category,
      published_date: newsItem.publishedDate,
      view_count: newsItem.viewCount || 0,
      image_url: newsItem.imageUrl,
      is_archived: newsItem.isArchived || false,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    category: data.category,
    publishedDate: data.published_date,
    viewCount: data.view_count,
    imageUrl: data.image_url,
    isArchived: data.is_archived,
  }
}

export async function updateNews(id: number, updates: Partial<NewsItem>): Promise<NewsItem | null> {
  const dbUpdates: any = {}
  if (updates.title !== undefined) dbUpdates.title = updates.title
  if (updates.excerpt !== undefined) dbUpdates.excerpt = updates.excerpt
  if (updates.content !== undefined) dbUpdates.content = updates.content
  if (updates.author !== undefined) dbUpdates.author = updates.author
  if (updates.category !== undefined) dbUpdates.category = updates.category
  if (updates.publishedDate !== undefined) dbUpdates.published_date = updates.publishedDate
  if (updates.viewCount !== undefined) dbUpdates.view_count = updates.viewCount
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl
  if (updates.isArchived !== undefined) dbUpdates.is_archived = updates.isArchived

  const { data, error } = await supabase.from("news").update(dbUpdates).eq("id", id).select().single()

  if (error || !data) return null

  return {
    id: data.id,
    title: data.title,
    excerpt: data.excerpt,
    content: data.content,
    author: data.author,
    category: data.category,
    publishedDate: data.published_date,
    viewCount: data.view_count,
    imageUrl: data.image_url,
    isArchived: data.is_archived,
  }
}

export async function deleteNews(id: number): Promise<boolean> {
  const { error } = await supabase.from("news").delete().eq("id", id)
  return !error
}

// Matches CRUD
export async function getAllMatchesFromStorage(): Promise<MatchFixture[]> {
  const { data, error } = await supabase.from("matches").select("*").order("match_date", { ascending: true })

  if (error) {
    console.error("Error fetching matches:", error)
    return []
  }

  return data.map((match) => ({
    id: match.id,
    homeTeam: match.home_team,
    awayTeam: match.away_team,
    matchDate: match.match_date,
    venue: match.venue,
    matchType: match.match_type,
    status: match.status,
  }))
}

export async function saveMatchesToStorage(matches: MatchFixture[]): Promise<void> {
  // Not needed with database
}

export async function createMatch(match: Omit<MatchFixture, "id">): Promise<MatchFixture> {
  const { data, error } = await supabase
    .from("matches")
    .insert({
      home_team: match.homeTeam,
      away_team: match.awayTeam,
      match_date: match.matchDate,
      venue: match.venue,
      match_type: match.matchType,
      status: match.status || "scheduled",
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    homeTeam: data.home_team,
    awayTeam: data.away_team,
    matchDate: data.match_date,
    venue: data.venue,
    matchType: data.match_type,
    status: data.status,
  }
}

export async function updateMatch(id: number, updates: Partial<MatchFixture>): Promise<MatchFixture | null> {
  const dbUpdates: any = {}
  if (updates.homeTeam !== undefined) dbUpdates.home_team = updates.homeTeam
  if (updates.awayTeam !== undefined) dbUpdates.away_team = updates.awayTeam
  if (updates.matchDate !== undefined) dbUpdates.match_date = updates.matchDate
  if (updates.venue !== undefined) dbUpdates.venue = updates.venue
  if (updates.matchType !== undefined) dbUpdates.match_type = updates.matchType
  if (updates.status !== undefined) dbUpdates.status = updates.status

  const { data, error } = await supabase.from("matches").update(dbUpdates).eq("id", id).select().single()

  if (error || !data) return null

  return {
    id: data.id,
    homeTeam: data.home_team,
    awayTeam: data.away_team,
    matchDate: data.match_date,
    venue: data.venue,
    matchType: data.match_type,
    status: data.status,
  }
}

export async function deleteMatch(id: number): Promise<boolean> {
  const { error } = await supabase.from("matches").delete().eq("id", id)
  return !error
}

// Images CRUD
export async function getAllImagesFromStorage(): Promise<Image[]> {
  const { data, error } = await supabase.from("images").select("*").order("uploaded_at", { ascending: false })

  if (error) {
    console.error("Error fetching images:", error)
    return []
  }

  return data.map((img) => ({
    id: img.id,
    url: img.url,
    alt: img.alt,
    category: img.category,
    uploadedAt: img.uploaded_at,
    uploadedBy: img.uploaded_by,
  }))
}

export async function saveImagesToStorage(images: Image[]): Promise<void> {
  // Not needed with database
}

export async function createImage(image: Omit<Image, "id">): Promise<Image> {
  const { data, error } = await supabase
    .from("images")
    .insert({
      url: image.url,
      alt: image.alt,
      category: image.category,
      uploaded_by: image.uploadedBy,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    url: data.url,
    alt: data.alt,
    category: data.category,
    uploadedAt: data.uploaded_at,
    uploadedBy: data.uploaded_by,
  }
}

export async function updateImage(id: number, updates: Partial<Image>): Promise<Image | null> {
  const { data, error } = await supabase.from("images").update(updates).eq("id", id).select().single()

  if (error || !data) return null

  return {
    id: data.id,
    url: data.url,
    alt: data.alt,
    category: data.category,
    uploadedAt: data.uploaded_at,
    uploadedBy: data.uploaded_by,
  }
}

export async function deleteImage(id: number): Promise<boolean> {
  const { error } = await supabase.from("images").delete().eq("id", id)
  return !error
}

// Players CRUD
export async function getAllPlayersFromStorage(): Promise<PlayerCard[]> {
  const { data, error } = await supabase.from("players").select("*").order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching players:", error)
    return getDefaultPlayers()
  }

  if (!data || data.length === 0) {
    return getDefaultPlayers()
  }

  return data.map((player) => ({
    id: player.id,
    name: player.name,
    position: player.position,
    age: player.age,
    height: player.height,
    weight: player.weight,
    nationality: player.nationality,
    imageUrl: player.image_url,
    biography: player.biography,
    stats: {
      matches: player.stats_matches,
      tries: player.stats_tries,
      points: player.stats_points,
      yellowCards: player.stats_yellow_cards,
      redCards: player.stats_red_cards,
    },
    isActive: player.is_active,
    category: player.category as "Men's Rugby" | "Women's Rugby" | "Youth Rugby" | "Coaches",
    sponsorName: player.sponsor_name,
    sponsorLogo: player.sponsor_logo,
    team: player.team as "mens" | "youth" | "womens" | "coaches",
  }))
}

export async function savePlayersToStorage(players: PlayerCard[]): Promise<void> {
  // Not needed with database
}

export async function createPlayer(player: Omit<PlayerCard, "id">): Promise<PlayerCard> {
  const { data, error } = await supabase
    .from("players")
    .insert({
      name: player.name,
      position: player.position,
      age: player.age,
      height: player.height,
      weight: player.weight,
      nationality: player.nationality,
      image_url: player.imageUrl,
      biography: player.biography,
      stats_matches: player.stats.matches,
      stats_tries: player.stats.tries,
      stats_points: player.stats.points,
      stats_yellow_cards: player.stats.yellowCards,
      stats_red_cards: player.stats.redCards,
      is_active: player.isActive,
      category: player.category,
      sponsor_name: player.sponsorName,
      sponsor_logo: player.sponsorLogo,
      team: player.team,
    })
    .select()
    .single()

  if (error) throw error

  return {
    id: data.id,
    name: data.name,
    position: data.position,
    age: data.age,
    height: data.height,
    weight: data.weight,
    nationality: data.nationality,
    imageUrl: data.image_url,
    biography: data.biography,
    stats: {
      matches: data.stats_matches,
      tries: data.stats_tries,
      points: data.stats_points,
      yellowCards: data.stats_yellow_cards,
      redCards: data.stats_red_cards,
    },
    isActive: data.is_active,
    category: data.category,
    sponsorName: data.sponsor_name,
    sponsorLogo: data.sponsor_logo,
    team: data.team,
  }
}

export async function updatePlayer(id: number, updates: Partial<PlayerCard>): Promise<PlayerCard | null> {
  const dbUpdates: any = {}
  if (updates.name !== undefined) dbUpdates.name = updates.name
  if (updates.position !== undefined) dbUpdates.position = updates.position
  if (updates.age !== undefined) dbUpdates.age = updates.age
  if (updates.height !== undefined) dbUpdates.height = updates.height
  if (updates.weight !== undefined) dbUpdates.weight = updates.weight
  if (updates.nationality !== undefined) dbUpdates.nationality = updates.nationality
  if (updates.imageUrl !== undefined) dbUpdates.image_url = updates.imageUrl
  if (updates.biography !== undefined) dbUpdates.biography = updates.biography
  if (updates.stats !== undefined) {
    dbUpdates.stats_matches = updates.stats.matches
    dbUpdates.stats_tries = updates.stats.tries
    dbUpdates.stats_points = updates.stats.points
    dbUpdates.stats_yellow_cards = updates.stats.yellowCards
    dbUpdates.stats_red_cards = updates.stats.redCards
  }
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
  if (updates.category !== undefined) dbUpdates.category = updates.category
  if (updates.sponsorName !== undefined) dbUpdates.sponsor_name = updates.sponsorName
  if (updates.sponsorLogo !== undefined) dbUpdates.sponsor_logo = updates.sponsorLogo
  if (updates.team !== undefined) dbUpdates.team = updates.team

  const { data, error } = await supabase.from("players").update(dbUpdates).eq("id", id).select().single()

  if (error || !data) return null

  return {
    id: data.id,
    name: data.name,
    position: data.position,
    age: data.age,
    height: data.height,
    weight: data.weight,
    nationality: data.nationality,
    imageUrl: data.image_url,
    biography: data.biography,
    stats: {
      matches: data.stats_matches,
      tries: data.stats_tries,
      points: data.stats_points,
      yellowCards: data.stats_yellow_cards,
      redCards: data.stats_red_cards,
    },
    isActive: data.is_active,
    category: data.category,
    sponsorName: data.sponsor_name,
    sponsorLogo: data.sponsor_logo,
    team: data.team,
  }
}

export async function deletePlayer(id: number): Promise<boolean> {
  const { error } = await supabase.from("players").delete().eq("id", id)
  return !error
}

function getDefaultPlayers(): PlayerCard[] {
  return [
    {
      id: 1,
      name: "ADAM POWELL",
      position: "Men's Defence Coach",
      age: 35,
      height: "180cm",
      weight: "85kg",
      nationality: "Georgian",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-w3G5RbmObBxpJgpVPYMQVroyeNpa7H.png",
      biography: "Experienced defence coach with over 10 years in professional rugby.",
      stats: { matches: 0, tries: 0, points: 0, yellowCards: 0, redCards: 0 },
      isActive: true,
      category: "Coaches",
      sponsorName: "Security Services",
      sponsorLogo: "/placeholder.svg?height=40&width=120",
      team: "coaches",
    },
    {
      id: 2,
      name: "AKINA GONDWE",
      position: "Prop",
      age: 24,
      height: "175cm",
      weight: "95kg",
      nationality: "Georgian",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-w3G5RbmObBxpJgpVPYMQVroyeNpa7H.png",
      biography: "Dynamic prop forward with excellent scrummaging technique.",
      stats: { matches: 45, tries: 8, points: 40, yellowCards: 3, redCards: 0 },
      isActive: true,
      category: "Women's Rugby",
      sponsorName: "SSA Racems",
      sponsorLogo: "/placeholder.svg?height=40&width=120",
      team: "womens",
    },
    {
      id: 3,
      name: "ALEC CLAREY",
      position: "Prop",
      age: 28,
      height: "185cm",
      weight: "110kg",
      nationality: "Georgian",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-w3G5RbmObBxpJgpVPYMQVroyeNpa7H.png",
      biography: "Powerful prop with strong lineout throwing skills.",
      stats: { matches: 67, tries: 12, points: 60, yellowCards: 5, redCards: 1 },
      isActive: true,
      category: "Men's Rugby",
      sponsorName: "Security Services",
      sponsorLogo: "/placeholder.svg?height=40&width=120",
      team: "mens",
    },
    {
      id: 4,
      name: "ALEX AUSTERBERRY",
      position: "Women's Director Of Rugby",
      age: 42,
      height: "178cm",
      weight: "80kg",
      nationality: "Georgian",
      imageUrl: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-w3G5RbmObBxpJgpVPYMQVroyeNpa7H.png",
      biography: "Visionary leader driving women's rugby development.",
      stats: { matches: 0, tries: 0, points: 0, yellowCards: 0, redCards: 0 },
      isActive: true,
      category: "Coaches",
      sponsorName: "Security Services",
      sponsorLogo: "/placeholder.svg?height=40&width=120",
      team: "coaches",
    },
  ]
}
