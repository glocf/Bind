
'use server'

import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { redirect } from 'next/navigation'

export async function signUp(formData: FormData): Promise<{ error?: string, success?: boolean }> {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    const signupSchema = z.object({
      email: z.string().email({ message: 'Please enter a valid email address.' }),
      password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
      username: z.string()
        .min(3, { message: 'Username must be at least 3 characters long.' })
        .max(12, { message: 'Username must be 12 characters or less.' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
    })

    const result = signupSchema.safeParse({ email, password, username })

    if (!result.success) {
      const errorMessages = result.error.errors.map(e => e.message).join(' ');
      return { error: errorMessages }
    }
    
    const supabase = createClient()

    const { data: existingProfile } = await supabase
        .from('profiles')
        .select('id')
        .eq('username', username)
        .single()

    if (existingProfile) {
        return { error: 'Username is already taken.' }
    }

    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          full_name: username,
        }
      }
    })

    if (signUpError) {
      return { error: signUpError.message }
    }

    return { success: true }
}

    