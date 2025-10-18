// /lib/auth.ts

/**
 * მომხმარებლის ინტერფეისი, რომელიც განსაზღვრავს მომხმარებლის ობიექტის სტრუქტურას.
 */
export interface User {
  id: string
  email: string
  name: string
  role: "admin" | "user"
}

/**
 * სტატიკური ადმინისტრატორის სერთიფიკატები შესვლისთვის.
 */
const ADMIN_CREDENTIALS = {
  email: "officelelo1@gmail.com",
  password: "Saracens.lelo1",
  user: {
    id: "admin-1",
    email: "officelelo1@gmail.com",
    name: "Admin",
    role: "admin" as const,
  },
}

/**
 * მომხმარებლის რეგისტრაციის ფუნქცია (ამჟამად მხოლოდ დროებითი შეტყობინებით).
 * რეალურ პროექტში აქ დაგჭირდებათ მონაცემთა ბაზასთან კომუნიკაცია.
 */
export function register(
  email: string,
  password: string,
  name: string,
  role: "admin" | "user" = "user",
): { success: boolean; message: string; user?: User } {
  // რადგან getUsers() ფუნქცია არ არის განსაზღვრული და არ გაქვთ მონაცემთა ბაზა,
  // ეს ფუნქცია დროებით აბრუნებს შეცდომას.
  return { success: false, message: "რეგისტრაცია დროებით დაბლოკილია" }
}

/**
 * მომხმარებლის შესვლის ფუნქცია.
 * ამოწმებს ადმინისტრატორის სტატიკურ სერთიფიკატებს და ინახავს მომხმარებელს localStorage-ში.
 */
export function login(
  email: string,
  password: string,
): { success: boolean; user?: User; message?: string } {
  if (
    email === ADMIN_CREDENTIALS.email &&
    password === ADMIN_CREDENTIALS.password
  ) {
    if (typeof window !== "undefined") {
      // მომხმარებლის შენახვა ლოკალურ მეხსიერებაში
      localStorage.setItem("user", JSON.stringify(ADMIN_CREDENTIALS.user))
    }
    return { success: true, user: ADMIN_CREDENTIALS.user }
  }
  return { success: false, message: "არასწორი ელფოსტა ან პაროლი" }
}

/**
 * მომხმარებლის გამოსვლის ფუნქცია.
 * შლის მომხმარებლის მონაცემებს localStorage-დან.
 */
export function logout() {
  if (typeof window !== "undefined") {
    localStorage.removeItem("user")
  }
}

/**
 * ამჟამად შესული მომხმარებლის მონაცემების მიღება localStorage-დან.
 */
export function getCurrentUser(): User | null {
  // შემოწმება, რომ კოდი ბრაუზერის გარემოში მუშაობს
  if (typeof window === "undefined") {
    return null
  }
  
  const userStr = localStorage.getItem("user")
  if (!userStr) return null
  
  try {
    const user = JSON.parse(userStr) as User
    
    // დამატებითი შემოწმება, რომ ობიექტი User ინტერფეისს შეესაბამება
    if (user && user.id && user.email) {
      return user
    }
    return null
    
  } catch {
    return null
  }
}