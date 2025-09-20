
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertTriangle, CheckCircle, Diamond, Eye, Hash, Link as LinkIcon, PenSquare, User, UserCog, X } from 'lucide-react'
import Link from 'next/link'
import { Progress } from '@/components/ui/progress'

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
    
  const { count: linkCount } = await supabase
    .from('links')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id);

  const discordIdentity = user.identities?.find(i => i.provider === 'discord');
  
  const completionPercent = (
    (profile?.bio ? 1 : 0) + 
    (profile?.avatar_url ? 1 : 0) + 
    ((linkCount ?? 0) > 0 ? 1 : 0)
  ) / 3 * 100;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-4">Account Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-card border-border shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Username</CardTitle>
                    <PenSquare className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{profile?.username || 'N/A'}</div>
                    <p className="text-xs text-green-400 mt-1">Change available now</p>
                </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-lg">
                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Alias</CardTitle>
                    <User className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">Unavailable</div>
                    <p className="text-xs text-muted-foreground mt-1">Premium Only</p>
                </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">UID</CardTitle>
                    <Hash className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{user.id.substring(0, 8)}...</div>
                    <p className="text-xs text-muted-foreground mt-1">Joined after 85% of all users</p>
                </CardContent>
            </Card>
            <Card className="bg-card border-border shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium text-muted-foreground">Profile Views</CardTitle>
                    <Eye className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                    <div className="text-2xl font-bold">{viewCount ?? 0}</div>
                     <p className="text-xs text-muted-foreground mt-1">+0 views since last 7 days</p>
                </CardContent>
            </Card>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Card className="bg-card border-border shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Account Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                   <div>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Profile Completion</h4>
                        <span className="text-sm font-bold text-white">{completionPercent.toFixed(0)}%</span>
                      </div>
                      <Progress value={completionPercent} className="h-2" />
                   </div>
                   
                    {completionPercent < 100 && (
                      <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-300">
                          <div className="flex items-start">
                              <AlertTriangle className="h-5 w-5 mr-3 mt-0.5 text-yellow-400" />
                              <div>
                                  <h5 className="font-semibold">Your profile isn’t complete yet!</h5>
                                  <p className="text-sm text-yellow-400/80">Completing your profile will enhance your visibility.</p>
                              </div>
                          </div>
                      </div>
                    )}

                   <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-3">Complete your profile</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                         <Link href="/account/customize">
                           <Button variant={profile?.avatar_url ? "secondary" : "default"} className={`w-full justify-start ${profile?.avatar_url ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                             {profile?.avatar_url ? <CheckCircle className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                             Upload Avatar
                           </Button>
                         </Link>
                         <Link href="/account/settings">
                           <Button variant={profile?.bio ? "secondary" : "default"} className={`w-full justify-start ${profile?.bio ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                              {profile?.bio ? <CheckCircle className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                              Add a Bio
                           </Button>
                         </Link>
                         <Link href="/account/links">
                           <Button variant={(linkCount ?? 0) > 0 ? "secondary" : "default"} className={`w-full justify-start ${(linkCount ?? 0) > 0 ? 'bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'}`}>
                             {(linkCount ?? 0) > 0 ? <CheckCircle className="mr-2 h-4 w-4" /> : <LinkIcon className="mr-2 h-4 w-4" />}
                             Add a Link
                           </Button>
                         </Link>
                      </div>
                   </div>
              </CardContent>
            </Card>
        </div>

        <div className="space-y-8">
           <Card className="bg-card border-border shadow-lg">
             <CardHeader><CardTitle className="text-lg">Manage your account</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground pb-2">Change your username, display name and more.</p>
                  <Link href="/account/settings">
                    <Button variant="outline" className="w-full justify-start"><PenSquare className="mr-2 h-4 w-4" />Change Username/Bio</Button>
                  </Link>
                  <Link href="/account/premium">
                    <Button variant="default" className="w-full justify-start"><Diamond className="mr-2 h-4 w-4" />Unlock Premium</Button>
                  </Link>
                  <Link href="/account/settings">
                    <Button variant="outline" className="w-full justify-start"><UserCog className="mr-2 h-4 w-4" />Account Settings</Button>
                  </Link>
                </CardContent>
              </Card>
           <Card className="bg-card border-border shadow-lg">
             <CardHeader><CardTitle className="text-lg">Connections</CardTitle></CardHeader>
                 <CardContent>
                    <p className="text-sm text-muted-foreground mb-4">Link your Discord account to bind.us</p>
                     {discordIdentity ? (
                        <div className="flex items-center justify-between p-3 rounded-lg bg-blue-500/10 border border-blue-500/20">
                            <div className="flex items-center gap-3">
                                <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-400">
                                    <title>Discord</title>
                                    <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8852-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6667 1.2835a18.2976 18.2976 0 00-5.3224 0c-.2203-.459-.4557-.9082-.6667-1.2835a.0741.0741 0 00-.0785-.0371a19.7913 19.7913 0 00-4.8852 1.5152.069.069 0 00-.0321.0256c-1.843 3.1417-2.6816 5.9262-2.6816 8.6144a16.4926 16.4926 0 005.0614 11.7854.07.07 0 00.087.0012c.3176-.1738.6218-.38.9161-.6248a.0741.0741 0 00.0116-.087c-.1889-.3203-.3718-.6476-.5478-.9818a.068.068 0 01.0116-.0948c.358-.225.7054-.4615.99-.7106a.0741.0741 0 00.0232-.0948c-.209-.2706-.411-.5477-.6042-.8283a.07.07 0 01.0116-.0948c.3438-.24.6762-.4914.9868-.75a.0741.0741 0 00.0252-.0948c-.193-.284-.3784-.5747-.5586-.8658a.07.07 0 01.0166-.0923c.305-.2028.599-.413.881-.6278a.0741.0741 0 00.0252-.0948c-.168-.2613-.3284-.526-.4792-.7908a.07.07 0 01.0182-.0923c.333-.197.654-.401.961-.6078a.0741.0741 0 00.0252-.0948c-.158-.2507-.306-.503-.443-.7538a.07.07 0 01.0222-.0923c.333-.1887.654-.3838.961-.58a.0741.0741 0 00.0252-.0948c-.144-.2326-.276-.4653-.401-.698a.07.07 0 01.0252-.0923c.8359-.4793 1.62-1.002 2.34-1.5519a.0741.0741 0 00.002-.1043c-.09-.125-.19-.247-.28-.367a.07.07 0 00-.047-.024c-.131.025-.258.05-.381.075a10.0413 10.0413 0 00-1.958.4877.0741.0741 0 00-.046-.064c-.06.17-.12-.34-.18-.51a17.4714 17.4714 0 00-3.3453 0c-.06-.17-.12-.34-.18-.51a.0741.0741 0 00-.046-.064 10.0413 10.0413 0 00-1.958-.4877.07.07 0 00-.083.001c-.09.12-.19-.242-.28.367a.0741.0741 0 00.002.1043c.72.55 1.504 1.0729 2.34 1.5519a.07.07 0 01.0252.0923c-.125.2327-.255.4653-.401.698a.0741.0741 0 00.0252-.0948c.307.1962.628.3913.961.58a.07.07 0 01.0222.0923c-.137.2508-.285.503-.443.7538a.0741.0741 0 00.0252-.0948c.282.2148.576.4258.881.6278a.07.07 0 01.0182-.0923c-.151.2648-.311.5295-.479.7908a.0741.0741 0 00.0252-.0948c.31.2588.643.5102.987.75a.07.07 0 01.0116.0948c-.193.2806-.395.5577-.604.8283a.0741.0741 0 00.023.0948c.285.2492.633.4856.99.7106a.07.07 0 01.0116.0948c-.176.3342-.36.6615-.548.9818a.0741.a0741 0 00.0116.087c.294.245.599.452.916.6248a.07.07 0 00.087-.0012A16.4926 16.4926 0 0023.0308 13c0-2.6882-.8386-5.4727-2.6815-8.6144a.069.069 0 00-.0321-.0256zM8.0203 15.111c-1.1825 0-2.1568-1.0857-2.1568-2.419 0-1.3332.9743-2.419 2.1568-2.419 1.1825 0 2.1568 1.0858 2.1568 2.419 0 1.3333-.9743 2.419-2.1568 2.419zm7.9587 0c-1.1825 0-2.1568-1.0857-2.1568-2.419 0-1.3332.9743-2.419 2.1568-2.419 1.1825 0 2.1568 1.0858 2.1568 2.419 0 1.3333-.9743 2.419-2.1568 2.419z" fill="currentColor"></path>
                                </svg>
                                <span className="font-semibold">{discordIdentity.identity_data?.user_name}</span>
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
  )
}

function AccountPageSkeleton() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-10 w-1/3" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
           <Skeleton className="h-80 rounded-2xl" />
        </div>
        <div className="space-y-8">
          <Skeleton className="h-48 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      </div>
    </div>
  )
}

export default function AccountPage() {
  return (
    <Suspense fallback={<AccountPageSkeleton />}>
      <AccountPageContent />
    </Suspense>
  )
}
