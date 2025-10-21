import { createClient as createSupabaseClient } from '@supabase/supabase-js'

export function createClient() {
  // Only create client on client side
  if (typeof window === 'undefined') {
    return null
  }

  const supabaseUrl = 'https://wdzgufogkojbxmatjfee.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkemd1Zm9na29qYnhtYXRqZmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTQ4MjQsImV4cCI6MjA3NTg3MDgyNH0.TFca-LzxsYjpeh2yxH_Sh22Qn3kshZyJIDA2OmHrCf0'
  // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  // const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables')
    return null
  }

  return createSupabaseClient(supabaseUrl, supabaseAnonKey)
}