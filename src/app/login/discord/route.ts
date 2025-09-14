
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const supabase = createClient()
  
  const { searchParams } = new URL(request.url)
  const origin = searchParams.get('origin')

  const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'discord',
      options: {
        scopes: 'identify email',
        redirectTo: `${origin || process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      }
  })

  if (error) {
      return redirect(`/login?message=Could not authenticate with Discord: ${error.message}`)
  }

  return redirect(data.url)
}
