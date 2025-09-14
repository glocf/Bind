
'use client';

import * as React from 'react';
import Link from 'next/link';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Menu, X } from 'lucide-react';

const GunIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
        <path d="M14.5858 9.41421L18.8284 5.17157L20.2426 6.58579L16 10.8284L15.2929 11.5355L14.5858 12.2426L12.4645 14.364L13.1716 15.0711L14.5858 13.6569L19.5355 18.6066L18.1213 20.0208L13.1716 15.0711L11.7574 16.4853L10.3431 15.0711L3 22.4142L1.58579 21L8.92893 13.6569L7.51472 12.2426L6.10051 13.6569L4.68629 12.2426L9.63604 7.29289L10.3431 6.58579L11.7574 5.17157L14.5858 7.99999L14.5858 9.41421Z" fill="currentColor"/>
    </svg>
)

export function MobileNav() {
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <div className="flex justify-between items-center py-2 px-4 border-b">
             <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
                <div className="p-2 bg-primary rounded-md">
                    <GunIcon />
                </div>
                <span className="font-bold">Bind</span>
            </Link>
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
              <X className="h-5 w-5" />
              <span className="sr-only">Close Menu</span>
            </Button>
          </div>
          <div className="py-4">
            <nav className="grid gap-2">
              {/* Add mobile nav links here */}
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}
