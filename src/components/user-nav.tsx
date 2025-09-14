
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { type User } from "@supabase/supabase-js"
import Link from "next/link"
import { type Profile } from "@/lib/types"

export function UserNav({ user, profile }: { user: User | null, profile: Profile | null}) {
  
  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">
            Login
        </Link>
        <Button asChild>
          <Link href="/signup">Sign Up Free</Link>
        </Button>
      </div>
    )
  }

  if (profile === null) {
     return (
       <Link href="/account">
           <Button>Dashboard</Button>
       </Link>
     )
  }

  return (
    <div className="flex items-center space-x-4">
      <span className="text-sm font-medium text-foreground/80 hidden sm:inline-block">
        {profile?.full_name || profile?.username}
      </span>
      <Link href="/account">
        <Avatar className="h-8 w-8">
          <AvatarImage src={profile?.avatar_url || ''} alt="User avatar" />
          <AvatarFallback>
            {(profile?.full_name || profile?.username || 'U').charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
      </Link>
    </div>
  )
}
