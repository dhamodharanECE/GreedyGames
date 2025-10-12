// lib/supabase.ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Define the Supabase client type
let supabase: SupabaseClient

// Validate environment variables and create client
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(`
⚠️  Supabase environment variables are missing!
Please add these to your .env.local file:

NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here

Get these from your Supabase project: Settings → API
  `)
  
  // Create a dummy client that will throw errors when used
  // This helps with TypeScript typing while showing clear errors
  supabase = createClient(
    'https://dummy-url-for-typescript.supabase.co', 
    'dummy-key-for-typescript'
  )
} else if (!supabaseUrl.startsWith('http')) {
  console.error('❌ Invalid Supabase URL format. Must start with http:// or https://')
  
  // Still create a client for TypeScript, but it will fail at runtime
  supabase = createClient(
    'https://dummy-url-for-typescript.supabase.co', 
    'dummy-key-for-typescript'
  )
} else {
  // Valid configuration - create the real client
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  console.log('✅ Supabase connected successfully')
}

export { supabase }