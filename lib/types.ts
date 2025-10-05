export interface NewsItem {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  category: string
  publishedDate: string
  viewCount: number
  imageUrl?: string
  isArchived?: boolean
}

export interface MatchFixture {
  id: number
  homeTeam: string
  awayTeam: string
  matchDate: string
  venue: string
  matchType: string
  status?: string
}

export interface User {
  id: number
  email: string
  password: string
  role: "admin" | "user"
  name: string
  createdAt: string
}

export interface PlayerCard {
  id: number
  name: string
  position: string
  age: number
  height: string
  weight: string
  nationality: string
  imageUrl?: string
  biography: string
  stats: {
    matches: number
    tries: number
    points: number
    yellowCards: number
    redCards: number
  }
  isActive: boolean
  category: "Men's Rugby" | "Women's Rugby" | "Youth Rugby" | "Coaches"
  sponsorName?: string
  sponsorLogo?: string
  team: "mens" | "youth" | "womens" | "coaches"
}

export interface EditableContent {
  id: string
  key: string
  value: string
  type: "text" | "number" | "textarea"
  section: string
}

export interface Image {
  id: number
  url: string
  alt: string
  category: string
  uploadedAt: string
  uploadedBy: number
}
