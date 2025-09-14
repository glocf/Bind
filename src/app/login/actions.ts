
'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInWithPassword(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  if (!username || !password) {
    return { error: 'Username and password are required.' }
  }

  // Find user by username to get their email
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    // Generic error to prevent username enumeration
    return { error: 'Invalid login credentials.' }
  }
  
  // This is a protected call that requires the service_role key to be set in Supabase server client.
  // It's safe to use in Server Actions.
  const { data: user, error: userError } = await supabase.auth.admin.getUserById(profile.id)

  if (userError || !user?.user?.email) {
    return { error: 'Could not retrieve user information.' }
  }
  
  const email = user.user.email

  // Sign in with the found email and provided password
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Provide a generic error message for security
    return { error: 'Invalid login credentials.' }
  }

  return { success: true }
}

export async function signInWithDiscord() {
  const supabase = createClient()
  const origin = headers().get('origin')
  const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
          redirectTo: `${origin}/auth/callback`,
      },
  })

  if (error) {
      return redirect(`/login?message=Could not authenticate with Discord: ${error.message}`)
  }

  return redirect(data.url)
}

    
