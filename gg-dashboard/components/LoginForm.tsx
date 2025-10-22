'use client'
import Image from 'next/image'
import loginImage from '../public/login.png'
import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClient  } from '../src/supabase/client/page'
import Link from 'next/link'
import { SupabaseClient } from '@supabase/supabase-js'

export default function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [checkingAuth, setCheckingAuth] = useState(true)
  const [supabase, setSupabase] = useState<SupabaseClient | null>(null)
  const router = useRouter()
  
  // Initialize Supabase only on client side
  useEffect(() => {
    const client = createClient()
    setSupabase(client)
  }, [])

  const checkAuthState = useCallback(async () => {
    if (!supabase) return
    
    try {
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        console.log('User already logged in, redirecting to dashboard')
        router.replace('/dashboard')
      }
    } catch (error) {
      console.error('Error checking auth state:', error)
    } finally {
      setCheckingAuth(false)
    }
  }, [supabase, router])

  useEffect(() => {
    if (supabase) {
      checkAuthState()
    }
  }, [supabase, checkAuthState])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!supabase) {
      setMessage('Client not initialized. Please refresh the page.')
      return
    }
    
    setLoading(true)
    setMessage('')

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ 
        email, 
        password 
      })
      
      if (error) {
        if (error.message.includes('Email not confirmed')) {
          setMessage('Please check your email and confirm your account before logging in.')
        } else {
          setMessage(error.message)
        }
      } else {
        console.log('Email login successful')
        console.log('Email confirmed:', data.user?.email_confirmed_at)
        
        if (!data.user?.email_confirmed_at) {
          setMessage('Welcome! Please check your email to confirm your account for full access.')
        }
        
        router.replace('/dashboard')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    if (!supabase) {
      setMessage('Client not initialized. Please refresh the page.')
      return
    }
    
    setGoogleLoading(true)
    setMessage('')
    
    try {
      console.log('🔄 Starting Google OAuth...')
      await supabase.auth.signOut()
      if (typeof window !== 'undefined') {
        console.log('🧹 Clearing ALL localStorage...')
        localStorage.clear()
        sessionStorage.clear()
      }
      await new Promise(resolve => setTimeout(resolve, 100))

      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      if (error) {
        console.error('❌ Google OAuth error:', error)
        
        if (error.message?.includes('Unsupported provider')) {
          setMessage('Google OAuth is not enabled. Please check your Supabase project settings.')
        } else {
          setMessage(`Google login failed: ${error.message}`)
        }
      } else {
        console.log('✅ Google OAuth initiated successfully')
      }
    } catch (error: unknown) {
      console.error('💥 Google OAuth exception:', error)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessage(`Google login error: ${errorMessage}`)
    } finally {
      setGoogleLoading(false)
    }
  }

  const handleForgotPassword = async () => {
    if (!supabase) {
      setMessage('Client not initialized. Please refresh the page.')
      return
    }
    
    if (!email) {
      setMessage('Please enter your email address to reset password')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        setMessage(error.message)
      } else {
        setMessage('Password reset email sent! Check your inbox.')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessage(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleResendConfirmation = async () => {
    if (!supabase) {
      setMessage('Client not initialized. Please refresh the page.')
      return
    }
    
    if (!email) {
      setMessage('Please enter your email address to resend confirmation')
      return
    }

    setLoading(true)
    setMessage('')

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
      })

      if (error) {
        setMessage(`Failed to resend confirmation: ${error.message}`)
      } else {
        setMessage('Confirmation email sent! Please check your inbox.')
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred'
      setMessage(`Error: ${errorMessage}`)
    } finally {
      setLoading(false)
    }
  }

  // Clear browser cache function
  const clearBrowserCache = () => {
    if (typeof window !== 'undefined') {
      localStorage.clear()
      sessionStorage.clear()
      setMessage('Browser cache cleared! Please try logging in again.')
    }
  }

  // Show loading while checking auth state OR before supabase is initialized
  if (checkingAuth || !supabase) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="hidden lg:flex lg:flex-1 relative">
        <Image
          src={loginImage}
          alt="Background"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-white overflow-hidden">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-xl font-bold text-gray-900 ">GREEDYGAME</h1>
            <h2 className="text-xl font-semibold text-gray-800">Welcome to GGTodo</h2>
            <p className="text-gray-600">To get started, please sign in</p>
          </div>

          <button
            onClick={handleGoogleAuth}
            disabled={googleLoading || loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-gray-300 rounded-lg text-gray-700 bg-white hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            {googleLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            {googleLoading ? 'Redirecting to Google...' : 'Log in with Google'}
          </button>

          <div className="relative py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-3 bg-white text-gray-500">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Enter your registered email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                disabled={loading || googleLoading}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password *
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors placeholder-gray-400"
                disabled={loading || googleLoading}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  disabled={loading || googleLoading}
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>

              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading || googleLoading}
                className="text-sm text-blue-600 hover:text-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Forgot Password?
              </button>
            </div>

            {/* Message Display */}
            {message && (
              <div className={`p-3 rounded-lg border ${
                message.includes('failed') || message.includes('error') || message.includes('canceled') || message.includes('expired') || message.includes('not initialized')
                  ? 'bg-red-50 border-red-200 text-red-600'
                  : message.includes('sent') || message.includes('Welcome')
                  ? 'bg-green-50 border-green-200 text-green-600'
                  : message.includes('confirm')
                  ? 'bg-yellow-50 border-yellow-200 text-yellow-600'
                  : 'bg-blue-50 border-blue-200 text-blue-600'
              }`}>
                <p className="text-sm">{message}</p>
                
                {/* Show resend button for email confirmation issues */}
                {message.includes('confirm') && !message.includes('sent') && (
                  <div className="mt-2">
                    <button
                      onClick={handleResendConfirmation}
                      disabled={loading}
                      className="text-sm bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 disabled:opacity-50 transition-colors"
                    >
                      Resend Confirmation Email
                    </button>
                  </div>
                )}
                
                {/* Show clear cache instructions for PKCE errors */}
                {message.includes('clear your browser cache') && (
                  <div className="mt-2">
                    <button
                      onClick={clearBrowserCache}
                      className="text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition-colors"
                    >
                      Clear Browser Cache Now
                    </button>
                    <p className="text-xs mt-1 text-red-700">
                      Or press Ctrl+Shift+Delete and clear cached files
                    </p>
                  </div>
                )}
                
                {message.includes('not enabled') && (
                  <p className="text-xs mt-1">
                    Please enable Google OAuth in your Supabase project settings under Authentication → Providers.
                  </p>
                )}
              </div>
            )}

            {/* Login Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={loading || googleLoading}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium shadow-sm"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Signing in...
                  </span>
                ) : (
                  'Login'
                )}
              </button>
            </div>
            <div className="text-center pt-3">
              <p className="text-sm text-gray-600">
                Don&apos;t have an account?{' '}
                <Link 
                  href="/signup" 
                  className="text-blue-600 hover:text-blue-500 font-medium transition-colors"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}