import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallback() {
  const navigate = useNavigate()
  console.log('Auth callback component mounted, URL:', window.location.href)

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the URL hash
        const hash = window.location.hash
        console.log('Processing callback with hash:', hash)

        // Check current session
        const { data: { session }, error: sessionError } = await supabase.auth.getSession()
        console.log('Session check:', { session: session?.user?.id, error: sessionError })

        if (session) {
          console.log('Valid session found, redirecting to home')
          navigate('/', { replace: true })
        } else {
          console.log('No session found')
        }
      } catch (error) {
        console.error('Error in auth callback:', error)
      }
    }

    handleCallback()

    // Set up auth state listener
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', { event, userId: session?.user?.id })
      if (event === 'SIGNED_IN') {
        navigate('/', { replace: true })
      }
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [navigate])

  return <div>Completing sign in...</div>
} 