
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { updateProfile } from "./actions"
import { type User } from "@supabase/supabase-js"
import { type Profile } from "@/lib/types"
import { Loader2 } from "lucide-react"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

const profileFormSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
  bio: z.string().max(160).optional(),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>

interface AccountFormProps {
  user: User
  profile: Profile | null
}

export function AccountForm({ user, profile }: AccountFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || "",
    },
  })
  
  async function onProfileSubmit(data: ProfileFormValues) {
    startTransition(async () => {
      const formData = new FormData()
      formData.append('username', data.username)
      formData.append('bio', data.bio || '')
      
      const result = await updateProfile(formData)

      if (result?.error) {
        if (typeof result.error === 'object') {
          Object.entries(result.error).forEach(([key, value]) => {
            profileForm.setError(key as keyof ProfileFormValues, {
              type: "manual",
              message: (value as string[]).join(", "),
            })
          })
        } else {
          toast({ title: "Error", description: result.error, variant: "destructive" })
        }
      } else {
        toast({ title: "Success", description: "Your profile has been updated." })
        router.refresh()
      }
    })
  }

  return (
    <div className="space-y-12">
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-8">
          <div className="space-y-4">
            <div className="p-6">
              <h2 className="text-2xl font-semibold leading-none tracking-tight">Profile</h2>
              <p className="text-sm text-muted-foreground mt-1">This is how others will see you on the site.</p>
            </div>
            
            <div className="p-6 pt-0 space-y-4">
              <FormField
                control={profileForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="your_username" {...field} />
                    </FormControl>
                    <FormDescription>This will be your public URL: bind.us/{profileForm.getValues('username')}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="bio"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bio</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little bit about yourself" className="resize-none" {...field} />
                    </FormControl>
                    <FormDescription>A short and sweet bio. Used for AI background generation.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
          <Separator />
          <div className="flex items-center justify-end p-6">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
