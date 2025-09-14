
'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
import { updateLinks } from "../actions"
import { type Link as LinkType } from "@/lib/types"
import { Loader2, PlusCircle, Trash2 } from "lucide-react"
import { useTransition } from "react"
import { useRouter } from "next/navigation"

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

  return (
    <div className="space-y-12">
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
