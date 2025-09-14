import Link from 'next/link'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Terminal } from "lucide-react"
import { z } from 'zod'

const DiscordIcon = () => (
    <svg role="img" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 transition-transform duration-200 ease-in-out group-hover:scale-110 group-hover:-rotate-12">
        <title>Discord</title>
        <path d="M20.317 4.3698a19.7913 19.7913 0 00-4.8852-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4464.8245-.6667 1.2835a18.2976 18.2976 0 00-5.3224 0c-.2203-.459-.4557-.9082-.6667-1.2835a.0741.0741 0 00-.0785-.0371a19.7913 19.7913 0 00-4.8852 1.5152.069.069 0 00-.0321.0256c-1.843 3.1417-2.6816 5.9262-2.6816 8.6144a16.4926 16.4926 0 005.0614 11.7854.07.07 0 00.087.0012c.3176-.1738.6218-.38.9161-.6248a.0741.0741 0 00.0116-.087c-.1889-.3203-.3718-.6476-.5478-.9818a.068.068 0 01.0116-.0948c.358-.225.7054-.4615.99-.7106a.0741.0741 0 00.0232-.0948c-.209-.2706-.411-.5477-.6042-.8283a.07.07 0 01.0116-.0948c.3438-.24.6762-.4914.9868-.75a.0741.0741 0 00.0252-.0948c-.193-.284-.3784-.5747-.5586-.8658a.07.07 0 01.0166-.0923c.305-.2028.599-.413.881-.6278a.0741.0741 0 00.0252-.0948c-.168-.2613-.3284-.526-.4792-.7908a.07.07 0 01.0182-.0923c.333-.197.654-.401.961-.6078a.0741.0741 0 00.0252-.0948c-.158-.2507-.306-.503-.443-.7538a.07.07 0 01.0222-.0923c.333-.1887.654-.3838.961-.58a.0741.0741 0 00.0252-.0948c-.144-.2326-.276-.4653-.401-.698a.07.07 0 01.0252-.0923c.8359-.4793 1.62-1.002 2.34-1.5519a.0741.0741 0 00.002-.1043c-.09-.125-.19-.247-.28-.367a.07.07 0 00-.047-.024c-.131.025-.258.05-.381.075a10.0413 10.0413 0 00-1.958.4877.0741.0741 0 00-.046.064c-.06.17-.12.34-.18.51a17.4714 17.4714 0 00-3.3453 0c-.06-.17-.12-.34-.18-.51a.0741.0741 0 00-.046-.064 10.0413 10.0413 0 00-1.958-.4877.07.07 0 00-.083.001c-.09.12-.19.242-.28.367a.0741.0741 0 00.002.1043c.72.55 1.504 1.0729 2.34 1.5519a.07.07 0 01.0252.0923c-.125.2327-.255.4653-.401.698a.0741.0741 0 00.0252-.0948c.307.1962.628.3913.961.58a.07.07 0 01.0222.0923c-.137.2508-.285.503-.443.7538a.0741.0741 0 00.0252.0948c.282.2148.576.4258.881.6278a.07.07 0 01.0182.0923c-.151.2648-.311.5295-.479.7908a.0741.0741 0 00.0252.0948c.31.2588.643.5102.987.75a.07.07 0 01.0116.0948c-.193.2806-.395.5577-.604.8283a.0741.0741 0 00.023.0948c.285.2492.633.4856.99.7106a.07.07 0 01.0116.0948c-.176.3342-.36.6615-.548.9818a.0741.0741 0 00.0116.087c.294.245.599.452.916.6248a.07.07 0 00.087-.0012A16.4926 16.4926 0 0023.0308 13c0-2.6882-.8386-5.4727-2.6815-8.6144a.069.069 0 00-.0321-.0256zM8.0203 15.111c-1.1825 0-2.1568-1.0857-2.1568-2.419 0-1.3332.9743-2.419 2.1568-2.419 1.1825 0 2.1568 1.0858 2.1568 2.419 0 1.3333-.9743 2.419-2.1568 2.419zm7.9587 0c-1.1825 0-2.1568-1.0857-2.1568-2.419 0-1.3332.9743-2.419 2.1568-2.419 1.1825 0 2.1568 1.0858 2.1568 2.419 0 1.3333-.9743 2.419-2.1568 2.419z" fill="currentColor"></path>
    </svg>
);


export default function SignupPage({ searchParams }: { searchParams: { message: string } }) {

  const signUp = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string

    const signupSchema = z.object({
      email: z.string().email({ message: 'Please enter a valid email address.' }),
      password: z.string().min(6, { message: 'Password must be at least 6 characters long.' }),
      username: z.string().min(3, { message: 'Username must be at least 3 characters long.' })
        .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores.' }),
    })

    const result = signupSchema.safeParse({ email, password, username })

    if (!result.success) {
      const errorMessages = result.error.errors.map(e => e.message).join(' ');
      return redirect(`/signup?message=${errorMessages}`)
    }
    
    const supabase = createClient()

    const { data: { user }, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          username: username,
          full_name: username, // Default full_name to username
        }
      }
    })

    if (error) {
      return redirect(`/signup?message=${error.message}`)
    }
    
    // Create profile entry
    if (user) {
        const { error: profileError } = await supabase.from('profiles').insert({
            id: user.id,
            username: username,
            full_name: username,
        });

        if (profileError) {
             // If profile creation fails, we should probably delete the user
             // or handle this more gracefully. For now, just show an error.
             await supabase.auth.admin.deleteUser(user.id)
             return redirect(`/signup?message=${profileError.message}`);
        }
    }


    // For now, Supabase needs email verification. This will be improved.
    return redirect('/login?message=Check your email to verify your account and then sign in.')
  }

  const signInWithDiscord = async () => {
    'use server'
    const supabase = createClient()
    const origin = headers().get('origin')
    const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'discord',
        options: {
            redirectTo: `${origin}/auth/callback`,
        },
    })

    if (error) {
        return redirect(`/login?message=Could not authenticate with Discord: ${error.message}`)
    }

    return redirect(data.url)
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex-grow flex items-center justify-center">
        <Card className="w-full max-w-sm mx-auto">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Create an account</CardTitle>
            <CardDescription>Enter your details below to create your account.</CardDescription>
          </CardHeader>
          <CardContent>
            {searchParams.message && (
                <Alert variant={searchParams.message.startsWith('Check your email') ? 'default' : 'destructive'} className="mb-4">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>{searchParams.message.startsWith('Check your email') ? 'Info' : 'Error'}</AlertTitle>
                    <AlertDescription>
                        {searchParams.message}
                    </AlertDescription>
                </Alert>
            )}
            <form>
                <Button formAction={signInWithDiscord} variant="outline" className="w-full group">
                    <DiscordIcon />
                    Continue with Discord
                </Button>
            </form>

            <div className="my-4 flex items-center">
                <div className="flex-grow border-t border-muted"></div>
                <span className="mx-4 text-xs uppercase text-muted-foreground">Or</span>
                <div className="flex-grow border-t border-muted"></div>
            </div>
            
            <form className="space-y-4" action={signUp}>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" placeholder="your_username" required minLength={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{' '}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
