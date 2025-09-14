
'use client'

import * as React from "react"
import Link from "next/link"
import { SidebarTrigger } from "@/components/ui/sidebar"

const GunIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary">
        <path d="M14.5858 9.41421L18.8284 5.17157L20.2426 6.58579L16 10.8284L15.2929 11.5355L14.5858 12.2426L12.4645 14.364L13.1716 15.0711L14.5858 13.6569L19.5355 18.6066L18.1213 20.0208L13.1716 15.0711L11.7574 16.4853L10.3431 15.0711L3 22.4142L1.58579 21L8.92893 13.6569L7.51472 12.2426L6.10051 13.6569L4.68629 12.2426L9.63604 7.29289L10.3431 6.58579L11.7574 5.17157L14.5858 7.99999L14.5858 9.41421Z" fill="currentColor"/>
    </svg>
)

export function MobileNav() {
  return (
    <div className="md:hidden flex items-center space-x-2">
        <SidebarTrigger />
        <Link href="/" className="flex items-center space-x-2">
            <GunIcon />
            <span className="font-bold">Bind</span>
        </Link>
    </div>
  )
}
