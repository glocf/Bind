
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AccountForm } from './account-form'
import { type User } from '@supabase/supabase-js'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { type Profile, type Link } from '@/lib/types'

async function AccountFormWrapper() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: profileData } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: linksData } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('order', { ascending: true })

  return <AccountForm user={user as User} profile={profileData as Profile} links={linksData as Link[]} />
}

function AccountFormSkeleton() {
    return (
        <div className="space-y-12">
            <div className="space-y-4 p-6">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-4 space-y-4">
                    <Skeleton className="h-10 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
            </div>
             <div className="space-y-4 p-6">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
                <div className="pt-4 space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <Skeleton className="h-10 w-24" />
                </div>
            </div>
        </div>
    )
}

export default async function AccountPage() {
  return (
    <div className="flex-grow p-6">
        <div className="max-w-3xl mx-auto bg-card rounded-xl border">
            <Suspense fallback={<AccountFormSkeleton />}>
              <AccountFormWrapper />
            </Suspense>
        </div>
    </div>
  )
}
