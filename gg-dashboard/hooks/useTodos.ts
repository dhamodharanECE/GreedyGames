'use client'

import { useState, useEffect } from 'react'
import { Todo } from '../../gg-dashboard/types/index'
import { supabase } from '../lib/supabase'
import { useAuth } from './useAuth'

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  const fetchTodos = async () => {
    if (!user) return
    
    setLoading(true)
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', user.id)
      .order('due_at')

    if (!error && data) {
      setTodos(data)
    }
    setLoading(false)
  }

  const addTodo = async (todo: Omit<Todo, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    if (!user) return

    const { data, error } = await supabase
      .from('todos')
      .insert([
        {
          ...todo,
          user_id: user.id
        }
      ])
      .select()
      .single()

    if (!error && data) {
      setTodos(prev => [...prev, data])
    }
    return { data, error }
  }

  const updateTodo = async (id: string, updates: Partial<Todo>) => {
    const { data, error } = await supabase
      .from('todos')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (!error && data) {
      setTodos(prev => prev.map(todo => todo.id === id ? data : todo))
    }
    return { data, error }
  }

  const deleteTodo = async (id: string) => {
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', id)

    if (!error) {
      setTodos(prev => prev.filter(todo => todo.id !== id))
    }
    return { error }
  }

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user])

  return {
    todos,
    loading,
    fetchTodos,
    addTodo,
    updateTodo,
    deleteTodo
  }
}