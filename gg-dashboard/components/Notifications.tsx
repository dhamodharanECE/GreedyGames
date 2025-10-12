'use client'

import { useState, useEffect } from 'react'
import { useTodos } from '../hooks/useTodos'

export default function Notifications() {
  const [isOpen, setIsOpen] = useState(false)
  const { todos } = useTodos()

  const upcomingTodos = todos.filter(todo => {
    if (todo.completed) return false
    const dueDate = new Date(todo.due_at)
    const now = new Date()
    const hoursUntilDue = (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60)
    return hoursUntilDue <= 4 && hoursUntilDue > 0
  })

  const completedTodos = todos.filter(todo => todo.completed)
  const overdueTodos = todos.filter(todo => {
    if (todo.completed) return false
    const dueDate = new Date(todo.due_at)
    const now = new Date()
    return dueDate < now
  })

  const totalNotifications = upcomingTodos.length + completedTodos.length + overdueTodos.length

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.24 8.56a5.97 5.97 0 01-3.79 1.17 5.97 5.97 0 01-3.79-1.17 6 6 0 118.58 0z" />
        </svg>
        {totalNotifications > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {totalNotifications}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>
            
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {overdueTodos.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-red-600 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-red-600 rounded-full mr-2"></span>
                    Overdue ({overdueTodos.length})
                  </h4>
                  {overdueTodos.map(todo => (
                    <div key={todo.id} className="text-sm p-3 bg-red-50 rounded-lg mb-2 border border-red-100">
                      <div className="font-medium text-red-900">🚨 {todo.title}</div>
                      <div className="text-red-700 text-xs mt-1">
                        Was due {new Date(todo.due_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {upcomingTodos.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-orange-600 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                    Upcoming ({upcomingTodos.length})
                  </h4>
                  {upcomingTodos.map(todo => (
                    <div key={todo.id} className="text-sm p-3 bg-orange-50 rounded-lg mb-2 border border-orange-100">
                      <div className="font-medium text-orange-900">⏰ {todo.title}</div>
                      <div className="text-orange-700 text-xs mt-1">
                        Due {new Date(todo.due_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {completedTodos.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-green-600 mb-2 flex items-center">
                    <span className="w-2 h-2 bg-green-600 rounded-full mr-2"></span>
                    Completed ({completedTodos.length})
                  </h4>
                  {completedTodos.map(todo => (
                    <div key={todo.id} className="text-sm p-3 bg-green-50 rounded-lg mb-2 border border-green-100">
                      <div className="font-medium text-green-900">✅ {todo.title}</div>
                      <div className="text-green-700 text-xs mt-1">
                        Completed {new Date(todo.updated_at).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {totalNotifications === 0 && (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">🎉</div>
                  <p className="text-gray-500 text-sm">All caught up! No notifications.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}