import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://hvqaojhvangicevsaldi.supabase.co'
const supabaseAnonKey = 'sb_publishable_-a5HEXUlpCgjnzlKvouEqg_7ou3n-xO'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
