
'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInWithPassword(formData: FormData) {
  const username = formData.get('username') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  if (!username) {
    return { error: 'Username is required.' }
  }

  // Find user by username
  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()

  if (profileError || !profile) {
    return { error: 'Invalid login credentials.' }
  }

  const { data: user, error: userError } = await supabase.auth.admin.getUserById(profile.id)

  if (userError || !user.user.email) {
    return { error: 'Could not retrieve user information.' }
  }

  const email = user.user.email

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

    