
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AccountForm } from './account-form'
import { type User } from '@supabase/supabase-js'

export default async function AccountPage() {
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


  return (
    <div className="flex-grow p-6">
        <div className="max-w-3xl mx-auto bg-card rounded-xl border">
            <AccountForm user={user as User} profile={profileData} links={linksData || []} />
        </div>
    </div>
  )
}
