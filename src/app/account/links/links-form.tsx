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
import { Loader2, PlusCircle, Trash2, Globe, Link } from "lucide-react"
import { useTransition } from "react"
import { useRouter } from "next/navigation"
import { getIconForUrl } from "@/components/icons"
import { socialPresets } from "@/components/social-icons"

const linksSchema = z.object({
  links: z.array(
    z.object({
      id: z.string(),
      title: z.string().min(1, { message: "Title is required." }),
      url: z.string().url({ message: "Please enter a valid URL." }),
      order: z.number(),
      created_at: z.string(),
      user_id: z.string(),
    })
  ),
})

type LinksFormValues = z.infer<typeof linksSchema>

interface LinksFormProps {
  links: LinkType[]
}

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

  const { fields, append, remove } = useFieldArray({
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
    append({ id: `new-${Date.now()}`, title: preset.name, url: preset.url, order: fields.length, created_at: new Date().toISOString(), user_id: '' })
  }

  const addCustomLink = () => {
    append({ id: `new-${Date.now()}`, title: "", url: "https://", order: fields.length, created_at: new Date().toISOString(), user_id: '' })
  }

  return (
    <Form {...linksForm}>
      <form onSubmit={linksForm.handleSubmit(onLinksSubmit)} className="space-y-8">
        <div className="space-y-2">
          <div className="flex items-center gap-3">
             <Link className="h-6 w-6 text-muted-foreground" />
             <h1 className="text-2xl font-bold tracking-tight">Link your social media profiles.</h1>
          </div>
          <p className="text-muted-foreground ml-9">Pick a social media to add to your profile.</p>
        </div>

        <div className="grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-12 gap-4">
          {socialPresets.map((preset) => (
            <Button
              key={preset.name}
              type="button"
              variant="outline"
              className="flex items-center justify-center h-16 w-16 bg-card/80 hover:bg-card/100 border-border/50"
              onClick={() => addPresetLink(preset)}
            >
              <preset.icon className="h-8 w-8" />
              <span className="sr-only">{preset.name}</span>
            </Button>
          ))}
        </div>
        
        <Button
            type="button"
            variant="ghost"
            className="h-auto w-full justify-start items-center gap-4"
            onClick={addCustomLink}
          >
            <div className="flex items-center justify-center h-16 w-16 rounded-lg bg-card/80 border border-border/50">
                <Globe className="h-8 w-8 text-muted-foreground" />
            </div>
            <div>
                <p className="font-semibold text-base">Add Custom URL</p>
                <p className="text-sm text-muted-foreground">Use your own URL and choose an icon to match.</p>
            </div>
          </Button>
        
        <Separator />

        <div className="space-y-4">
          {fields.length > 0 && <h2 className="text-xl font-semibold">Your Links</h2>}
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
                <p className="text-sm text-muted-foreground">Click a preset above or "Custom URL" to start.</p>
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
