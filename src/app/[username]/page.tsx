
import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { trackProfileView } from '../account/actions'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown, Ghost, Gem, ShieldCheck, Sparkles, User } from "lucide-react";
import UserLinks from './user-links'

type ProfilePageProps = {
  params: {
    username: string
  }
}

const badgeMap: { [key: string]: { name: string, icon: React.ReactNode } } = {
  pioneer: { name: 'Pioneer', icon: <Crown className="h-4 w-4 text-amber-400" /> },
  verified: { name: 'Verified', icon: <ShieldCheck className="h-4 w-4 text-blue-500" /> },
  supporter: { name: 'Supporter', icon: <Gem className="h-4 w-4 text-purple-500" /> },
  creator: { name: 'Creator', icon: <User className="h-4 w-4 text-green-500" /> },
  'ai-enthusiast': { name: 'AI Enthusiast', icon: <Sparkles className="h-4 w-4 text-pink-500" /> },
  haunted: { name: 'Haunted', icon: <Ghost className="h-4 w-4 text-gray-400" /> },
};

function LinksSkeleton() {
  return (
    <div className="flex flex-col space-y-4">
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
      <Skeleton className="h-10 w-full" />
    </div>
  )
}

async function UserLinksWrapper({ userId }: { userId: string }) {
  const supabase = createClient()
  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', userId)
    .order('order', { ascending: true })

  return <UserLinks links={links || []} userId={userId} />
}


export async function generateMetadata({ params }: ProfilePageProps) {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, bio')
    .eq('username', params.username)
    .single()

  if (!profile) {
    return {
      title: 'Profile not found',
    }
  }

  return {
    title: `${profile.full_name || params.username} | Bind`,
    description: profile.bio || 'Check out my links!',
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', params.username)
    .single()

  if (!profile) {
    notFound()
  }

  // Track the profile view
  await trackProfileView(profile.id);

  const avatarPlaceholder = PlaceHolderImages.find(p => p.id === 'avatar-1')

  const backgroundStyle = profile.background_image_url
    ? { backgroundImage: `url(${profile.background_image_url})` }
    : {};

  const equippedBadges = profile.equipped_badges || [];

  const profileOpacity = profile.profile_opacity ?? 80;
  const profileBlur = profile.profile_blur ?? 10;
  
  const cardBackgroundColor = `hsla(var(--card), ${profileOpacity / 100})`;
  const cardBlur = `blur(${profileBlur}px)`;


  return (
    <>
      <div
        className="absolute inset-0 w-full h-screen bg-background bg-cover bg-center -z-10"
        style={backgroundStyle}
      />
      <div className="absolute inset-0 w-full h-screen bg-black/30 -z-10" />
      
      <div className="flex flex-col min-h-screen text-white">
        <main className="flex-grow flex items-center justify-center p-4">
          <div 
            className="w-full max-w-md mx-auto rounded-2xl shadow-2xl border border-white/20 p-8 text-center text-card-foreground"
            style={{ 
              backgroundColor: cardBackgroundColor,
              backdropFilter: cardBlur,
              WebkitBackdropFilter: cardBlur 
            }}
          >
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
              <AvatarImage src={profile.avatar_url || avatarPlaceholder?.imageUrl} alt={profile.full_name || profile.username || 'User avatar'} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {(profile.full_name || profile.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold font-headline">{profile.full_name || `@${profile.username}`}</h1>
              {equippedBadges.length > 0 && (
                <div className="flex items-center gap-1.5">
                  <TooltipProvider>
                    {equippedBadges.map(badgeId => {
                      const badge = badgeMap[badgeId];
                      if (!badge) return null;
                      return (
                        <Tooltip key={badgeId}>
                          <TooltipTrigger>{badge.icon}</TooltipTrigger>
                          <TooltipContent>
                            <p>{badge.name}</p>
                          </TooltipContent>
                        </Tooltip>
                      )
                    })}
                  </TooltipProvider>
                </div>
              )}
            </div>

            {profile.full_name && <p className="text-muted-foreground mb-4">@{profile.username}</p>}
            <p className="text-muted-foreground mt-2 mb-6">{profile.bio}</p>

            <Suspense fallback={<LinksSkeleton />}>
              <UserLinksWrapper userId={profile.id} />
            </Suspense>
          </div>
        </main>
      </div>
    </>
  )
}
