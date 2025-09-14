
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
        <div className="space-y-6">
            <div className="space-y-2">
                <Skeleton className="h-8 w-1/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
            <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
                {[...Array(24)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-16" />
                ))}
            </div>
             <Skeleton className="h-20 w-full" />
            <div className="space-y-4 pt-4">
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-24 w-full" />
            </div>
        </div>
    )
}

export default async function LinksPage() {
  return (
    <div className="flex-grow p-6">
        <div className="max-w-4xl mx-auto">
            <Suspense fallback={<LinksFormSkeleton />}>
              <LinksFormWrapper />
            </Suspense>
        </div>
    </div>
  )
}
