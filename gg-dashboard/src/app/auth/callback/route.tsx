// app/auth/callback/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '../../../supabase/server/page'

export async function GET(req: Request) {
  const supabase = await createClient()
  const url = new URL(req.url)
  const code = url.searchParams.get('code')

  if (!code) {
    return NextResponse.redirect(new URL('/login?error=no_code', req.url))
  }

  try {
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('Auth callback error:', error)
      return NextResponse.redirect(new URL(`/login?error=${encodeURIComponent(error.message)}`, req.url))
    }

    return NextResponse.redirect(new URL('/dashboard', req.url))
    
  } catch (error) {
    console.error('Unexpected error in auth callback:', error)
    return NextResponse.redirect(new URL('/login?error=auth_failed', req.url))
  }
}