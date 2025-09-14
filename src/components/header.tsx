
'use server';

import { createClient } from '@/lib/supabase/server';
import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { MobileNav } from './mobile-nav';

export async function Header() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <MainNav />
        <MobileNav />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-1">
            {user ? <UserNav user={user} /> : null}
          </nav>
        </div>
      </div>
    </header>
  );
}
