
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
} from '@/components/ui/sidebar'
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
import { Header } from '@/components/header'
import { type Profile } from '@/lib/types'
import { type User } from '@supabase/supabase-js'

const AccountSidebar = ({ profile }: { profile: Profile | null }) => {
  const pathname = usePathname()
  const isActive = (path: string) => pathname === path

  return (
    <Sidebar>
      <SidebarContent className="p-0">
        <div suppressHydrationWarning className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="space-y-1">
                <p className="text-xs uppercase text-muted-foreground font-semibold tracking-wider px-2">Account</p>
                <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/account" className={cn("w-full", isActive('/account') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                        <SidebarMenuButton size="sm" variant="ghost" isActive={isActive('/account')} className="justify-start w-full font-semibold">
                          <UserCog className="inline-block mr-2 h-4 w-4" /> Overview
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                       <Link href="/account/analytics" className={cn("w-full", isActive('/account/analytics') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                        <SidebarMenuButton size="sm" variant="ghost" isActive={isActive('/account/analytics')} className="justify-start w-full">
                           <BarChart2 className="inline-block mr-2 h-4 w-4" /> Analytics
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                       <Link href="/account/badges" className={cn("w-full", isActive('/account/badges') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                        <SidebarMenuButton size="sm" variant="ghost" isActive={isActive('/account/badges')} className="justify-start w-full">
                          <BadgeIcon className="inline-block mr-2 h-4 w-4" /> Badges
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                       <Link href="/account/settings" className={cn("w-full", isActive('/account/settings') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                        <SidebarMenuButton size="sm" variant="ghost" isActive={isActive('/account/settings')} className="justify-start w-full">
                           <Settings className="inline-block mr-2 h-4 w-4" /> Settings
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  </SidebarMenu>
              </div>
            
            <SidebarMenu className="space-y-1">
              <SidebarMenuItem>
                 <Link href="/account/customize" className={cn("w-full", isActive('/account/customize') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/customize')} className="justify-start w-full font-semibold">
                      <Brush className="h-4 w-4 mr-2" /> Customize
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/account/links" className={cn("w-full", isActive('/account/links') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/links')} className="justify-start w-full font-semibold">
                      <Link2 className="h-4 w-4 mr-2" /> Links
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/account/premium" className={cn("w-full", isActive('/account/premium') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/premium')} className="justify-start w-full font-semibold">
                      <Diamond className="h-4 w-4 mr-2" /> Premium
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
               <SidebarMenuItem>
                 <Link href="/account/image-host" className={cn("w-full", isActive('/account/image-host') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/image-host')} className="justify-start w-full font-semibold">
                      <ImageUp className="h-4 w-4 mr-2" /> Image Host
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/account/templates" className={cn("w-full", isActive('/account/templates') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/templates')} className="justify-start w-full font-semibold">
                      <LayoutTemplate className="h-4 w-4 mr-2" /> Templates
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

          <div className="p-4 mt-auto space-y-4">
             <div className="p-4 rounded-lg bg-card">
                <p className="text-sm font-medium text-white mb-2">Have a question or need support?</p>
                <Button variant="outline" className="w-full justify-start text-white" asChild>
                    <Link href="#">
                        <HelpCircle className="h-4 w-4 mr-2" /> Help Center
                    </Link>
                </Button>
            </div>
            {profile?.username && (
              <div className="p-4 rounded-lg bg-card">
                  <p className="text-sm font-medium text-white mb-2">Check out your page</p>
                  <Button variant="primary" className="w-full justify-start" asChild>
                    <Link href={`/${profile.username}`} target="_blank">
                        <ExternalLink className="h-4 w-4 mr-2" /> My Page
                    </Link>
                  </Button>
              </div>
            )}
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};

export default function AccountLayoutClient({ children, user, profile }: { children: React.ReactNode, user:User, profile: Profile | null }) {
  return (
    <SidebarProvider>
      <div suppressHydrationWarning className="flex flex-col min-h-screen">
        <Header />
        <div className="flex flex-1">
          <AccountSidebar profile={profile} />
          <main className="flex-grow bg-background">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  )
}
