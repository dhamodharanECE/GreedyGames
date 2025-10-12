// types/index.ts
export interface Todo {
  id: string
  user_id: string
  title: string
  description?: string
  due_at: string
  completed: boolean
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  email: string
  name: string
  role: 'user' | 'superuser'
  avatar_url?: string
  created_at: string
}

export interface Profile {
  id: string
  name: string
  email: string
  role: 'user' | 'superuser'
  avatar_url?: string
  created_at: string
}