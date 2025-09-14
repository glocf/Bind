'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { generateThemedProfileBackground } from '@/ai/flows/generate-themed-profile-background'
import { z } from 'zod'
import { type Link } from '@/lib/types'

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


export async function updateLinks(links: Partial<Link>[]) {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'You must be logged in to update links.' }
  }

  const linksToUpsert = links.map((link, index) => ({
    id: link.id?.startsWith('new-') ? undefined : link.id,
    user_id: user.id,
    title: link.title,
    url: link.url,
    order: index,
  })).filter(link => link.title && link.url);

  const { error } = await supabase.from('links').upsert(linksToUpsert, { onConflict: 'id' });

  if (error) {
    console.error('Error updating links:', error)
    return { error: 'Failed to update links.' }
  }
  
  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
  revalidatePath('/account')
  if (profile?.username) {
    revalidatePath(`/${profile.username}`)
  }

  return { success: true }
}

export async function deleteLink(linkId: string) {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'You must be logged in to delete a link.' }
    }

    const { error } = await supabase.from('links').delete().eq('id', linkId).eq('user_id', user.id)

    if (error) {
        console.error('Error deleting link:', error)
        return { error: 'Failed to delete link.' }
    }

    const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single()
    revalidatePath('/account')
    if (profile?.username) {
        revalidatePath(`/${profile.username}`)
    }

    return { success: true }
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
