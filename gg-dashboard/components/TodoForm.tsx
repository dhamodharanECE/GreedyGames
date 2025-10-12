'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../hooks/useAuth'

interface TodoFormProps {
  onSuccess: () => void
}

export default function TodoForm({ onSuccess }: TodoFormProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [dueAt, setDueAt] = useState('')
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !title.trim() || !dueAt) return

    setLoading(true)
    try {
      const { error } = await supabase.from('todos').insert([
        {
          title: title.trim(),
          description: description.trim(),
          due_at: dueAt,
          user_id: user.id,
        },
      ])

      if (error) throw error

      setTitle('')
      setDescription('')
      setDueAt('')
      setIsOpen(false)
      onSuccess()
    } catch (error) {
      console.error('Error creating todo:', error)
      alert('Error creating todo. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center space-x-2"
      >
        <span>+</span>
        <span>New Todo</span>
      </button>
    )
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Todo</h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title *
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="What needs to be done?"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Add some details..."
                rows={3}
              />
            </div>
            <div>
  <label htmlFor="due-date" className="block text-sm font-medium text-gray-700 mb-1">
    Due Date and Time *
    <span className="text-red-500 ml-1" aria-hidden="true">*</span>
  </label>
  <input
    id="due-date"
    name="due-date"
    type="datetime-local"
    value={dueAt}
    onChange={(e) => setDueAt(e.target.value)}
    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
    required
    min={new Date().toISOString().slice(0, 16)}
    aria-required="true"
    aria-describedby="due-date-help due-date-format"
    title="Select the due date and time for your todo item"
    step="300" 
  />
  <div className="flex justify-between mt-1">
    <p id="due-date-help" className="text-sm text-gray-500">
      Select when this todo should be completed
    </p>
    <p id="due-date-format" className="text-sm text-gray-400">
      Format: YYYY-MM-DD HH:MM
    </p>
  </div>
</div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                disabled={loading || !title.trim() || !dueAt}
                className="flex-1 bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Todo'}
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-md hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}