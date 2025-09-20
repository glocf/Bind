
'use client'

import { MainNav } from './main-nav';
import { UserNav } from './user-nav';
import { MobileNav } from './mobile-nav';
import Link from 'next/link';
import { GunIcon } from './gun-icon';

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <GunIcon />
            <span className="font-bold hidden sm:inline-block">Bind</span>
          </Link>
          <div className="hidden md:flex">
            <MainNav />
          </div>
        </div>
        
        <div className="flex items-center justify-end space-x-4">
          <div className="md:hidden">
            <MobileNav />
          </div>
          <UserNav />
        </div>
      </div>
    </header>
  );
}
