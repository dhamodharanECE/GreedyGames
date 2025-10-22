'use client'

import React, { useRef } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '../src/app/lib/page'
import Image1 from '../public/photo.jpeg'
import Vetor from '../public/Vector.png'

interface User {
  id: string
  email: string
  user_metadata?: {
    name?: string
  }
}

interface ProfileFormProps {
  isOpen: boolean
  onClose: () => void
  user?: User | null
}

export default function ProfileForm({ isOpen, onClose, user }: ProfileFormProps) {
  const router = useRouter()
  const profilesRef = useRef<HTMLDivElement | null>(null)
  
  const handleSignOut = async () => {
    if (!supabase) {
      console.error('Supabase client not initialized');
      return;
    }

    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
        return
      }
      router.replace('/login')
    } catch (error: unknown) {
      console.error('Sign out error:', error)
    }
  }

  if (!isOpen) return null

  return (
    <div 
      ref={profilesRef} 
      className="w-96 bg-white border-l border-gray-200 p-6 fixed right-0 top-0 h-full shadow-lg z-50 flex flex-col transition-transform duration-300 ease-in-out"
    >
      {/* Header */} 
      <div className="flex justify-between items-center pb-4 border-b border-gray-200 mb-6">
        <h2 className="text-xl font-semibold text-gray-800">Profile</h2>
        <button 
          className="text-gray-400 hover:text-gray-600 text-2xl" 
          onClick={onClose}
        >
          ✕
        </button>
      </div>

      {/* Profile Image + Last Active */}
      <div className="flex items-center justify-start mb-6 space-x-3">
        <Image 
          src={Image1} 
          alt="Profile" 
          width={70} 
          height={70}
          className="rounded-full border-4 border-red-400"
        />
        <div className='space-y-2'>
          <div className="flex flex-col items-center bg-orange-300 border border-orange-200 rounded-2xl p-2 text-amber-700 space-y-2">
            <p className="text-sm">Super Admin</p>
          </div>
          <p className="text-sm text-gray-500 gap-1.5">
            Last active: {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} {new Date().toLocaleDateString()}
          </p>
        </div>
      </div>

      {/* Profile Info Inputs */}
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Username
          </label>
          <input 
            type="text" 
            defaultValue={user?.user_metadata?.name || ''} 
            className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-black-400 focus:outline-none" 
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-1">
            Email
          </label>
          <input 
            type="email" 
            defaultValue={user?.email || ''} 
            className="w-full border border-gray-300 rounded-lg p-2 cursor-not-allowed" 
            readOnly 
          />
        </div>
      </div>

      {/* Upload Button */}
      <div className="flex justify-center mb-6">
        <button className="bg-sky-100 text-green-400 px-6 py-2 rounded-lg font-medium shadow">
          Upload Profile
        </button>
      </div>

      {/* To-Do Stats */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="flex flex-col items-center bg-green-50 border border-green-200 rounded-xl p-3">
          <span className="text-lg font-bold text-green-600">3</span>
          <p className="text-sm text-gray-600">To-Do</p>
        </div>
        <div className="flex flex-col items-center bg-yellow-50 border border-yellow-200 rounded-xl p-3">
          <span className="text-lg font-bold text-yellow-600">4</span>
          <p className="text-sm text-gray-600">Pending</p>
        </div>
        <div className="flex flex-col items-center bg-blue-50 border border-blue-200 rounded-xl p-3">
          <span className="text-lg font-bold text-blue-600">2</span>
          <p className="text-sm text-gray-600">Completed</p>
        </div>
      </div>

      {/* Logout Button */}
      <div className="mt-auto">
        <button 
          onClick={handleSignOut} 
          className="w-full flex items-center justify-center gap-2 text-black py-2 rounded-lg font-semibold shadow"
        >
          <Image src={Vetor} alt="logout" width={20} height={20} />
          Logout
        </button>
      </div>
    </div>
  )
}