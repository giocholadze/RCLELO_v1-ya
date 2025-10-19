import { supabase } from "./supabase"
import type { EditableContent, NewsItem, MatchFixture, Image, PlayerCard, StaffMember, LeagueCategory } from "./types"

// ==================================================
// Homepage-specific Data Functions
// ==================================================
export async function getRecentNews(limit = 3): Promise<NewsItem[]> {
    const { data, error } = await supabase
        .from("news")
        .select("*")
        .order("published_date", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching recent news:", error);
        return [];
    }
    if (!data) return [];
    return data.map((item) => ({ 
        id: item.id, title: item.title, excerpt: item.excerpt, content: item.content, author: item.author, 
        category: item.category, publishedDate: item.published_date, viewCount: item.view_count, 
        imageUrl: item.image_url, isArchived: item.is_archived 
    }));
}

export async function getUpcomingMatches(limit = 3): Promise<MatchFixture[]> {
    const today = new Date().toISOString();
    const { data, error } = await supabase
        .from("matches")
        .select("*")
        .gte("match_date", today) // Get matches from today onwards
        .order("match_date", { ascending: true })
        .limit(limit);

    if (error) {
        console.error("Error fetching upcoming matches:", error);
        return [];
    }
    if (!data) return [];
    return data.map((match) => ({ 
        id: match.id, homeTeam: match.home_team, awayTeam: match.away_team, matchDate: match.match_date, 
        venue: match.venue, matchType: match.match_type, status: match.status 
    }));
}

// ==================================================
// NEW: League Page-specific Data Functions (CORRECTED)
// ==================================================

export async function getRecentNewsByCategories(categories: LeagueCategory[], limit = 3): Promise<NewsItem[]> {
    const { data, error } = await supabase
        .from("news")
        .select("*")
        // The column 'category' is correct for the news table
        .in("category", categories) 
        .order("published_date", { ascending: false })
        .limit(limit);

    if (error) {
        console.error("Error fetching news by category:", error);
        return [];
    }
    if (!data) return [];
    return data.map((item) => ({ 
        id: item.id, title: item.title, excerpt: item.excerpt, content: item.content, author: item.author, 
        category: item.category, publishedDate: item.published_date, viewCount: item.view_count, 
        imageUrl: item.image_url, isArchived: item.is_archived 
    }));
}

export async function getUpcomingMatchesByCategories(categories: LeagueCategory[], limit = 3): Promise<MatchFixture[]> {
    const today = new Date().toISOString();
    const { data, error } = await supabase
        .from("matches")
        .select("*")
        // *** THIS IS THE FIX: Changed "matchType" to the correct column name "match_type" ***
        .in("match_type", categories) 
        .gte("match_date", today)
        .order("match_date", { ascending: true })
        .limit(limit);

    if (error) {
        console.error("Error fetching upcoming matches by category:", error);
        return [];
    }
    if (!data) return [];
    return data.map((match) => ({ 
        id: match.id, homeTeam: match.home_team, awayTeam: match.away_team, matchDate: match.match_date, 
        venue: match.venue, matchType: match.match_type, status: match.status 
    }));
}
// ==================================================
// Content Management
// ==================================================
export async function getEditableContent(): Promise<EditableContent[]> {
  const { data, error } = await supabase.from("editable_content").select("*")
  if (error) { console.error("Error fetching content:", error); return [] }
  if (!data) return []
  return data.map((item) => ({
    id: item.id, key: item.key, value: item.value,
    type: item.type as "text" | "number" | "textarea", section: item.section,
  }))
}

export async function saveEditableContent(content: EditableContent[]): Promise<void> {
  const contentToSave = content.map(({ id, ...rest }) => rest)
  for (const item of contentToSave) {
    await supabase.from("editable_content").upsert(
      { key: item.key, value: item.value, type: item.type, section: item.section },
      { onConflict: "key" }
    )
  }
}

export async function deleteContentItem(key: string): Promise<boolean> {
  const { error } = await supabase.from("editable_content").delete().eq("key", key)
  if (error) { console.error("Error deleting content item:", error); return false }
  return true
}

export async function updateContent(key: string, value: string): Promise<void> {
    const { error } = await supabase.from("editable_content").update({ value }).eq("key", key)
    if (error) console.error("Error updating content:", error)
}

export async function getContentValue(key: string, defaultValue = ""): Promise<string> {
    const { data, error } = await supabase.from("editable_content").select("value").eq("key", key).single()
    if (error || !data) return defaultValue
    return data.value
}

// ==================================================
// News CRUD
// ==================================================
export async function getAllNewsFromStorage(): Promise<NewsItem[]> {
  const { data, error } = await supabase.from("news").select("*").order("published_date", { ascending: false })
  if (error) { console.error("Error fetching news:", error); return [] }
  if (!data) return []
  return data.map((item) => ({ id: item.id, title: item.title, excerpt: item.excerpt, content: item.content, author: item.author, category: item.category, publishedDate: item.published_date, viewCount: item.view_count, imageUrl: item.image_url, isArchived: item.is_archived }))
}
export async function createNews(newsItem: Omit<NewsItem, "id">): Promise<NewsItem> { 
    const { data, error } = await supabase.from("news").insert({ title: newsItem.title, excerpt: newsItem.excerpt, content: newsItem.content, author: newsItem.author, category: newsItem.category, published_date: newsItem.publishedDate, view_count: newsItem.viewCount || 0, image_url: newsItem.imageUrl, is_archived: newsItem.isArchived || false, }).select().single()
    if (error) throw error
    return { id: data.id, title: data.title, excerpt: data.excerpt, content: data.content, author: data.author, category: data.category, publishedDate: data.published_date, viewCount: data.view_count, imageUrl: data.image_url, isArchived: data.is_archived }
}
export async function updateNews(id: number, updates: Partial<NewsItem>): Promise<NewsItem | null> { 
    const { data, error } = await supabase.from("news").update(updates).eq("id", id).select().single()
    if (error || !data) { console.error("Error updating news:", error); return null }
    return { id: data.id, title: data.title, excerpt: data.excerpt, content: data.content, author: data.author, category: data.category, publishedDate: data.published_date, viewCount: data.view_count, imageUrl: data.image_url, isArchived: data.is_archived }
}
export async function deleteNews(id: number): Promise<boolean> {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) { console.error("Error deleting news:", error); return false; }
  return true;
}

// ==================================================
// Matches CRUD
// ==================================================
export async function getAllMatchesFromStorage(): Promise<MatchFixture[]> {
  const { data, error } = await supabase.from("matches").select("*").order("match_date", { ascending: true })
  if (error) { console.error("Error fetching matches:", error); return [] }
  if (!data) return []
  return data.map((match) => ({ id: match.id, homeTeam: match.home_team, awayTeam: match.away_team, matchDate: match.match_date, venue: match.venue, matchType: match.match_type, status: match.status }))
}
export async function createMatch(match: Omit<MatchFixture, "id">): Promise<MatchFixture> { 
    const { data, error } = await supabase.from("matches").insert({ home_team: match.homeTeam, away_team: match.awayTeam, match_date: match.matchDate, venue: match.venue, match_type: match.matchType, status: match.status || 'scheduled' }).select().single()
    if (error) throw error
    return { id: data.id, homeTeam: data.home_team, awayTeam: data.away_team, matchDate: data.match_date, venue: data.venue, matchType: data.match_type, status: data.status }
}
export async function updateMatch(id: number, updates: Partial<MatchFixture>): Promise<MatchFixture | null> { 
    const { data, error } = await supabase.from("matches").update({ home_team: updates.homeTeam, away_team: updates.awayTeam, match_date: updates.matchDate, venue: updates.venue, match_type: updates.matchType, status: updates.status }).eq("id", id).select().single()
    if (error || !data) { console.error("Error updating match:", error); return null }
    return { id: data.id, homeTeam: data.home_team, awayTeam: data.away_team, matchDate: data.match_date, venue: data.venue, matchType: data.match_type, status: data.status }
}
export async function deleteMatch(id: number): Promise<boolean> {
  const { error } = await supabase.from("matches").delete().eq("id", id);
  if (error) { console.error("Error deleting match:", error); return false; }
  return true;
}

// ==================================================
// Images CRUD
// ==================================================
export async function getAllImagesFromStorage(): Promise<Image[]> {
  const { data, error } = await supabase.from("images").select("*").order("uploaded_at", { ascending: false })
  if (error) { console.error("Error fetching images:", error); return [] }
  if (!data) return []
  return data.map((img) => ({ id: img.id, url: img.url, alt: img.alt, category: img.category, uploadedAt: img.uploaded_at, uploadedBy: img.uploaded_by }))
}
export async function createImage(image: Omit<Image, "id">): Promise<Image> { 
    const { data, error } = await supabase.from("images").insert({ url: image.url, alt: image.alt, category: image.category, uploaded_by: image.uploadedBy }).select().single()
    if (error) throw error
    return { id: data.id, url: data.url, alt: data.alt, category: data.category, uploadedAt: data.uploaded_at, uploadedBy: data.uploaded_by }
}
export async function updateImage(id: number, updates: Partial<Image>): Promise<Image | null> { 
    const { data, error } = await supabase.from("images").update(updates).eq("id", id).select().single()
    if (error || !data) { console.error("Error updating image:", error); return null }
    return { id: data.id, url: data.url, alt: data.alt, category: data.category, uploadedAt: data.uploaded_at, uploadedBy: data.uploaded_by }
}
export async function deleteImage(id: number): Promise<boolean> {
  const { error } = await supabase.from("images").delete().eq("id", id);
  if (error) { console.error("Error deleting image:", error); return false; }
  return true;
}

// ==================================================
// Players CRUD (Simplified Version)
// ==================================================
export async function getAllPlayersFromStorage(): Promise<PlayerCard[]> {
  const { data, error } = await supabase.from("players").select("*").order("created_at", { ascending: false })
  if (error) { console.error("Error fetching players:", error); return [] }
  if (!data) return []
  return data.map((player) => ({ id: player.id, name: player.name, position: player.position, age: player.age, height: player.height, weight: player.weight, nationality: player.nationality, imageUrl: player.image_url, isActive: player.is_active, category: player.category, team: player.team }))
}

export async function createPlayer(player: Omit<PlayerCard, "id">): Promise<PlayerCard> {
  const { data, error } = await supabase.from("players").insert({ name: player.name, position: player.position, age: player.age, height: player.height, weight: player.weight, nationality: player.nationality, image_url: player.imageUrl, is_active: player.isActive, category: player.category, team: player.team, }).select().single()
  if (error) throw error
  return { id: data.id, name: data.name, position: data.position, age: data.age, height: data.height, weight: data.weight, nationality: data.nationality, imageUrl: data.image_url, isActive: data.is_active, category: data.category, team: data.team, }
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
  if (updates.isActive !== undefined) dbUpdates.is_active = updates.isActive
  if (updates.category !== undefined) dbUpdates.category = updates.category
  if (updates.team !== undefined) dbUpdates.team = updates.team
  const { data, error } = await supabase.from("players").update(dbUpdates).eq("id", id).select().single()
  if (error || !data) { console.error("Error updating player:", error); return null }
  return { id: data.id, name: data.name, position: data.position, age: data.age, height: data.height, weight: data.weight, nationality: data.nationality, imageUrl: data.image_url, isActive: data.is_active, category: data.category, team: data.team, }
}

export async function deletePlayer(id: number): Promise<boolean> {
  const { error } = await supabase.from("players").delete().eq("id", id)
  if (error) { console.error("Error deleting player:", error); return false }
  return true
}

// ==================================================
// Staff CRUD
// ==================================================
export async function getAllStaff(): Promise<StaffMember[]> {
  const { data, error } = await supabase.from("staff").select("*").order("name", { ascending: true });
  if (error) { console.error("Error fetching staff:", error); return []; }
  if (!data) { return []; }
  return data.map((staffMember) => ({
    id: staffMember.id,
    name: staffMember.name,
    position: staffMember.position,
    email: staffMember.email,
    image: staffMember.image_url, 
  }));
}