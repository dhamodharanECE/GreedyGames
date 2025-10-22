'use client'
import React, { useState, useRef, useEffect } from 'react'
import { createSupabaseClient } from '../src/app/lib/config/page'

interface Notification {
  id: number
  message: string
  time: string
  isread?: boolean
}

export default function Notifications() {
  const [notifOpen, setNotifOpen] = useState(true)
  const notifRef = useRef<HTMLDivElement>(null)
  const [notification, setNotification] = useState<Notification[]>([])
  const [loading, setLoading] = useState(false);
  const [fetchError, setFetchError] = useState<string | null>(null);

  useEffect(() =>{
    const fetchData = async () => {
      setLoading(true);
      const { data, error } = await createSupabaseClient().from('notifications')
      .select();
      
      if(error){
        setFetchError("Could not fetch data from the server.");
        setNotification([]);
        console.log("Error fetching notifications:", error);
      }

      if(data){
        setNotification(data);
        setFetchError(null);
        console.log("Fetched notifications:", data);
      }
      setLoading(false);
    }
    fetchData();
  }, [])

  // Close notifications when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <>
      {/* Notifications Panel */}
      {notifOpen && (
        <div
          className="w-96 bg-white border-l border-gray-200 fixed right-0 top-0 h-full shadow-lg z-50 flex flex-col" 
          ref={notifRef}
        >
          {/* Header - Fixed */}
          <div className="flex-shrink-0 p-6 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
              <div className="flex gap-2">
                <button 
                  className="text-gray-400 hover:text-gray-600 text-2xl" 
                  onClick={() => setNotifOpen(false)}
                >
                  ✕
                </button>
              </div>
            </div>
          </div>
          
          {/* Content - Scrollable */}
          <div className="flex-1 overflow-y-auto p-6">
            {fetchError && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
                <p className="text-red-700 text-sm">{fetchError}</p>
              </div>
            )}
            
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : notification.length === 0 ? (
              <div className="text-center py-8">
                <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 17h5l-5 5v-5zM4.083 9h1.946c.089 0 .174.035.237.097l4.586 4.586a.336.336 0 00.475 0l4.586-4.586a.336.336 0 01.237-.097h1.946c.089 0 .174.035.237.097l.828.828a.336.336 0 01.097.237v6.728a.336.336 0 01-.097.237l-.828.828a.336.336 0 01-.237.097H4.083a.336.336 0 01-.237-.097l-.828-.828a.336.336 0 01-.097-.237V10.162c0-.089.035-.174.097-.237l.828-.828A.336.336 0 014.083 9z" />
                </svg>
                <p className="text-gray-500">No notifications yet.</p>
              </div>
            ) : (
              <ul className="space-y-3">
                {notification.map(notif => (
                  <li 
                    key={notif.id} 
                    className={`p-3 rounded-lg border cursor-pointer transition-colors ${
                      notif.isread 
                        ? 'bg-gray-50 border-gray-200' 
                        : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <p className="text-gray-700 text-sm">{notif.message}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-gray-400 text-xs">{notif.time}</span>
                      {!notif.isread && (
                        <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </>
  )
}