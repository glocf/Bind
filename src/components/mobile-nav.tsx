
'use client'

import * as React from 'react'
import Link from 'next/link'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { GunIcon } from '@/components/gun-icon'
import { type User } from '@supabase/supabase-js'

export function MobileNav({ user }: { user: User | null }) {
  const { openMobile, setOpenMobile } = useSidebar()
  
  if (!user) {
    return (
       <div className="md:hidden flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2">
          <GunIcon />
          <span className="font-bold">Bind</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="md:hidden flex items-center space-x-2">
      <SidebarTrigger className="h-8 w-8" />
      <Link href="/" className="flex items-center space-x-2" onClick={() => setOpenMobile(false)}>
        <GunIcon />
        <span className="font-bold">Bind</span>
      </Link>
    </div>
  )
}
