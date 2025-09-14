
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { type Link, type Profile } from '@/lib/types'

const profileSchema = z.object({
  username: z.string()
    .min(3, { message: 'Username must be at least 3 characters long.' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
  bio: z.string().max(160, { message: 'Bio must be 160 characters or less.' }).optional(),
})

export async function updateProfile(formData: FormData) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update your profile.' }
  }

  const values = {
    username: formData.get('username'),
    bio: formData.get('bio'),
  }

  const validatedFields = profileSchema.safeParse(values)

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors,
    }
  }

  const { username, bio } = validatedFields.data

  const { data: existingProfile } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .not('id', 'eq', user.id)
    .single()

  if (existingProfile) {
    return { error: { username: ['Username is already taken.'] } }
  }

  const { error } = await supabase.from('profiles').upsert({
    id: user.id,
    username,
    bio: bio ?? null,
    updated_at: new Date().toISOString(),
    full_name: user.user_metadata.full_name,
    avatar_url: user.user_metadata.avatar_url,
  })

  if (error) {
    return { error: 'Failed to update profile.' }
  }

  revalidatePath('/account')
  revalidatePath(`/${username}`)

  return { success: true }
}


export async function updateLinks(links: Partial<Link>[], initialLinks: Link[]) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to update links.' };
  }

  const currentLinkIds = new Set(links.map(l => l.id));
  const linksToDelete = initialLinks.filter(link => !currentLinkIds.has(link.id));

  if (linksToDelete.length > 0) {
    const { error: deleteError } = await supabase
      .from('links')
      .delete()
      .in('id', linksToDelete.map(l => l.id));
      
    if (deleteError) {
      console.error('Error deleting links:', deleteError);
      return { error: 'Failed to remove old links.' };
    }
  }

  for (const link of links) {
    const { id, ...linkData } = link;
    if (id?.startsWith('new-')) {
      const { error: insertError } = await supabase.from('links').insert({
        ...linkData,
        user_id: user.id,
        order: links.findIndex(l => l.id === id),
      });
      if (insertError) {
        console.error('Error inserting new link:', insertError);
        return { error: 'Failed to add new link.' };
      }
    } else {
      const { error: updateError } = await supabase
        .from('links')
        .update({
          ...linkData,
          order: links.findIndex(l => l.id === id),
        })
        .eq('id', id as string);
      if (updateError) {
        console.error(`Error updating link ${id}:`, updateError);
        return { error: 'Failed to update link.' };
      }
    }
  }
  
  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  revalidatePath('/account');
  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
  }

  return { success: true };
}

export async function trackProfileView(userId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('analytics').insert({
    user_id: userId,
    event_type: 'profile_view',
  })
  if (error) {
    console.error('Error tracking profile view:', error)
  }
}

export async function trackLinkClick(linkId: string, userId: string) {
    const supabase = createClient()
    const { error } = await supabase.from('analytics').insert({
        user_id: userId,
        link_id: linkId,
        event_type: 'link_click',
    });

    if (error) {
        console.error('Error tracking link click:', error);
    }
}

export async function updateCustomization(data: Partial<Profile>) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in to update your profile.' };
    }

    const { error } = await supabase
        .from('profiles')
        .update({ ...data, updated_at: new Date().toISOString() })
        .eq('id', user.id);

    if (error) {
        console.error('Error updating customization:', error);
        return { error: 'Failed to update customization.' };
    }

    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
    revalidatePath('/account/customize');
    if (profile?.username) {
        revalidatePath(`/${profile.username}`);
    }

    return { success: true };
}

export async function removeBackground() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in.' };
    }

    const { data: currentProfile } = await supabase.from('profiles').select('background_image_url').eq('id', user.id).single();
    
    if (currentProfile?.background_image_url) {
        try {
            const path = new URL(currentProfile.background_image_url).pathname.split('/backgrounds/')[1];
            if (path) {
                await supabase.storage.from('backgrounds').remove([path]);
            }
        } catch (e) {
            console.error("Could not parse URL or remove from storage", e)
        }
    }

    const { error } = await supabase
        .from('profiles')
        .update({ background_image_url: null, updated_at: new Date().toISOString() })
        .eq('id', user.id);

    if (error) {
        console.error('Error removing background:', error);
        return { error: 'Failed to remove background.' };
    }
    
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
    revalidatePath('/account/customize');
    if (profile?.username) {
        revalidatePath(`/${profile.username}`);
    }

    return { success: true };
}

export async function updateAvatar(formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in.' };
    }

    const file = formData.get('avatar') as File;
    if (!file) {
        return { error: 'No file selected.' };
    }

    const filePath = `avatars/${user.id}/${Date.now()}`;
    const { error: uploadError } = await supabase.storage
        .from('profiles')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading avatar:', uploadError);
        return { error: 'Failed to upload avatar.' };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('profiles')
        .getPublicUrl(filePath);

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating profile with new avatar:', updateError);
        await supabase.storage.from('profiles').remove([filePath]);
        return { error: 'Failed to update profile with new avatar.' };
    }
    
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
    revalidatePath('/account/customize');
    if (profile?.username) {
        revalidatePath(`/${profile.username}`);
    }

    return { success: true, url: publicUrl };
}

export async function updateBackground(formData: FormData) {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { error: 'You must be logged in.' };
    }

    const file = formData.get('background') as File;
    if (!file) {
        return { error: 'No file selected.' };
    }

    const filePath = `backgrounds/${user.id}/${Date.now()}`;
    const { error: uploadError } = await supabase.storage
        .from('backgrounds')
        .upload(filePath, file);

    if (uploadError) {
        console.error('Error uploading background:', uploadError);
        return { error: 'Failed to upload background.' };
    }

    const { data: { publicUrl } } = supabase.storage
        .from('backgrounds')
        .getPublicUrl(filePath);

    const { error: updateError } = await supabase
        .from('profiles')
        .update({ background_image_url: publicUrl })
        .eq('id', user.id);

    if (updateError) {
        console.error('Error updating profile with new background:', updateError);
        await supabase.storage.from('backgrounds').remove([filePath]);
        return { error: 'Failed to update profile with new background.' };
    }
    
    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
    revalidatePath('/account/customize');
    if (profile?.username) {
        revalidatePath(`/${profile.username}`);
    }

    return { success: true, url: publicUrl };
}
