
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

  // Step 1: Call a secure database function to get the user's email from their username.
  const { data: emailData, error: rpcError } = await supabase.rpc('get_email_by_username', { p_username: username });

  if (rpcError || !emailData) {
    // Return a generic error to prevent username enumeration.
    return { error: 'Invalid login credentials.' };
  }

  const email = emailData as string;

  // Step 2: Sign in with the retrieved email and the provided password.
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (signInError) {
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
