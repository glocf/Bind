
'use client'

import * as React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
  SidebarInset,
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
  Badge,
  Settings,
  HelpCircle,
  ExternalLink,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import Header from '@/components/header'
import { createClient } from '@/lib/supabase/client'
import { type Profile } from '@/lib/types'

const AccountSidebar = () => {
  const pathname = usePathname()
  const supabase = createClient()
  const [profile, setProfile] = React.useState<Profile | null>(null)

  React.useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if(user) {
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()
        if (data) setProfile(data)
      }
    }
    fetchProfile()
  }, [supabase])

  const isActive = (path: string) => pathname === path

  return (
    <Sidebar>
      <SidebarContent className="p-0">
        <div className="flex h-full flex-col">
          <div className="flex-1 overflow-y-auto">
            <Accordion type="multiple" defaultValue={['account']} className="w-full px-4">
              <AccordionItem value="account" className="border-b-0">
                <AccordionTrigger className="py-3 text-white hover:no-underline [&[data-state=open]]:bg-primary/10 rounded-md px-3">
                  <div className="flex items-center gap-3">
                    <UserCog className="h-5 w-5" />
                    <span className="font-semibold">account</span>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2">
                  <SidebarMenu>
                    <SidebarMenuItem>
                      <Link href="/account" className={cn("w-full", isActive('/account') ? 'text-primary' : 'text-muted-foreground hover:text-white')}>
                        <SidebarMenuButton size="sm" variant="ghost" isActive={isActive('/account')} className="justify-start w-full">
                          Overview
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                       <Link href="/account/analytics" className={cn("w-full", isActive('/account/analytics') ? 'text-primary' : 'text-muted-foreground hover:text-white')}>
                        <SidebarMenuButton size="sm" variant="ghost" isActive={isActive('/account/analytics')} className="justify-start w-full">
                           <BarChart2 className="inline-block mr-2 h-4 w-4" /> Analytics
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                       <Link href="/account/badges" className={cn("w-full", isActive('/account/badges') ? 'text-primary' : 'text-muted-foreground hover:text-white')}>
                        <SidebarMenuButton size="sm" variant="ghost" isActive={isActive('/account/badges')} className="justify-start w-full">
                          <Badge className="inline-block mr-2 h-4 w-4" /> Badges
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                    <SidebarMenuItem>
                       <Link href="/account/settings" className={cn("w-full", isActive('/account/settings') ? 'text-primary' : 'text-muted-foreground hover:text-white')}>
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
                 <Link href="/account/customize" className={cn("w-full", isActive('/account/customize') ? 'text-primary' : 'text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/customize')} className="justify-start w-full font-semibold">
                      <Brush className="h-5 w-5" /> customize
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/account/links" className={cn("w-full", isActive('/account/links') ? 'text-primary' : 'text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/links')} className="justify-start w-full font-semibold">
                      <Link2 className="h-5 w-5" /> links
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/account/premium" className={cn("w-full", isActive('/account/premium') ? 'text-primary' : 'text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/premium')} className="justify-start w-full font-semibold">
                      <Diamond className="h-5 w-5" /> premium
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
               <SidebarMenuItem>
                 <Link href="/account/image-host" className={cn("w-full", isActive('/account/image-host') ? 'text-primary' : 'text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/image-host')} className="justify-start w-full font-semibold">
                      <ImageUp className="h-5 w-5" /> image host
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                 <Link href="/account/templates" className={cn("w-full", isActive('/account/templates') ? 'text-primary' : 'text-white')}>
                    <SidebarMenuButton variant="ghost" isActive={isActive('/account/templates')} className="justify-start w-full font-semibold">
                      <LayoutTemplate className="h-5 w-5" /> templates
                    </SidebarMenuButton>
                 </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </div>

          <div className="p-4 mt-auto">
             <div className="p-4 rounded-lg bg-card/80 border border-border">
                <p className="text-sm font-medium text-white mb-2">Have a question or need support?</p>
                <Button variant="secondary" className="w-full justify-start bg-zinc-800 hover:bg-zinc-700 text-white" asChild>
                    <Link href="#">
                        <HelpCircle className="h-4 w-4 mr-2" /> Help Center
                    </Link>
                </Button>
            </div>
            <div className="p-4 mt-2 rounded-lg bg-card/80 border border-border">
                <p className="text-sm font-medium text-white mb-2">Check out your page</p>
                <Button variant="default" className="w-full justify-start" asChild>
                   <Link href={`/${profile?.username || ''}`} target="_blank">
                     <ExternalLink className="h-4 w-4 mr-2" /> My Page
                   </Link>
                </Button>
            </div>
          </div>
        </div>
      </SidebarContent>
    </Sidebar>
  );
};


export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <div className="flex flex-1">
        <AccountSidebar />
        <main className="flex-grow">
          {children}
        </main>
      </div>
    </div>
  )
}
