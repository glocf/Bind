
'use client'

import { createClient } from '@/lib/supabase/client'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Suspense, useEffect, useState } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { trackProfileView } from '../account/actions'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Crown, Ghost, Gem, ShieldCheck, Sparkles, User } from "lucide-react";
import UserLinks from './user-links'
import type { Profile } from '@/lib/types'

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

function UserLinksWrapper({ userId }: { userId: string }) {
  const [links, setLinks] = useState<any[]>([]);
  const supabase = createClient();

  useEffect(() => {
    const fetchLinks = async () => {
      const { data } = await supabase
        .from('links')
        .select('*')
        .eq('user_id', userId)
        .order('order', { ascending: true })
      setLinks(data || []);
    }
    fetchLinks();
  }, [userId, supabase])
  

  return <UserLinks links={links || []} userId={userId} />
}

function ProfileClientView({ profile }: { profile: Profile }) {
  const [isEntered, setIsEntered] = useState(false);
  
  useEffect(() => {
    if (profile) {
      trackProfileView(profile.id);
    }
  }, [profile])

  const avatarPlaceholder = PlaceHolderImages.find(p => p.id === 'avatar-1')

  const backgroundStyle = profile.background_image_url
    ? { backgroundImage: `url(${profile.background_image_url})` }
    : { background: 'linear-gradient(to bottom, #100518, #08020c)' };

  const equippedBadges = profile.equipped_badges || [];
  const profileOpacity = profile.profile_opacity ?? 80;
  const profileBlur = profile.profile_blur ?? 10;
  
  const cardBackgroundColor = `hsla(var(--card), ${profileOpacity / 100})`;
  const cardBlur = `blur(${profileBlur}px)`;
  
  const handleEnter = () => {
    setIsEntered(true);
  }

  return (
    <>
      {/* Background */}
      <div
        className="absolute inset-0 w-full h-screen bg-background bg-cover bg-center -z-10"
        style={backgroundStyle}
      />
      <div className="absolute inset-0 w-full h-screen bg-black/30 -z-10" />
      
      {/* Enter Overlay */}
      <div
        onClick={handleEnter}
        className={`fixed inset-0 z-50 flex items-center justify-center text-white text-2xl font-semibold transition-all duration-1000 ease-in-out cursor-pointer ${isEntered ? 'opacity-0 invisible' : 'opacity-100 visible'}`}
        style={{
            backdropFilter: 'blur(16px)',
            backgroundColor: 'rgba(0,0,0,0.5)',
            WebkitBackdropFilter: 'blur(16px)',
        }}
      >
        <p className="animate-pulse">click to enter...</p>
      </div>

      {/* Main Content */}
      <div className={`flex flex-col min-h-screen text-white transition-opacity duration-1000 ${isEntered ? 'opacity-100' : 'opacity-0'}`}>
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
  );
}


export default function ProfilePage({ params }: ProfilePageProps) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('*')
        .eq('username', params.username)
        .single()
      
      if (data) {
        setProfile(data as Profile)
        // Preload background image
        if (data.background_image_url) {
          const img = new (window as any).Image();
          img.src = data.background_image_url;
          img.onload = () => setLoading(false);
          img.onerror = () => setLoading(false);
        } else {
          setLoading(false);
        }
      } else {
        setLoading(false);
        notFound()
      }
    }
    fetchProfile();
  }, [params.username])

  if (loading || !profile) {
    return (
        <div className="flex items-center justify-center min-h-screen bg-background">
            <div className="fixed inset-0 z-50 flex items-center justify-center text-white text-2xl font-semibold bg-black/80">
              <p className="animate-pulse">Loading...</p>
            </div>
        </div>
    );
  }

  return <ProfileClientView profile={profile} />;
}
