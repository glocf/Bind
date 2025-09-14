
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { CustomizeForm } from './customize-form';
import { Skeleton } from '@/components/ui/skeleton';

function CustomizePageSkeleton() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-12 text-white">
      <div>
        <h2 className="text-xl font-bold mb-4">Assets Uploader</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Skeleton className="aspect-video" />
          <Skeleton className="aspect-video" />
          <Skeleton className="aspect-video" />
          <Skeleton className="aspect-video" />
        </div>
      </div>
      <Skeleton className="h-14 w-full" />
      <div>
        <h2 className="text-xl font-bold mb-6">General Customization</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-10">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-5 w-2/4" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function CustomizePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (!profile) {
    // This case should ideally not happen if the user is logged in,
    // as a profile is created on sign up. But as a safeguard:
    redirect('/account');
  }
  
  return (
    <Suspense fallback={<CustomizePageSkeleton />}>
      <CustomizeForm profile={profile} />
    </Suspense>
  );
}
