import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AccountForm } from './account-form'
import Header from '@/components/header'
import { type User } from '@supabase/supabase-js'

export default async function AccountPage() {
  const supabase = createClient()

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
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <AccountForm user={user} profile={profileData} links={linksData || []} />
      </main>
    </div>
  )
}
