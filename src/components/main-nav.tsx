
import Link from 'next/link'
import { GunIcon } from '@/components/gun-icon'

export function MainNav() {
  return (
    <div className="hidden md:flex items-center space-x-2">
      <Link href="/" className="flex items-center space-x-2">
        <GunIcon />
        <span className="font-bold">Bind</span>
      </Link>
    </div>
  )
}
