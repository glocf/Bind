'use client'

import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useState } from 'react'
import { Loader2 } from 'lucide-react'

const DiscordIcon = () => (
    <svg role="img" width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg"><path d="M20.317 4.36981C18.259 3.44181 16.059 3.00081 13.822 3.00081C13.822 3.00081 13.804 3.01881 13.786 3.03681C10.258 2.98181 6.801 4.02081 4.28 5.92681C4.28 5.92681 4.262 5.94481 4.244 5.96281C1.636 9.60581 0.883 13.4318 1.054 17.2028C1.054 17.2028 1.054 17.2208 1.072 17.2388C2.983 20.3808 6.023 21.8908 9.006 21.9998C9.006 21.9998 9.024 21.9998 9.042 21.9818C10.306 21.5278 11.491 20.8048 12.551 19.8978C12.551 19.8978 12.569 19.8798 12.551 19.8618C11.644 19.4398 10.821 18.8488 10.122 18.1138C10.122 18.1138 10.104 18.0958 10.122 18.0778C10.435 17.8178 10.73 17.5408 11.007 17.2458C11.007 17.2458 11.025 17.2278 11.043 17.2458C14.007 18.2558 17.11 18.1298 19.957 17.0358C19.957 17.0358 19.975 17.0178 19.957 16.9998C19.452 17.6388 18.832 18.1948 18.097 18.6488C18.097 18.6488 18.079 18.6668 18.097 18.6848C18.986 19.3318 19.789 19.8408 20.508 20.2068C20.508 20.2068 20.526 20.2248 20.544 20.2068C22.99 18.5328 24.114 15.6558 23.943 12.5808C23.943 12.5808 23.943 12.5628 23.925 12.5448C23.226 8.88381 21.68 5.67381 20.317 4.36981ZM8.02005 15.6208C7.03005 15.6208 6.22705 14.7998 6.22705 13.7998C6.22705 12.8178 7.01205 11.9788 8.02005 11.9788C9.02805 11.9788 9.83105 12.8178 9.81305 13.7998C9.81305 14.7998 9.02805 15.6208 8.02005 15.6208ZM15.979 15.6208C15.007 15.6208 14.186 14.7998 14.186 13.7998C14.186 12.8178 14.989 11.9788 15.979 11.9788C16.987 11.9788 17.79 12.8178 17.772 13.7998C17.772 14.7998 16.987 15.6208 15.979 15.6208Z"/></svg>
)

export function LoginForm() {
    const [loading, setLoading] = useState(false)
    const supabase = createClient()

    const handleLogin = async () => {
        setLoading(true)
        await supabase.auth.signInWithOAuth({
            provider: 'discord',
            options: {
                redirectTo: `${location.origin}/auth/callback`,
            },
        })
    }

    return (
        <Card className="w-full max-w-sm">
            <CardHeader className="text-center">
                <CardTitle className="text-2xl font-headline">Welcome to LinkSmash</CardTitle>
                <CardDescription>Your one link for everything. <br/>Sign in to get started.</CardDescription>
            </CardHeader>
            <CardContent>
                <Button className="w-full" onClick={handleLogin} disabled={loading}>
                    {loading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <DiscordIcon />
                    )}
                    Login with Discord
                </Button>
            </CardContent>
        </Card>
    )
}
