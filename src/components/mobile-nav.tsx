'use client'

import * as React from 'react'
import Link from 'next/link'
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar'
import { GunIcon } from '@/components/gun-icon'
import { type User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase/client'

export function MobileNav() {
  const { setOpenMobile } = useSidebar()
  const [user, setUser] = React.useState<User | null>(null);

  React.useEffect(() => {
    const checkUser = async () => {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    }
    checkUser();
  }, []);
  
  if (!user) {
    return (
       <div className="md:hidden flex items-center space-x-2">
        <Link href="/" className="flex items-center space-x-2 bg-card/50 border border-white/10 hover:bg-card/90 transition-colors px-3 py-1.5 rounded-full">
          <GunIcon />
          <span className="font-bold">Bind</span>
        </Link>
      </div>
    )
  }

  return (
    <div className="md:hidden flex items-center space-x-2">
      <SidebarTrigger className="h-8 w-8" />
      <Link href="/" className="flex items-center space-x-2 bg-card/50 border border-white/10 hover:bg-card/90 transition-colors px-3 py-1.5 rounded-full" onClick={() => setOpenMobile(false)}>
        <GunIcon />
        <span className="font-bold">Bind</span>
      </Link>
    </div>
  )
}
