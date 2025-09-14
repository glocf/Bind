
'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { z } from 'zod'

export async function signUp(formData: FormData) {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    const signupSchema = z.object({
      email: z.string().email({ message: 'Please enter a valid email address.' }),
      password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
      username: z.string().min(3, { message: 'Username must be at least 3 characters long.' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
    })

    const result = signupSchema.safeParse({ email, password, username })

    if (!result.success) {
      const errorMessages = result.error.errors.map(e => e.message).join(' ');
      return { error: errorMessages }
    }
    
    const supabase = createClient()

    // Check if username is already taken
    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

    if (existingProfile) {
        return { error: 'Username is already taken.' }
    }

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          full_name: username,
        }
      }
    })

    if (error) {
      // The handle_new_user trigger might fail if the username is already taken in a race condition.
      // Supabase auth might return a generic error, so we provide a helpful message.
      if (error.message.includes('duplicate key value violates unique constraint')) {
        return { error: 'This username is already taken. Please choose another one.'}
      }
      return { error: error.message }
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
