'use client'

import { GoogleOAuthProvider as GoogleProvider } from '@react-oauth/google'
import React from "react";

interface GoogleOAuthProviderProps {
  children: React.ReactNode
  clientId: string
}

export default function GoogleOAuthProvider({ children, clientId }: GoogleOAuthProviderProps) {
  return (
    <GoogleProvider clientId={clientId}>
      {children}
    </GoogleProvider>
  )
}