
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  
  const { searchParams, origin } = new URL(request.url)

  const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        scopes: 'identify email',
        redirectTo: `${origin}/auth/callback`,
      }
  })

  if (error) {
      console.error('Discord OAuth Error:', error.message)
      return redirect(`/login?message=Could not authenticate with Discord. Please try again.`)
  }

  return redirect(data.url)
}
