
'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { createClient } from "@/lib/supabase/client"
import { type User } from "@supabase/supabase-js"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { type Profile } from "@/lib/types"

export function UserNav({ user }: { user: User | null }) {
  const router = useRouter()
  const supabase = createClient()
  const [profile, setProfile] = useState<Profile | null>(null)

  useEffect(() => {
    if (user) {
      const fetchProfile = async () => {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) setProfile(data)
      }
      fetchProfile()
    }
  }, [user, supabase])

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  if (!user) {
    return (
      <div className="flex items-center space-x-4">
        <Link href="/login" className="text-sm font-medium transition-colors hover:text-foreground/80 text-foreground/60">
            Login
        </Link>
        <Link href="/signup">
            <Button>Sign Up Free</Button>
        </Link>
      </div>
    )
  }

  return (
    <Link href="/account">
        <Button>Dashboard</Button>
    </Link>
  )
}
