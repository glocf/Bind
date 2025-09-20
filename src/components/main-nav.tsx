
'use client'

import Link from 'next/link'
import { cn } from '@/lib/utils'

export function MainNav() {
  return (
    <nav className="flex items-center space-x-6 text-sm font-medium">
      <Link
        href="#"
        className="transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Features
      </Link>
      <Link
        href="#"
        className="transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Pricing
      </Link>
      <Link
        href="#"
        className="transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Community
      </Link>
       <Link
        href="#"
        className="transition-colors hover:text-foreground/80 text-foreground/60"
      >
        Docs
      </Link>
    </nav>
  )
}
