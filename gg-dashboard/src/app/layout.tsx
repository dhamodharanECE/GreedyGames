import './globals.css'
import { GoogleOAuthProvider } from '@react-oauth/google'
import React from "react";

const CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || '423505120145-o5jq29p73782bgt5a92c4c0i67a97719.apps.googleusercontent.com'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50">
        <GoogleOAuthProvider clientId={CLIENT_ID}>
          {children}
        </GoogleOAuthProvider>
      </body>
    </html>
  )
}