'use client'

import { useAuth } from '../hooks/useAuth'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Notifications from './Notifications'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, role, loading, signOut } = useAuth()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    }
  }, [user, loading, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    )
  }

  if (!user) return null

  const menuItems = [
    { name: 'Todos', href: '/dashboard/todos', icon: '📝' },
    ...(role === 'superuser' ? [{ name: 'Users', href: '/dashboard/users', icon: '👥' }] : []),
    { name: 'Profile', href: '/dashboard/profile', icon: '👤' },
  ]

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">GG Dashboard</h1>
          <p className="text-sm text-gray-600 mt-1">Welcome back!</p>
        </div>
        
        <nav className="flex-1 p-4">
          {menuItems.map((item) => (
            <a
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-3 rounded-lg mb-2 transition-colors ${
                pathname === item.href
                  ? 'bg-blue-100 text-blue-600 border border-blue-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.name}
            </a>
          ))}
        </nav>
        
        <div className="p-4 border-t">
          <button
            onClick={signOut}
            className="w-full flex items-center px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <span className="mr-3">🚪</span>
            Logout
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">
              {menuItems.find(item => item.href === pathname)?.name || 'Dashboard'}
            </h2>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {user.email} ({role})
              </span>
              <Notifications />
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}