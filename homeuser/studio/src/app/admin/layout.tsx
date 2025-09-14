
import { createClient } from '@/lib/supabase/server'
import { notFound, redirect } from 'next/navigation'
import { Header } from '@/components/header'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  // This is a temporary check for development.
  // In a real app, roles would be managed in the database.
  if (profile && user.email === 'camisitodecorazon@gmail.com') {
    profile.role = 'admin';
  }

  if (profile?.role !== 'admin') {
    notFound()
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header user={user} profile={profile} />
      <main className="flex-grow container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  )
}
