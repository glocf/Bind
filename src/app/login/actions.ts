
'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

export async function signInWithPassword(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const supabase = createClient()

  console.log('Attempting to sign in with:')
  console.log('Email:', email)
  console.log('Password:', '********') // We log the password existence, but not the value for security

  if (!email || !password) {
    return { error: 'Email and password are required.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error('Supabase sign-in error:', error.message)
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
