import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase environment variables')
  }

  return createServerClient(supabaseUrl, supabaseKey, {
    cookies: {
      getAll() {
        try {
          return cookieStore.getAll()
        } catch (error) {
          console.error('Error getting cookies:', error)
          return []
        }
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) => {
            try {
              cookieStore.set(name, value, options)
            } catch (cookieError) {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
              if (process.env.NODE_ENV === 'development') {
                console.warn('Cannot set cookie from Server Component:', cookieError)
              }
            }
          })
        } catch (error) {
          console.error('Error in setAll cookies:', error)
        }
      },
    },
  })
}

// Helper function to get the authenticated user
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user }, error } = await supabase.auth.getUser()
  
  if (error) {
    console.error('Error getting current user:', error)
    return null
  }
  
  return user
}

// Helper function to check if user is authenticated
export async function isUserAuthenticated() {
  const user = await getCurrentUser()
  return !!user
}