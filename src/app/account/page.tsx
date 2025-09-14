
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { type Profile } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle, Diamond, Eye, Hash, Link as LinkIcon, LogOut, PenSquare, Shield, User, UserCog, X } from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'
import { AccountForm } from './account-form'
import { Separator } from '@/components/ui/separator'

async function AccountPageContent() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { count: viewCount } = await supabase
    .from('analytics')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .eq('event_type', 'profile_view')

  const discordIdentity = user.identities?.find(i => i.provider === 'discord');

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-semibold mb-4">Account Overview</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card/50 border-white/10">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Username</span>
                        <PenSquare className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{profile?.username || 'N/A'}</p>
                    <p className="text-xs text-green-400 mt-1">Change available now</p>
                </CardContent>
            </Card>
            <Card className="bg-card/50 border-white/10">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Alias</span>
                        <User className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold mt-2">Unavailable</p>
                    <p className="text-xs text-muted-foreground mt-1">Premium Only</p>
                </CardContent>
            </Card>
            <Card className="bg-card/50 border-white/10">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">UID</span>
                        <Hash className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{user.id.substring(0, 8)}</p>
                    <p className="text-xs text-muted-foreground mt-1">Joined after 85% of all users</p>
                </CardContent>
            </Card>
            <Card className="bg-card/50 border-white/10">
                <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                        <span className="text-sm text-muted-foreground">Profile Views</span>
                        <Eye className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <p className="text-2xl font-bold mt-2">{viewCount ?? 0}</p>
                    <p className="text-xs text-muted-foreground mt-1">+0 views since last 7 days</p>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <div className="max-w-full mx-auto bg-card/50 rounded-xl border border-white/10">
              {user && <AccountForm user={user} profile={profile} />}
            </div>
        </div>

        <div className="space-y-8">
           <div>
              <h2 className="text-2xl font-semibold mb-4">Manage your account</h2>
              <Card className="bg-card/50 border-white/10">
                <CardContent className="p-6 space-y-3">
                  <p className="text-sm text-muted-foreground">Change your email, username and more.</p>
                  <Button variant="secondary" className="w-full justify-start"><PenSquare className="mr-2 h-4 w-4" />Change Username</Button>
                  <Button variant="secondary" className="w-full justify-start"><UserCog className="mr-2 h-4 w-4" />Change Display Name</Button>
                  <Button variant="default" className="w-full justify-start bg-primary/80 hover:bg-primary"><Diamond className="mr-2 h-4 w-4" />Want more? Unlock with Premium</Button>
                  <Button variant="secondary" className="w-full justify-start"><LogOut className="mr-2 h-4 w-4" />Account Settings</Button>
                </CardContent>
              </Card>
           </div>
           <div>
              <h2 className="text-2xl font-semibold mb-4">Connections</h2>
               <Card className="bg-card/50 border-white/10">
                 <CardContent className="p-6">
                    <p className="text-sm text-muted-foreground mb-4">Link your Discord account to guns.lol</p>
                     {discordIdentity ? (
                        <div className="flex items-center justify-between p-3 rounded-md bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-3">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400">
                                    <title>Discord</title>
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8852-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6667 1.2835a18.2976 18.2976 0 00-5.3224 0c-.2203-.459-.4557-.9082-.6667-1.2835a.0741.0741 0 00-.0785-.0371a19.7913 19.7913 0 00-4.8852 1.5152.069.069 0 00-.0321.0256c-1.843 3.1417-2.6816 5.9262-2.6816 8.6144a16.4926 16.4926 0 005.0614 11.7854.07.07 0 00.087.0012c.3176-.1738.6218-.38.9161-.6248a.0741.0741 0 00.0116-.087c-.1889-.3203-.3718-.6476-.5478-.9818a.068.068 0 01.0116-.0948c.358-.225.7054-.4615.99-.7106a.0741.0741 0 00.0232-.0948c-.209-.2706-.411-.5477-.6042-.8283a.07.07 0 01.0116-.0948c.3438-.24.6762-.4914.9868-.75a.0741.0741 0 00.0252-.0948c-.193-.284-.3784-.5747-.5586-.8658a.07.07 0 01.0166-.0923c.305-.2028.599-.413.881-.6278a.0741.0741 0 00.0252-.0948c-.168-.2613-.3284-.526-.4792-.7908a.07.07 0 01.0182-.0923c.333-.197.654-.401.961-.6078a.0741.0741 0 00.0252-.0948c-.158-.2507-.306-.503-.443-.7538a.07.07 0 01.0222-.0923c.333-.1887.654-.3838.961-.58a.0741.0741 0 00.0252-.0948c-.144-.2326-.276-.4653-.401-.698a.07.07 0 01.0252-.0923c.8359-.4793 1.62-1.002 2.34-1.5519a.0741.0741 0 00.002-.1043c-.09-.125-.19-.247-.28-.367a.07.07 0 00-.047-.024c-.131.025-.258.05-.381.075a10.0413 10.0413 0 00-1.958.4877.0741.0741 0 00-.046-.064c-.06.17-.12-.34-.18-.51a17.4714 17.4714 0 00-3.3453 0c-.06-.17-.12-.34-.18-.51a.0741.0741 0 00-.046-.064 10.0413 10.0413 0 00-1.958-.4877.07.07 0 00-.083.001c-.09.12-.19-.242-.28.367a.0741.0741 0 00.002.1043c.72.55 1.504 1.0729 2.34 1.5519a.07.07 0 01.0252.0923c-.125.2327-.255.4653-.401.698a.0741.0741 0 00.0252-.0948c.307.1962.628.3913.961.58a.07.07 0 01.0222.0923c-.137.2508-.285.503-.443.7538a.0741.0741 0 00.0252-.0948c.282.2148.576.4258.881.6278a.07.07 0 01.0182-.0923c-.151.2648-.311.5295-.479.7908a.0741.0741 0 00.0252-.0948c.31.2588.643.5102.987.75a.07.07 0 01.0116.0948c-.193.2806-.395.5577-.604.8283a.0741.0741 0 00.023.0948c.285.2492.633.4856.99.7106a.07.07 0 01.0116.0948c-.176.3342-.36.6615-.548.9818a.0741.0741 0 00.0116.087c.294.245.599.452.916.6248a.07.07 0 00.087-.0012A16.4926 16.4926 0 0023.0308 13c0-2.6882-.8386-5.4727-2.6815-8.6144a.069.069 0 00-.0321-.0256zM8.0203 15.111c-1.1825 0-2.1568-1.0857-2.1568-2.419 0-1.3332.9743-2.419 2.1568-2.419 1.1825 0 2.1568 1.0858 2.1568 2.419 0 1.3333-.9743 2.419-2.1568 2.419zm7.9587 0c-1.1825 0-2.1568-1.0857-2.1568-2.419 0-1.3332.9743-2.419 2.1568-2.419 1.1825 0 2.1568 1.0858 2.1568 2.419 0 1.3333-.9743 2.419-2.1568 2.419z" fill="currentColor"></path>
                                </svg>
                                <span>{discordIdentity.identity_data?.user_name}</span>
                            </div>
                            <Button variant="destructive" size="icon" className="h-8 w-8">
                                <X className="h-4 w-4" />
                            </Button>
                        </div>
                     ) : (
                         <Button variant="outline" className="w-full">
                           Connect Discord
                         </Button>
                     )}
                 </CardContent>
               </Card>
           </div>
        </div>
      </div>
    </div>
  );
}

function AccountPageSkeleton() {
  return (
    <div className="space-y-8">
      <div>
        <Skeleton className="h-8 w-64 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
           <Skeleton className="h-96" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-64" />
          <Skeleton className="h-48" />
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <div className="flex-grow p-6">
      <Suspense fallback={<AccountPageSkeleton />}>
        <AccountPageContent />
      </Suspense>
    </div>
  )
}
