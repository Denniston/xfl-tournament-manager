import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// This is your single "Source of Truth" for the database connection
export const supabase = createClient(supabaseUrl, supabaseAnonKey)