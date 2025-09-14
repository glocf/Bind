'use client'

import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { MobileNav } from './mobile-nav';
import { type User } from '@supabase/supabase-js';
import { type Profile } from '@/lib/types';

export function Header({user, profile}: {user?:User | null, profile?: Profile | null}) {
  return (
    <header suppressHydrationWarning className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav user={user} />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            <UserNav user={user} profile={profile} />
          </nav>
        </div>
      </div>
    </header>
  );
}
