
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
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
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
          <div className="flex-1 overflow-y-auto">
            <Accordion type="multiple" defaultValue={['account']} className="w-full px-4">
              <AccordionItem value="account" className="border-b-0">
                <AccordionTrigger className="py-3 text-sm text-muted-foreground hover:no-underline [&[data-state=open]]:text-white rounded-md px-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold uppercase">account</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/account" className={cn("w-full", isActive('/account') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                        <SidebarMenuButton size="sm" variant="ghost" isActive={isActive('/account')} className="justify-start w-full">
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
                </AccordionContent>
              </AccordionItem>
            </Accordion>
            
            <SidebarMenu className="px-4 mt-2">
              <SidebarMenuItem>
                 <Link href="/account/customize" className={cn("w-full", isActive('/account/customize') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/customize')} className="justify-start w-full">
                      <Brush className="h-4 w-4 mr-2" /> customize
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/account/links" className={cn("w-full", isActive('/account/links') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/links')} className="justify-start w-full">
                      <Link2 className="h-4 w-4 mr-2" /> links
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/account/premium" className={cn("w-full", isActive('/account/premium') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/premium')} className="justify-start w-full">
                      <Diamond className="h-4 w-4 mr-2" /> premium
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
               <SidebarMenuItem>
                 <Link href="/account/image-host" className={cn("w-full", isActive('/account/image-host') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/image-host')} className="justify-start w-full">
                      <ImageUp className="h-4 w-4 mr-2" /> image host
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/account/templates" className={cn("w-full", isActive('/account/templates') ? 'text-white' : 'text-muted-foreground hover:text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/templates')} className="justify-start w-full">
                      <LayoutTemplate className="h-4 w-4 mr-2" /> templates
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

          <div className="p-4 mt-auto space-y-4">
             <div className="p-4 rounded-lg bg-card/80 border border-border">
                <p className="text-sm font-medium text-white mb-2">Have a question or need support?</p>
                <Button variant="secondary" className="w-full justify-start text-white" asChild>
                    <Link href="#">
                        <HelpCircle className="h-4 w-4 mr-2" /> Help Center
                    </Link>
                </Button>
            </div>
            {profile?.username && (
              <div className="p-4 rounded-lg bg-card/80 border border-border">
                  <p className="text-sm font-medium text-white mb-2">Check out your page</p>
                  <Button variant="default" className="w-full justify-start" asChild>
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
