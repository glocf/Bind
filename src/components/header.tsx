import { createClient } from '@/lib/supabase/server'
import UserNav from './user-nav'
import Link from 'next/link'
import { Button } from './ui/button'

export default async function Header() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent">
      <div className="container flex h-16 max-w-screen-2xl items-center">
        <div className="mr-4 flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="font-bold text-lg text-white/90 hover:text-white transition-colors">LinkSmash</span>
          </Link>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-2">
          {user ? (
            <UserNav user={user} />
          ) : (
            <Button asChild variant="secondary">
              <Link href="/">Get Started</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}
