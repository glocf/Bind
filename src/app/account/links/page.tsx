
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LinksForm } from './links-form'
import { Suspense } from 'react'
import { Skeleton } from '@/components/ui/skeleton'
import { type Link } from '@/lib/types'

async function LinksFormWrapper() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  const { data: linksData } = await supabase
    .from('links')
    .select('*')
    .eq('user_id', user.id)
    .order('order', { ascending: true })

  return <LinksForm links={linksData as Link[]} />
}

function LinksFormSkeleton() {
    return (
        <div className="space-y-12">
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

export default async function LinksPage() {
  return (
    <div className="flex-grow p-6">
        <div className="max-w-3xl mx-auto bg-card rounded-xl border">
            <Suspense fallback={<LinksFormSkeleton />}>
              <LinksFormWrapper />
            </Suspense>
        </div>
    </div>
  )
}
