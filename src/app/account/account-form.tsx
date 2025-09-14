'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { updateLinks, updateProfile, generateAndUpdateBackground } from "./actions"
import { type User } from "@supabase/supabase-js"
import { type Link as LinkType, type Profile } from "@/lib/types"
import { Loader2, PlusCircle, Sparkles, Trash2, GripVertical } from "lucide-react"
import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"

const profileFormSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters." })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
  bio: z.string().max(160).optional(),
})

const linksSchema = z.object({
  links: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, { message: "Title is required." }),
      url: z.string().url({ message: "Please enter a valid URL." }),
    })
  ),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type LinksFormValues = z.infer<typeof linksSchema>

interface AccountFormProps {
  user: User
  profile: Profile | null
  links: LinkType[]
}

export function AccountForm({ user, profile, links: initialLinks }: AccountFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [isGenerating, setIsGenerating] = useState(false)
  
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: profile?.username || "",
      bio: profile?.bio || "",
    },
  })

  const linksForm = useForm<LinksFormValues>({
    resolver: zodResolver(linksSchema),
    defaultValues: {
      links: initialLinks || [],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control: linksForm.control,
    name: "links",
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
      }
    })
  }

  async function onLinksSubmit(data: LinksFormValues) {
    startTransition(async () => {
      const result = await updateLinks(data.links, initialLinks);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Your links have been updated." });
      }
    });
  }

  const handleGenerateBackground = async () => {
    setIsGenerating(true)
    const bio = profileForm.getValues('bio')
    if (!bio) {
      toast({ title: "Please enter a bio first.", variant: "destructive" })
      setIsGenerating(false)
      return
    }
    const result = await generateAndUpdateBackground(bio)
    if (result.error) {
      toast({ title: "Error generating background", description: result.error, variant: "destructive" })
    } else {
      toast({ title: "Background generated and saved!" })
    }
    setIsGenerating(false)
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
          <div className="flex items-center justify-between p-6">
            <Button onClick={handleGenerateBackground} disabled={isGenerating || isPending} variant="outline" type="button">
              {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Sparkles className="mr-2 h-4 w-4" />}
              Generate Background
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Profile
            </Button>
          </div>
        </form>
      </Form>
      
      <Separator />

      <Form {...linksForm}>
        <form onSubmit={linksForm.handleSubmit(onLinksSubmit)} className="space-y-8">
          <div className="space-y-4">
             <div className="p-6">
              <h2 className="text-2xl font-semibold leading-none tracking-tight">Links</h2>
              <p className="text-sm text-muted-foreground mt-1">Add, edit, and reorder your links.</p>
            </div>
            <div className="p-6 pt-0 space-y-4">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2 group p-4 border rounded-lg">
                  <div className="flex-grow space-y-2">
                    <FormField
                      control={linksForm.control}
                      name={`links.${index}.title`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">Title</FormLabel>
                          <FormControl>
                            <Input placeholder="Link Title" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={linksForm.control}
                      name={`links.${index}.url`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="sr-only">URL</FormLabel>
                          <FormControl>
                            <Input placeholder="https://example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button type="button" variant="ghost" size="icon" className="shrink-0" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Remove link</span>
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => append({ id: `new-${Date.now()}`, title: "", url: "" })}
              >
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Link
              </Button>
            </div>
          </div>
          <Separator />
           <div className="flex items-center justify-end p-6">
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Links
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
