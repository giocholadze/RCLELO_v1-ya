// /lib/auth.ts
import { supabase } from './supabase';
import type { AuthError, User } from '@supabase/supabase-js';

/**
 * User interface defining the structure of the user object.
 */
export interface CustomUser {
  id: string;
  email: string;
  name: string;
  role: "admin" | "user";
}

/**
 * Static admin credentials. 
 * The password here is for reference; login will be handled by Supabase.
 * It's crucial that a user with this email and password exists in your Supabase Auth users.
 */
export const ADMIN_CREDENTIALS = {
  email: "officelelo1@gmail.com",
  password: "Saracens.lelo1", // Ensure this matches the password in Supabase
};

/**
 * Logs in a user using Supabase.
 * @param email The user's email.
 * @param password The user's password.
 * @returns An object with the user data or an error.
 */
export async function login(
  email: string,
  password: string,
): Promise<{ success: boolean; user?: User | null; error?: AuthError | null }> {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Supabase login error:", error.message);
    return { success: false, error };
  }

  return { success: true, user: data.user };
}

/**
 * Logs out the current user from Supabase.
 * @returns An object indicating success or containing an error.
 */
export async function logout(): Promise<{ success: boolean; error?: AuthError | null }> {
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase logout error:", error.message);
    return { success: false, error };
  }

  return { success: true };
}
