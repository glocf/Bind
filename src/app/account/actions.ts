
'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateThemedProfileBackground } from '@/ai/flows/generate-themed-profile-background'
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

  const linksToUpsert = links.map((link, index) => ({
    id: link.id?.startsWith('new-') ? undefined : link.id,
    user_id: user.id,
    title: link.title,
    url: link.url,
    order: index,
  })).filter(link => link.title && link.url);

  if (linksToUpsert.length > 0) {
    const { error: upsertError } = await supabase.from('links').upsert(linksToUpsert, { onConflict: 'id' });
    if (upsertError) {
      console.error('Error upserting links:', upsertError);
      return { error: 'Failed to update links.' };
    }
  }
  
  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  revalidatePath('/account');
  if (profile?.username) {
    revalidatePath(`/${profile.username}`);
  }

  return { success: true };
}


export async function generateAndUpdateBackground(bio: string) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return { error: 'You must be logged in.' }
  }

  if (!bio) {
    return { error: 'Please provide a bio to generate a background.' }
  }

  try {
    const result = await generateThemedProfileBackground({ bio })
    const dataUri = result.backgroundImageDataUri

    if (!dataUri) {
      return { error: 'AI failed to generate a background. Please try again.' }
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ background_image_data_uri: dataUri })
      .eq('id', user.id)

    if (updateError) {
      console.error(updateError)
      return { error: 'Failed to save the generated background.' }
    }

    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()

    revalidatePath('/account')
    if (profile?.username) {
      revalidatePath(`/${profile.username}`)
    }
    
    return { success: true, dataUri }
  } catch (e) {
    console.error(e)
    return { error: 'An unexpected error occurred while generating the background.' }
  }
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

    const { error } = await supabase
        .from('profiles')
        .update({ background_image_data_uri: null, updated_at: new Date().toISOString() })
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
        // Attempt to delete the orphaned file from storage
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
