'use client'

import ProfileForm from '../../../../components/ProfileForm'

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Profile Settings</h1>
        <p className="text-gray-600 mt-1">Manage your account information</p>
      </div>
      <div className="max-w-2xl">
        <ProfileForm />
      </div>
    </div>
  )
}