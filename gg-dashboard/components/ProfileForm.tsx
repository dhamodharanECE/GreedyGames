'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'

export default function ProfileForm() {
  const { user, profile } = useAuth()
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (profile) {
      setName(profile.name || '')
    }
  }, [profile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase
        .from('profiles')
        .update({ name: name.trim() })
        .eq('id', user.id)

      if (error) throw error

      setMessage('Profile updated successfully!')
    } catch (error) {
      console.error('Error updating profile:', error)
      setMessage('Error updating profile. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Profile"
                className="w-16 h-16 rounded-full"
              />
            ) : (
              <span className="text-2xl text-blue-600 font-semibold">
                {profile?.name?.[0]?.toUpperCase() || user?.email?.[0]?.toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              {profile?.name || 'No name set'}
            </h2>
            <p className="text-gray-600">{user?.email}</p>
            <p className="text-sm text-gray-500 capitalize">{profile?.role}</p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
            Display Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter your display name"
          />
        </div>

      <div>
  <label htmlFor="email-display" className="block text-sm font-medium text-gray-700 mb-2">
    Email Address
  </label>
  <input
    id="email-display"
    name="email-display"
    type="email"
    value={user?.email || 'No email available'}
    disabled
    aria-disabled="true"
    aria-describedby="email-help"
    title="Email address cannot be changed"
    placeholder="Email address will appear here"
    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-gray-600 cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-200"
  />
  <p id="email-help" className="mt-1 text-sm text-gray-500">
    Email address cannot be changed. Contact support if you need to update your email.
  </p>
</div>

        {message && (
          <div className={`p-3 rounded-md ${
            message.includes('successfully') 
              ? 'bg-green-50 text-green-800 border border-green-200' 
              : 'bg-red-50 text-red-800 border border-red-200'
          }`}>
            {message}
          </div>
        )}

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </div>
      </form>
    </div>
  )
}