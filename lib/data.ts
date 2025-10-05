import type { NewsItem, MatchFixture } from "./types"
import { getAllNewsFromStorage, getAllMatchesFromStorage } from "./content-manager"

export function getFeaturedNews(): NewsItem {
  const allNews = getAllNewsFromStorage()
  if (allNews.length > 0) {
    return allNews[0]
  }

  // Fallback default news
  return {
    id: 1,
    title: "ჭაბუკთა 'ა' ლიგა | 'ლელომ' ტიტული უმძიმეს ბრძოლაში დაიცვა",
    excerpt:
      "ბოლო 10 წლის მანძილზე უფროსი ასაკის ჭაბუკ მორაგბეთა პირველობის ტიტულის მფლობელს 'აია'-'ლელოს' რიგით მე-8 დაპირისპირება არკვევდა.",
    content:
      "ბოლო 10 წლის მანძილზე უფროსი ასაკის ჭაბუკ მორაგბეთა პირველობის ტიტულის მფლობელს 'აია'-'ლელოს' რიგით მე-8 დაპირისპირება (მათ შორის ფინალში მეოთხედ) არკვევდა. აღნიშნულ პერიოდში დიდ დიღმელები 6-ჯერ გახდნენ ჩემპიონები (ერთხელ ფინალში 'ხვამლს' მოუგეს), 'აიამ' კი ტიტულის მოპოვება 2-ჯერ მოახერხა.",
    author: "სპორტული რეპორტიორი",
    category: "Youth Team",
    publishedDate: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    viewCount: 1850,
    imageUrl:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4bebcd1a-e285-44dd-9d18-e67be8b94575.jpg-lPuPFwmePbLuJFxxjut63NadgkFNnw.jpeg",
  }
}

export function getRecentNews(): NewsItem[] {
  const allNews = getAllNewsFromStorage()
  if (allNews.length > 0) {
    return allNews.slice(0, 3)
  }

  // Fallback default news
  return [
    getFeaturedNews(),
    {
      id: 2,
      title: "ლელო ესპუართა ლიგის ჩემპიონია",
      excerpt:
        '3 მაისს, ავჭალის სარაგბო სტადიონზე ესპუართა ლიგის ფინალური შეხვედრა "ბათუმთან" გვქონდა სადაც მეტოქე ანგარიშით 38:20 დავამარცხეთ.',
      content:
        '3 მაისს, ავჭალის სარაგბო სტადიონზე ესპუართა ლიგის ფინალური შეხვედრა "ბათუმთან" გვქონდა სადაც მეტოქე ანგარიშით 38:20 დავამარცხეთ და ესპუართა ლიგის ჩემპიონობა მინიმუმ ერთი წლით გავიხანგრძლივეთ.',
      author: "კლუბის ადმინისტრაცია",
      category: "General",
      publishedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: 1340,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/a7818084-195b-47f1-b81d-988d070f9d7d.jpg-2XJwiAEI3Ai6oRta4QmmPa1LY1SYjU.jpeg",
    },
    {
      id: 3,
      title: 'ლელო ჭაბუკთა "ა" ლიგის 7 კაცა ტურნირის გამარჯვებულია',
      excerpt:
        '12 აპრილს ლოკომოტივის ბაზაზე გაიმართა ჭაბუკთა "ა" ლიგის 7 კაცა ტურნირი სადაც გამარჯვებული, საქართველოს ჩემპიონი ხორბალაძე-შანიძის გუნდმა გახდა.',
      content:
        '12 აპრილს ლოკომოტივის ბაზაზე გაიმართა ჭაბუკთა "ა" ლიგის 7 კაცა ტურნირი სადაც გამარჯვებული, საქართველოს ჩემპიონი ხორბალაძე-შანიძის გუნდმა გახდა.',
      author: "ტურნირის ორგანიზატორები",
      category: "Youth Team",
      publishedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      viewCount: 920,
      imageUrl:
        "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/1fd63848-f6b3-4c77-9efa-9cff3663dc6c.jpg-CqcaMUcbbEF3vXtVeUoF0xFPDleh0O.jpeg",
    },
  ]
}

export function getAllNews(): NewsItem[] {
  const allNews = getAllNewsFromStorage()
  if (allNews.length > 0) {
    return allNews
  }

  return getRecentNews()
}

export function getUpcomingMatches(): MatchFixture[] {
  const allMatches = getAllMatchesFromStorage()
  if (allMatches.length > 0) {
    return allMatches.filter((match) => new Date(match.matchDate) > new Date()).slice(0, 2)
  }

  // Fallback default matches
  return [
    {
      id: 1,
      homeTeam: "LELO",
      awayTeam: "City Rivals",
      matchDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      venue: "LELO Arena",
      matchType: "უმაღლესი ლიგა",
    },
    {
      id: 2,
      homeTeam: "Regional Champions",
      awayTeam: "LELO",
      matchDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      venue: "Away Ground",
      matchType: "ესპუართა ლიგა",
    },
  ]
}
