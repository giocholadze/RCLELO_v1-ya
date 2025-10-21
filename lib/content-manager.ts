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
        .gte("match_date", today)
        .order("match_date", { ascending: true })
        .limit(limit);

    if (error) {
        console.error("Error fetching upcoming matches:", error);
        return [];
    }
    if (!data) return [];
    return data.map((match) => ({
        id: match.id, homeTeam: match.home_team, awayTeam: match.away_team, matchDate: match.match_date,
        venue: match.venue, matchType: match.match_type, status: match.status,
        homeTeamLogo: match.home_team_logo, awayTeamLogo: match.away_team_logo
    }));
}

// ==================================================
// League Page-specific Data Functions
// ==================================================
export async function getRecentNewsByCategories(categories: LeagueCategory[], limit = 3): Promise<NewsItem[]> {
    const { data, error } = await supabase
        .from("news")
        .select("*")
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
        venue: match.venue, matchType: match.match_type, status: match.status,
        homeTeamLogo: match.home_team_logo, awayTeamLogo: match.away_team_logo
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
  return data.map((match) => ({ id: match.id, homeTeam: match.home_team, awayTeam: match.away_team, matchDate: match.match_date, venue: match.venue, matchType: match.match_type, status: match.status, homeTeamLogo: match.home_team_logo, awayTeamLogo: match.away_team_logo }))
}
export async function createMatch(match: Omit<MatchFixture, "id">): Promise<MatchFixture> {
    const { data, error } = await supabase.from("matches").insert({ home_team: match.homeTeam, away_team: match.awayTeam, match_date: match.matchDate, venue: match.venue, match_type: match.matchType, status: match.status || 'scheduled', home_team_logo: match.homeTeamLogo, away_team_logo: match.awayTeamLogo }).select().single()
    if (error) throw error
    return { id: data.id, homeTeam: data.home_team, awayTeam: data.away_team, matchDate: data.match_date, venue: data.venue, matchType: data.match_type, status: data.status, homeTeamLogo: data.home_team_logo, awayTeamLogo: data.away_team_logo }
}
export async function updateMatch(id: number, updates: Partial<MatchFixture>): Promise<MatchFixture | null> {
    const dbUpdates: any = {}
    if (updates.homeTeam) dbUpdates.home_team = updates.homeTeam;
    if (updates.awayTeam) dbUpdates.away_team = updates.awayTeam;
    if (updates.matchDate) dbUpdates.match_date = updates.matchDate;
    if (updates.venue) dbUpdates.venue = updates.venue;
    if (updates.matchType) dbUpdates.match_type = updates.matchType;
    if (updates.status) dbUpdates.status = updates.status;
    if (updates.homeTeamLogo) dbUpdates.home_team_logo = updates.homeTeamLogo;
    if (updates.awayTeamLogo) dbUpdates.away_team_logo = updates.awayTeamLogo;

    const { data, error } = await supabase.from("matches").update(dbUpdates).eq("id", id).select().single()
    if (error || !data) { console.error("Error updating match:", error); return null }
    return { id: data.id, homeTeam: data.home_team, awayTeam: data.away_team, matchDate: data.match_date, venue: data.venue, matchType: data.match_type, status: data.status, homeTeamLogo: data.home_team_logo, awayTeamLogo: data.away_team_logo }
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
    const { data, error } = await supabase.from("images").insert({ 
        url: image.url, 
        alt: image.alt, 
        category: image.category, 
        uploaded_by: image.uploadedBy,
        uploaded_at: image.uploadedAt
    }).select().single()
    
    if (error) {
        console.error("Error creating image in DB:", error)
        throw error
    }
    
    return { id: data.id, url: data.url, alt: data.alt, category: data.category, uploadedAt: data.uploaded_at, uploadedBy: data.uploaded_by }
}
export async function updateImage(id: number, updates: Partial<Image>): Promise<Image | null> {
    const dbUpdates: any = {};
    if (updates.url) dbUpdates.url = updates.url;
    if (updates.alt) dbUpdates.alt = updates.alt;
    if (updates.category) dbUpdates.category = updates.category;

    const { data, error } = await supabase.from("images").update(dbUpdates).eq("id", id).select().single()
    if (error || !data) { console.error("Error updating image:", error); return null }
    return { id: data.id, url: data.url, alt: data.alt, category: data.category, uploadedAt: data.uploaded_at, uploadedBy: data.uploaded_by }
}
export async function deleteImage(id: number): Promise<boolean> {
  const { error } = await supabase.from("images").delete().eq("id", id);
  if (error) { console.error("Error deleting image:", error); return false; }
  return true;
}

// ==================================================
// Reusable Image Upload Function (for Team Logos)
// ==================================================
export async function uploadImage(file: File): Promise<string | null> {
  const fileName = `public/${Date.now()}_${file.name}`
  const { data, error } = await supabase.storage.from("team-logos").upload(fileName, file)

  if (error) {
    console.error("Error uploading image:", error)
    return null
  }
  const { data: publicUrlData } = supabase.storage.from("team-logos").getPublicUrl(fileName)

  if (!publicUrlData) {
    console.error("Could not get public URL for uploaded image")
    return null
  }
  return publicUrlData.publicUrl
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

// ==================================================
// Storage Management (for the Image Manager)
// ==================================================

export function formatFileSize(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

export async function getUploadedImages(bucketName = 'gallery-images') {
    const { data, error } = await supabase.storage.from(bucketName).list();

    if (error) {
        console.error(`Error listing uploaded images from ${bucketName}:`, error);
        return [];
    }

    if (!data) return [];

    const imagesWithUrls = data.map(file => {
        // FIX: Add a null check for metadata to prevent crash
        if (!file.metadata) {
            console.warn(`File "${file.name}" has no metadata, skipping.`);
            return null; // Skip files without metadata (like folders)
        }
        const publicUrlData = supabase.storage.from(bucketName).getPublicUrl(file.name);
        return {
            ...file,
            url: publicUrlData.data.publicUrl,
            size: file.metadata.size,
            uploadedAt: file.created_at,
        };
    }).filter(Boolean); // Filter out any null entries

    return imagesWithUrls;
}

export async function deleteUploadedImage(fileName: string, bucketName = 'gallery-images'): Promise<boolean> {
    const { error } = await supabase.storage.from(bucketName).remove([fileName]);
    if (error) {
        console.error(`Error deleting uploaded image ${fileName}:`, error);
        return false;
    }
    return true;
}

export async function uploadGalleryImage(file: File): Promise<string | null> {
  const fileName = `public/${Date.now()}_${file.name}`
  const { data, error } = await supabase.storage.from("gallery-images").upload(fileName, file)

  if (error) {
    console.error("Error uploading gallery image:", error)
    return null
  }
  const { data: publicUrlData } = supabase.storage.from("gallery-images").getPublicUrl(fileName)

  if (!publicUrlData) {
    console.error("Could not get public URL for uploaded image")
    return null
  }
  return publicUrlData.publicUrl
}