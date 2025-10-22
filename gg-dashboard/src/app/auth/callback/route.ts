// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '../../../supabase/server'

export async function GET(req: Request) {
  const supabase = await createClient()
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', url.origin))
  }

  const { data, error } = await supabase.auth.exchangeCodeForSession(code)
  if (error) {
    console.error(error)
    return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, url.origin))
  }

  // ✅ Use absolute URL for redirect
  return NextResponse.redirect(new URL('/dashboard', url.origin))
}
