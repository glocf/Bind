import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { AccountForm } from './account-form'
import Header from '@/components/header'
import { type User } from '@supabase/supabase-js'

const mockUser: User = {
  id: 'mock-user-id',
  app_metadata: { provider: 'email' },
  user_metadata: { full_name: 'Bind Project Test', avatar_url: '' },
  aud: 'authenticated',
  created_at: new Date().toISOString(),
  email: 'dev@example.com'
};


export default async function AccountPage() {
  // --- TEMPORARILY DISABLED FOR DEVELOPMENT ---
  // const supabase = createClient()

  // const { data: { user } } = await supabase.auth.getUser()
  // if (!user) {
  //   redirect('/')
  // }
  const user = mockUser; // Use mock user

  // const { data: profile } = await supabase
  //   .from('profiles')
  //   .select('*')
  //   .eq('id', user.id)
  //   .single()
  const profile = {
    id: 'mock-user-id',
    username: 'bindprojectest',
    bio: 'This is a mock bio for development.',
    full_name: 'Bind Project Test',
    avatar_url: '',
    background_image_data_uri: null,
    role: 'admin',
    updated_at: new Date().toISOString(),
  };
  
  // const { data: links } = await supabase
  //   .from('links')
  //   .select('*')
  //   .eq('user_id', user.id)
  //   .order('order', { ascending: true })
  const links = [
    { id: '1', title: 'My Portfolio', url: 'https://example.com', user_id: 'mock-user-id', created_at: new Date().toISOString(), order: 0 },
    { id: '2', title: 'GitHub', url: 'https://github.com', user_id: 'mock-user-id', created_at: new Date().toISOString(), order: 1 },
  ];


  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto py-8 px-4">
        <AccountForm user={user} profile={profile} links={links || []} />
      </main>
    </div>
  )
}
