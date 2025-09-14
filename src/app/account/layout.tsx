
import { Header } from '@/components/header';
import { createClient } from '@/lib/supabase/server';
import { type Profile } from '@/lib/types';
import AccountLayoutClient from './account-layout-client';
import { redirect } from 'next/navigation';

export default async function AccountLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  return (
    <AccountLayoutClient user={user} profile={profile}>
      {children}
    </AccountLayoutClient>
  );
}

