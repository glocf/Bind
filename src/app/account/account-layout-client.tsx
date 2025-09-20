
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  UserCog,
  Brush,
  Link2,
  Diamond,
  ImageUp,
  LayoutTemplate,
  BarChart2,
  Badge as BadgeIcon,
  Settings,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { type Profile } from '@/lib/types'
import { type User } from '@supabase/supabase-js'
import { UserNav } from '@/components/user-nav'

const menuItems = [
  { href: '/account', label: 'Overview', icon: UserCog },
  { href: '/account/analytics', label: 'Analytics', icon: BarChart2 },
  { href: '/account/links', label: 'Links', icon: Link2 },
  { href: '/account/customize', label: 'Customize', icon: Brush },
  { href: '/account/badges', label: 'Badges', icon: BadgeIcon },
  { href: '/account/premium', label: 'Premium', icon: Diamond },
  { href: '/account/settings', label: 'Settings', icon: Settings },
]

const AccountSidebar = ({ profile }: { profile: Profile | null }) => {
  const pathname = usePathname()

  return (
    <aside className="w-64 bg-black border-r border-zinc-800 p-4 flex-col hidden md:flex">
      <Link href="/" className="text-xl font-bold mb-8 flex items-center gap-2">
        ⚡ Bind
      </Link>
      <nav className="space-y-2 flex-grow">
        {menuItems.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary",
              pathname === href && "bg-primary/10 text-primary"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>
      <div className="space-y-4">
        <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
            <p className="text-sm font-medium text-white mb-2">Have a question?</p>
            <Button variant="secondary" className="w-full justify-start text-white" asChild>
                <Link href="#">
                    <HelpCircle className="h-4 w-4 mr-2" /> Help Center
                </Link>
            </Button>
        </div>
        {profile?.username && (
          <div className="p-4 rounded-lg bg-zinc-900 border border-zinc-800">
              <p className="text-sm font-medium text-white mb-2">Check out your page</p>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link href={`/${profile.username}`} target="_blank">
                    <ExternalLink className="h-4 w-4 mr-2" /> My Page
                </Link>
              </Button>
          </div>
        )}
      </div>
    </aside>
  );
};

export default function AccountLayoutClient({ children, user, profile }: { children: React.ReactNode, user:User, profile: Profile | null }) {
  return (
    <div className="flex min-h-screen bg-background text-white">
      <AccountSidebar profile={profile} />
      <div className="flex-1 flex flex-col">
          <header className="sticky top-0 z-40 border-b border-zinc-800 bg-background/80 backdrop-blur-lg">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-8">
               <div>
                  {/* Search bar can go here */}
               </div>
               <div className="flex items-center gap-4">
                  <UserNav />
               </div>
            </div>
         </header>
         <main className="flex-1 p-4 md:p-8 overflow-auto">
            {children}
         </main>
      </div>
    </div>
  )
}
