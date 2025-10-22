import { createBrowserClient } from "@supabase/ssr";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://wdzgufogkojbxmatjfee.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indkemd1Zm9na29qYnhtYXRqZmVlIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyOTQ4MjQsImV4cCI6MjA3NTg3MDgyNH0.TFca-LzxsYjpeh2yxH_Sh22Qn3kshZyJIDA2OmHrCf0';

export const createClient = () =>
  createBrowserClient(
    supabaseUrl!,
    supabaseKey!,
  );