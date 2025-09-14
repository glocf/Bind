
'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { getIconForUrl } from '@/components/icons'
import type { Link as LinkType } from '@/lib/types'
import { trackLinkClick } from '../account/actions'

export default function UserLinks({ links, userId }: { links: LinkType[], userId: string }) {
  const router = useRouter();

  const handleLinkClick = async (link: LinkType) => {
    await trackLinkClick(link.id, userId);
    router.push(link.url);
  };

  return (
    <div className="flex flex-col space-y-4">
      {links.map((link: LinkType) => {
        const Icon = getIconForUrl(link.url);
        return (
          <Button
            key={link.id}
            onClick={() => handleLinkClick(link)}
            className="w-full justify-start transition-transform duration-200 hover:scale-105"
            variant="secondary"
          >
              <Icon className="mr-4" />
              {link.title}
          </Button>
        );
      })}
    </div>
  );
}
