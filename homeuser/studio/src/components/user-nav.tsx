

'use client'

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { type User } from "@supabase/supabase-js"
import Link from "next/link"
import { type Profile } from "@/lib/types"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { signOut } from "@/app/login/actions"
import { LogOut, Settings, LayoutDashboard, Shield, User as UserIcon } from "lucide-react"
import { useRouter } from "next/navigation"


export function UserNav({ user, profile }: { user: User | null, profile: Profile | null}) {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOut();
    router.push('/login');
  }

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

  // This is a temporary check for development.
  // In a real app, roles would be managed in the database.
  if (user.email === 'camisitodecorazon@gmail.com') {
    profile.role = 'admin';
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <div className="flex items-center space-x-4 cursor-pointer">
            <span className="text-sm font-medium text-foreground/80 hidden sm:inline-block">
                {profile?.full_name || profile?.username}
            </span>
            <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url || ''} alt="User avatar" />
                <AvatarFallback>
                    {(profile?.full_name || profile?.username || 'U').charAt(0).toUpperCase()}
                </AvatarFallback>
            </Avatar>
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{profile.full_name || profile.username}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
         <DropdownMenuItem asChild>
          <Link href={`/${profile.username}`}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>View Profile</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account">
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/account/settings">
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </Link>
        </DropdownMenuItem>
        {profile.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin">
              <Shield className="mr-2 h-4 w-4" />
              <span>Admin</span>
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
