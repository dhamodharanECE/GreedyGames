'use client'

import { useState, useEffect } from 'react'
import { Todo } from '../../../../../gg-dashboard/types/index'
import TodoList from '../../../../components/TodoList'
import TodoForm from '../../../../components/TodoForm'
import { useAuth } from '../../../../hooks/useAuth'
import { supabase } from '../../../../lib/supabase';

export default function TodosPage() {
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

  useEffect(() => {
    if (user) {
      fetchTodos()
    }
  }, [user])

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading todos...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">My Todos</h1>
        <TodoForm onSuccess={fetchTodos} />
      </div>
      <TodoList todos={todos} onUpdate={fetchTodos} />
    </div>
  )
}