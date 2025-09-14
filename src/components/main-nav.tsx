'use client'

import Link from 'next/link'
import { GunIcon } from '@/components/gun-icon'
import { cn } from '@/lib/utils'

export function MainNav() {
  return (
    <div suppressHydrationWarning className="hidden md:flex items-center space-x-6">
      <Link href="/" className="flex items-center space-x-2">
        <GunIcon />
        <span className="font-bold">Bind</span>
      </Link>
      <nav className="flex items-center space-x-6 text-sm font-medium">
        <Link
          href="#"
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          Help Center
        </Link>
        <Link
          href="#"
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          Discord
        </Link>
        <Link
          href="#"
          className="transition-colors hover:text-foreground/80 text-foreground/60"
        >
          Pricing
        </Link>
      </nav>
    </div>
  )
}
