import { createClient } from '@supabase/supabase-js'

export function project() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  console.log('Supabase Table connecting in client:', {
    url: supabaseUrl ? '✅ Present' : '❌ Missing',
    key: supabaseAnonKey ? '✅ Present' : '❌ Missing'
  })

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}