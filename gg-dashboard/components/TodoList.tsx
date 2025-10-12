'use client'

import { Todo } from '../../gg-dashboard/types/index'
import { supabase } from '../lib/supabase'
import { useState } from 'react'

interface TodoListProps {
  todos: Todo[]
  onUpdate: () => void
}

export default function TodoList({ todos, onUpdate }: TodoListProps) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this todo?')) {
      await supabase.from('todos').delete().eq('id', id)
      onUpdate()
    }
  }

  const handleToggleComplete = async (id: string, completed: boolean) => {
    await supabase.from('todos').update({ completed: !completed }).eq('id', id)
    onUpdate()
  }

  const startEditing = (todo: Todo) => {
    setEditingId(todo.id)
    setEditTitle(todo.title)
    setEditDescription(todo.description || '')
  }

  const saveEdit = async (id: string) => {
    if (editTitle.trim()) {
      await supabase
        .from('todos')
        .update({ 
          title: editTitle, 
          description: editDescription 
        })
        .eq('id', id)
      setEditingId(null)
      onUpdate()
    }
  }

  const cancelEdit = () => {
    setEditingId(null)
    setEditTitle('')
    setEditDescription('')
  }

  if (todos.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">📝</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No todos yet</h3>
        <p className="text-gray-500">Get started by creating your first todo!</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`bg-white rounded-lg shadow border p-4 ${
            todo.completed ? 'opacity-75' : ''
          }`}
        >
          {editingId === todo.id ? (
            <div className="space-y-3">
              <input
                type="text"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Todo title"
              />
              <textarea
                value={editDescription}
                onChange={(e) => setEditDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Description (optional)"
                rows={3}
              />
              <div className="flex space-x-2">
                <button
                  onClick={() => saveEdit(todo.id)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Save
                </button>
                <button
                  onClick={cancelEdit}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-start justify-between">
              <div className="flex items-start space-x-3 flex-1">
                <button
                  onClick={() => handleToggleComplete(todo.id, todo.completed)}
                  className={`mt-1 w-5 h-5 rounded border-2 flex items-center justify-center ${
                    todo.completed
                      ? 'bg-green-500 border-green-500'
                      : 'border-gray-300 hover:border-green-500'
                  }`}
                >
                  {todo.completed && '✓'}
                </button>
                <div className="flex-1">
                  <h3 className={`font-medium ${todo.completed ? 'line-through text-gray-500' : 'text-gray-900'}`}>
                    {todo.title}
                  </h3>
                  {todo.description && (
                    <p className="text-gray-600 mt-1 text-sm">{todo.description}</p>
                  )}
                  <p className="text-sm text-gray-500 mt-2">
                    Due: {new Date(todo.due_at).toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => startEditing(todo)}
                  className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(todo.id)}
                  className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded hover:bg-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}