import { createClient } from '../../../../supabase/server'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')

  console.log('🔐 Auth callback triggered')
  console.log('Authorization code:', code)

  if (!code) {
    console.error('❌ No authorization code found')
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=no_code&message=No authorization code received`
    )
  }

  try {
    const supabase = await createClient()
    
    console.log('🔄 Exchanging code for session...')
    
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (error) {
      console.error('❌ Code exchange failed:', error.message)
      console.error('Full error:', error)
      
      // Special handling for PKCE errors
      if (error.message.includes('code verifier')) {
        return NextResponse.redirect(
          `${requestUrl.origin}/login?error=pkce_error&message=Authentication session expired. Please try again.`
        )
      }
      
      return NextResponse.redirect(
        `${requestUrl.origin}/login?error=auth_failed&message=${encodeURIComponent(error.message)}`
      )
    }

    console.log('✅ OAuth login successful!')
    console.log('User:', data.session?.user?.email)
    
    // Redirect to dashboard
    return NextResponse.redirect(new URL('/dashboard', requestUrl.origin))
    
  } catch (error: unknown) {
    console.error('💥 Unexpected error in auth callback:', error)
    
    const errorMessage = (error as Error).message || 'An unknown error occurred'
    
    return NextResponse.redirect(
      `${requestUrl.origin}/login?error=unexpected_error&message=${encodeURIComponent(errorMessage)}`
    )
  }
}