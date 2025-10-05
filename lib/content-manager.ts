"use client"

import type { EditableContent, NewsItem, MatchFixture, Image, PlayerCard } from "./types"

// Content Management
const CONTENT_KEY = "lelo_content"
const NEWS_KEY = "lelo_news"
const MATCHES_KEY = "lelo_matches"
const IMAGES_KEY = "lelo_images"
const PLAYERS_KEY = "lelo_players"

export function getEditableContent(): EditableContent[] {
  if (typeof window === "undefined") return []
  const content = localStorage.getItem(CONTENT_KEY)
  return content ? JSON.parse(content) : getDefaultContent()
}

export function saveEditableContent(content: EditableContent[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(CONTENT_KEY, JSON.stringify(content))
}

export function updateContent(key: string, value: string): void {
  const content = getEditableContent()
  const index = content.findIndex((c) => c.key === key)

  if (index >= 0) {
    content[index].value = value
  } else {
    content.push({
      id: Date.now().toString(),
      key,
      value,
      type: "text",
      section: "general",
    })
  }

  saveEditableContent(content)
}

export function getContentValue(key: string, defaultValue = ""): string {
  const content = getEditableContent()
  const item = content.find((c) => c.key === key)
  return item?.value || defaultValue
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
export function getAllNewsFromStorage(): NewsItem[] {
  if (typeof window === "undefined") return []
  const news = localStorage.getItem(NEWS_KEY)
  return news ? JSON.parse(news) : []
}

export function saveNewsToStorage(news: NewsItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(NEWS_KEY, JSON.stringify(news))
}

export function createNews(newsItem: Omit<NewsItem, "id">): NewsItem {
  const news = getAllNewsFromStorage()
  const newItem: NewsItem = {
    ...newsItem,
    id: Date.now(),
  }
  news.unshift(newItem)
  saveNewsToStorage(news)
  return newItem
}

export function updateNews(id: number, updates: Partial<NewsItem>): NewsItem | null {
  const news = getAllNewsFromStorage()
  const index = news.findIndex((n) => n.id === id)

  if (index >= 0) {
    news[index] = { ...news[index], ...updates }
    saveNewsToStorage(news)
    return news[index]
  }

  return null
}

export function deleteNews(id: number): boolean {
  const news = getAllNewsFromStorage()
  const filteredNews = news.filter((n) => n.id !== id)

  if (filteredNews.length !== news.length) {
    saveNewsToStorage(filteredNews)
    return true
  }

  return false
}

// Matches CRUD
export function getAllMatchesFromStorage(): MatchFixture[] {
  if (typeof window === "undefined") return []
  const matches = localStorage.getItem(MATCHES_KEY)
  return matches ? JSON.parse(matches) : []
}

export function saveMatchesToStorage(matches: MatchFixture[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(MATCHES_KEY, JSON.stringify(matches))
}

export function createMatch(match: Omit<MatchFixture, "id">): MatchFixture {
  const matches = getAllMatchesFromStorage()
  const newMatch: MatchFixture = {
    ...match,
    id: Date.now(),
  }
  matches.push(newMatch)
  saveMatchesToStorage(matches)
  return newMatch
}

export function updateMatch(id: number, updates: Partial<MatchFixture>): MatchFixture | null {
  const matches = getAllMatchesFromStorage()
  const index = matches.findIndex((m) => m.id === id)

  if (index >= 0) {
    matches[index] = { ...matches[index], ...updates }
    saveMatchesToStorage(matches)
    return matches[index]
  }

  return null
}

export function deleteMatch(id: number): boolean {
  const matches = getAllMatchesFromStorage()
  const filteredMatches = matches.filter((m) => m.id !== id)

  if (filteredMatches.length !== matches.length) {
    saveMatchesToStorage(filteredMatches)
    return true
  }

  return false
}

// Images CRUD
export function getAllImagesFromStorage(): Image[] {
  if (typeof window === "undefined") return []
  const images = localStorage.getItem(IMAGES_KEY)
  return images ? JSON.parse(images) : []
}

export function saveImagesToStorage(images: Image[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(IMAGES_KEY, JSON.stringify(images))
}

export function createImage(image: Omit<Image, "id">): Image {
  const images = getAllImagesFromStorage()
  const newImage: Image = {
    ...image,
    id: Date.now(),
  }
  images.push(newImage)
  saveImagesToStorage(images)
  return newImage
}

export function updateImage(id: number, updates: Partial<Image>): Image | null {
  const images = getAllImagesFromStorage()
  const index = images.findIndex((i) => i.id === id)

  if (index >= 0) {
    images[index] = { ...images[index], ...updates }
    saveImagesToStorage(images)
    return images[index]
  }

  return null
}

export function deleteImage(id: number): boolean {
  const images = getAllImagesFromStorage()
  const filteredImages = images.filter((i) => i.id !== id)

  if (filteredImages.length !== images.length) {
    saveImagesToStorage(filteredImages)
    return true
  }

  return false
}

// Players CRUD
export function getAllPlayersFromStorage(): PlayerCard[] {
  if (typeof window === "undefined") return []
  const players = localStorage.getItem(PLAYERS_KEY)
  return players ? JSON.parse(players) : getDefaultPlayers()
}

export function savePlayersToStorage(players: PlayerCard[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(PLAYERS_KEY, JSON.stringify(players))
}

export function createPlayer(player: Omit<PlayerCard, "id">): PlayerCard {
  const players = getAllPlayersFromStorage()
  const newPlayer: PlayerCard = {
    ...player,
    id: Date.now(),
  }
  players.push(newPlayer)
  savePlayersToStorage(players)
  return newPlayer
}

export function updatePlayer(id: number, updates: Partial<PlayerCard>): PlayerCard | null {
  const players = getAllPlayersFromStorage()
  const index = players.findIndex((p) => p.id === id)

  if (index >= 0) {
    players[index] = { ...players[index], ...updates }
    savePlayersToStorage(players)
    return players[index]
  }

  return null
}

export function deletePlayer(id: number): boolean {
  const players = getAllPlayersFromStorage()
  const filteredPlayers = players.filter((p) => p.id !== id)

  if (filteredPlayers.length !== players.length) {
    savePlayersToStorage(filteredPlayers)
    return true
  }

  return false
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
