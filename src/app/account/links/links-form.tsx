'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { updateLinks } from "../actions"
import { type Link as LinkType } from "@/lib/types"
import { Loader2, PlusCircle, Trash2, Github, Twitter, Instagram, Youtube, Twitch, Linkedin, Facebook, Gitlab, Globe } from "lucide-react"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { getIconForUrl } from "@/components/icons"

const linksSchema = z.object({
  links: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, { message: "Title is required." }),
      url: z.string().url({ message: "Please enter a valid URL." }),
    })
  ),
})

type LinksFormValues = z.infer<typeof linksSchema>

interface LinksFormProps {
  links: LinkType[]
}

const socialPresets = [
  { name: 'GitHub', icon: Github, url: 'https://github.com/' },
  { name: 'Twitter', icon: Twitter, url: 'https://twitter.com/' },
  { name: 'Instagram', icon: Instagram, url: 'https://instagram.com/' },
  { name: 'YouTube', icon: Youtube, url: 'https://youtube.com/c/' },
  { name: 'Twitch', icon: Twitch, url: 'https://twitch.tv/' },
  { name: 'LinkedIn', icon: Linkedin, url: 'https://linkedin.com/in/' },
  { name: 'Facebook', icon: Facebook, url: 'https://facebook.com/' },
  { name: 'GitLab', icon: Gitlab, url: 'https://gitlab.com/' },
  { name: 'Website', icon: Globe, url: 'https://' },
]

export function LinksForm({ links: initialLinks }: LinksFormProps) {
  const { toast } = useToast()
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  
  const linksForm = useForm<LinksFormValues>({
    resolver: zodResolver(linksSchema),
    defaultValues: {
      links: initialLinks || [],
    },
  });

  const { fields, append, remove, update } = useFieldArray({
    control: linksForm.control,
    name: "links",
  })
  
  async function onLinksSubmit(data: LinksFormValues) {
    startTransition(async () => {
      const result = await updateLinks(data.links, initialLinks);
      if (result.error) {
        toast({ title: "Error", description: result.error, variant: "destructive" });
      } else {
        toast({ title: "Success", description: "Your links have been updated." });
        router.refresh();
      }
    });
  }

  const addPresetLink = (preset: typeof socialPresets[0]) => {
    append({ id: `new-${Date.now()}`, title: preset.name, url: preset.url })
  }

  const addCustomLink = () => {
    append({ id: `new-${Date.now()}`, title: "", url: "https://" })
  }

  return (
    <Form {...linksForm}>
      <form onSubmit={linksForm.handleSubmit(onLinksSubmit)} className="space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight">Links</h1>
          <p className="text-muted-foreground">Add your social media links and custom URLs.</p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {socialPresets.map((preset) => (
            <Button
              key={preset.name}
              type="button"
              variant="outline"
              className="flex flex-col items-center justify-center h-24 gap-2"
              onClick={() => addPresetLink(preset)}
            >
              <preset.icon className="h-8 w-8" />
              <span>{preset.name}</span>
            </Button>
          ))}
           <Button
            type="button"
            variant="outline"
            className="flex flex-col items-center justify-center h-24 gap-2 border-dashed"
            onClick={addCustomLink}
          >
            <PlusCircle className="h-8 w-8" />
            <span>Custom Link</span>
          </Button>
        </div>
        
        <Separator />

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Your Links</h2>
          {fields.map((field, index) => {
            const Icon = getIconForUrl(linksForm.watch(`links.${index}.url`))
            return (
              <div key={field.id} className="flex items-start gap-4 group p-4 border rounded-lg bg-card/50">
                <Icon className="h-6 w-6 text-muted-foreground mt-2" />
                <div className="flex-grow space-y-2">
                  <FormField
                    control={linksForm.control}
                    name={`links.${index}.title`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="sr-only">Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Link Title" {...field} className="text-base font-medium"/>
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
                <Button type="button" variant="ghost" size="icon" className="shrink-0 text-muted-foreground hover:text-destructive" onClick={() => remove(index)}>
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Remove link</span>
                </Button>
              </div>
            )
          })}
          {fields.length === 0 && (
            <div className="text-center py-10 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">You haven't added any links yet.</p>
                <p className="text-sm text-muted-foreground">Click a preset above or "Custom Link" to start.</p>
            </div>
          )}
        </div>
        
        {fields.length > 0 && (
          <>
            <Separator />
            <div className="flex items-center justify-end">
              <Button type="submit" disabled={isPending}>
                {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
              </Button>
            </div>
          </>
        )}
      </form>
    </Form>
  )
}
