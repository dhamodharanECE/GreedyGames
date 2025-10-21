// lib/supabase.js - Make sure this file exists and exports a valid client
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wdzgufogkojbxmatjfee.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkemd1Zm9na29qYnhtYXRqZmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTQ4MjQsImV4cCI6MjA3NTg3MDgyNH0.TFca-LzxsYjpeh2yxH_Sh22Qn3kshZyJIDA2OmHrCf0'
// Add validation
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)