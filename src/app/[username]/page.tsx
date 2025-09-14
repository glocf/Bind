import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { getIconForUrl } from '@/components/icons'
import { PlaceHolderImages } from '@/lib/placeholder-images'
import { Header } from '@/components/header'

type ProfilePageProps = {
  params: {
    username: string
  }
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

  const { data: links } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', profile.id)
    .order('order', { ascending: true })

  const avatarPlaceholder = PlaceHolderImages.find(p => p.id === 'avatar-1')

  const backgroundStyle = profile.background_image_data_uri
    ? { backgroundImage: `url(${profile.background_image_data_uri})` }
    : {};

  return (
    <>
      <div
        className="absolute inset-0 w-full h-screen bg-background bg-cover bg-center -z-10"
        style={backgroundStyle}
      />
      <div className="absolute inset-0 w-full h-screen bg-black/30 -z-10" />
      
      <div className="flex flex-col min-h-screen text-white">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          <div className="w-full max-w-md mx-auto bg-card/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20 p-8 text-center text-card-foreground">
            <Avatar className="w-24 h-24 mx-auto mb-4 border-4 border-primary">
              <AvatarImage src={profile.avatar_url || avatarPlaceholder?.imageUrl} alt={profile.full_name || profile.username || 'User avatar'} />
              <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                {(profile.full_name || profile.username || 'U').charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <h1 className="text-2xl font-bold font-headline">{profile.full_name || `@${profile.username}`}</h1>
            {profile.full_name && <p className="text-muted-foreground mb-4">@{profile.username}</p>}
            <p className="text-muted-foreground mt-2 mb-6">{profile.bio}</p>

            <div className="flex flex-col space-y-4">
              {links?.map(link => {
                const Icon = getIconForUrl(link.url)
                return (
                  <Button
                    key={link.id}
                    asChild
                    className="w-full justify-start transition-transform duration-200 hover:scale-105"
                    variant="secondary"
                  >
                    <a href={link.url} target="_blank" rel="noopener noreferrer">
                      <Icon className="mr-4" />
                      {link.title}
                    </a>
                  </Button>
                )
              })}
            </div>
          </div>
        </main>
      </div>
    </>
  )
}
