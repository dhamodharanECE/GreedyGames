import { create } from 'zustand'
import { User } from '@supabase/supabase-js'

interface Profile {
  id: string
  name: string
  email: string
  role: 'user' | 'superuser'
  avatar_url?: string
}

interface AuthState {
  user: User | null
  profile: Profile | null
  setUser: (user: User | null) => void
  setProfile: (profile: Profile | null) => void
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  profile: null,
  setUser: (user) => set({ user }),
  setProfile: (profile) => set({ profile }),
}))