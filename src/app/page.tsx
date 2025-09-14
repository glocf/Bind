import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { LoginForm } from '@/components/login-form'
import Header from '@/components/header'

export default async function Home() {
  const supabase = createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    
    if (profile?.username) {
      redirect(`/${profile.username}`)
    } else {
      redirect('/account')
    }
  }

  return (
    <>
      <Header />
      <main className="flex flex-col items-center justify-center p-4 min-h-[calc(100vh-56px)]">
        <LoginForm />
      </main>
    </>
  )
}
