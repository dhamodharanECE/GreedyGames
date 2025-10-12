// hooks/useAuth.ts
'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { User } from '@supabase/supabase-js'
import { supabase } from '../lib/supabase'

interface Profile {
  id: string
  name: string
  email: string
  role: 'user' | 'superuser'
  avatar_url?: string
  created_at: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')
  const router = useRouter()

  const fetchProfile = async (userId: string) => {
    try {
      console.log('Fetching profile for user:', userId)
      
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) {
        console.error('Supabase profile error:', {
          message: error.message,
          code: error.code,
          details: error.details,
          hint: error.hint
        })
        setError(`Profile error: ${error.message}`)
        
        // If profile doesn't exist, create one
        if (error.code === 'PGRST116') { // Record not found
          await createProfile(userId)
        }
      } else if (profile) {
        console.log('Profile fetched successfully:', profile)
        setProfile(profile)
        setError('')
      } else {
        console.warn('No profile data returned')
        setError('No profile data found')
      }
    } catch (err) {
      console.error('Unexpected error fetching profile:', err)
      setError('Unexpected error fetching profile')
    }
  }

  const createProfile = async (userId: string) => {
    try {
      console.log('Creating new profile for user:', userId)
      
      const { data: userData } = await supabase.auth.getUser()
      const user = userData.user
      
      if (!user) {
        console.error('No user found when creating profile')
        return
      }

      const { data: newProfile, error } = await supabase
        .from('profiles')
        .insert([
          {
            id: userId,
            email: user.email,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            role: 'user'
          }
        ])
        .select()
        .single()

      if (error) {
        console.error('Error creating profile:', error)
        setError(`Failed to create profile: ${error.message}`)
      } else {
        console.log('Profile created successfully:', newProfile)
        setProfile(newProfile)
        setError('')
      }
    } catch (err) {
      console.error('Unexpected error creating profile:', err)
      setError('Unexpected error creating profile')
    }
  }

  useEffect(() => {
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...')
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Session error:', error)
          setError(`Auth error: ${error.message}`)
        }
        
        setUser(session?.user || null)
        
        if (session?.user) {
          console.log('User found, fetching profile...')
          await fetchProfile(session.user.id)
        } else {
          console.log('No user session found')
        }
      } catch (err) {
        console.error('Unexpected error getting session:', err)
        setError('Unexpected auth error')
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event)
        
        setUser(session?.user || null)
        
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setError('')
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [router])

  const signOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return {
    user,
    profile,
    role: profile?.role || 'user',
    loading,
    error,
    signOut
  }
}