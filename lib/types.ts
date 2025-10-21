// 1. NEW: A reusable type for your specific league categories
export type LeagueCategory = "უმაღლესი" | "ესპუართა" | "ლიგა 'ა'" | "ლიგა 'ბ'" | "საფესტივალო";

export interface NewsItem {
  id: number
  title: string
  excerpt: string
  content: string
  author: string
  category: LeagueCategory // 2. UPDATED from string
  publishedDate: string
  viewCount: number
  imageUrl?: string
  isArchived?: boolean
}

export interface MatchFixture {
  id: number
  homeTeam: string
  awayTeam: string
  // ADDED: Optional fields for team logos
  homeTeamLogo?: string
  awayTeamLogo?: string
  matchDate: string
  venue: string
  matchType: LeagueCategory // 3. UPDATED from string
  status?: "scheduled" | "live" | "finished"
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
  age?: number
  height?: string
  weight?: string
  nationality?: string
  imageUrl?: string
  isActive?: boolean
  category?: "Men's Rugby" | "Women's Rugby" | "Youth Rugby" | "Coaches"
  team?: "mens" | "youth" | "womens" | "coaches"
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
  category: LeagueCategory // 4. UPDATED from string
  uploadedAt: string
  uploadedBy: number
}

export interface StaffMember {
  id: number
  name: string
  position: string
  email?: string | null
  image?: string | null
}