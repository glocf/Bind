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

export default function SignupPage({ searchParams }: { searchParams: { message: string } }) {

  const signUp = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const username = formData.get('username') as string
    
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
      return redirect(`/signup?message=Could not create user: ${error.message}`)
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
             return redirect(`/signup?message=Could not create profile: ${profileError.message}`);
        }
    }


    // For now, Supabase needs email verification. This will be improved.
    return redirect('/login?message=Check your email to verify your account and then sign in.')
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
                <Alert variant={searchParams.message.startsWith('Could not') ? 'destructive' : 'default'} className="mb-4">
                    <Terminal className="h-4 w-4" />
                    <AlertTitle>{searchParams.message.startsWith('Could not') ? 'Error' : 'Info'}</AlertTitle>
                    <AlertDescription>
                        {searchParams.message.replace(/Could not (create|authenticate) user: /,'')}
                    </AlertDescription>
                </Alert>
            )}
            <form className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required />
              </div>
               <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" name="username" type="text" placeholder="your_username" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" name="password" type="password" required />
              </div>
              <Button formAction={signUp} className="w-full">Create Account</Button>
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
