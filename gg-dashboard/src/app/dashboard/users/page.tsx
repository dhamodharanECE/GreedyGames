'use client'

import UserTable from '../../../../components/UserTable'
import { useAuth } from '../../../../hooks/useAuth'
import { redirect } from 'next/navigation'

export default function UsersPage() {
  const { role, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (role !== 'superuser') {
    redirect('/dashboard/todos')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <p className="text-gray-600 mt-1">Manage user roles and permissions</p>
      </div>
      <UserTable />
    </div>
  )
}