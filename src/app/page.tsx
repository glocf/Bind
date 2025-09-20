import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/header'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bot, Brush, CheckCircle, Globe, Link2, Users } from 'lucide-react'
import Image from 'next/image'

const features = [
  {
    icon: <Globe className="h-5 w-5 text-secondary" />,
    title: 'Modern Biolinks',
    description: 'Create a stunning biolink page that houses all your important links in one place.',
  },
  {
    icon: <Brush className="h-5 w-5 text-secondary" />,
    title: 'Advanced Customization',
    description: 'Make your page truly yours. Customize backgrounds, buttons, fonts, and layouts.',
  },
  {
    icon: <Bot className="h-5 w-5 text-secondary" />,
    title: 'AI-Powered Features',
    description: 'Generate unique backgrounds and get customization advice from our AI assistant.',
  },
  {
    icon: <BarChart className="h-5 w-5 text-secondary" />,
    title: 'Detailed Analytics',
    description: 'Track link clicks and page views to understand your audience better.',
  },
]

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/account');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 h-full w-full animate-background-pan bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.2),rgba(255,255,255,0))]"></div>
      <Header />
      <main className="flex-grow flex flex-col items-center text-center px-4 pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto pb-24">
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h1 className="text-5xl md:text-7xl font-bold font-headline tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent pb-4">
              Your modern biolink and secure hosting in seconds
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto">
              Create your personalized page, upload files, and analyze your audience in one place.
            </p>
          </div>
          <div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
            <div className="relative w-full max-w-md mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground">bind.us/</span>
              <Input
                type="text"
                placeholder="username"
                className="w-full h-12 pr-32 pl-20 rounded-lg bg-input text-white border-border placeholder:text-muted-foreground focus:ring-primary/50"
              />
              <Button
                size="lg"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-auto bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white font-semibold hover:opacity-90 transition-opacity"
                asChild
              >
                <Link href="/signup">Claim Now</Link>
              </Button>
            </div>
          </div>
        </div>
        
         <section className="w-full max-w-6xl mx-auto pb-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="relative w-full max-w-sm mx-auto animate-fade-in-up" style={{ animationDelay: '800ms' }}>
              <div className="absolute inset-0 bg-primary/20 rounded-3xl blur-2xl -z-10"></div>
              <div className="p-2 bg-zinc-800/50 rounded-3xl border border-white/10 shadow-2xl">
                 <div className="aspect-[9/19] bg-[#0E0E12] rounded-2xl p-4 overflow-hidden">
                    <div className="flex flex-col items-center text-white text-center">
                       <Image 
                         src="https://picsum.photos/seed/profile-avatar/200/200" 
                         width={96}
                         height={96}
                         alt="User Avatar"
                         data-ai-hint="profile avatar"
                         className="rounded-full border-4 border-primary mb-4"
                       />
                       <h2 className="font-bold text-xl">@username</h2>
                       <p className="text-sm text-muted-foreground mt-1 mb-6">This is a bio, telling you about the user. Welcome to my page!</p>
                       <div className="w-full space-y-3">
                          <div className="bg-white/10 p-3 rounded-lg w-full text-center">Link 1</div>
                          <div className="bg-white/10 p-3 rounded-lg w-full text-center">Link 2</div>
                          <div className="bg-white/10 p-3 rounded-lg w-full text-center">Link 3</div>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
            <div className="text-left animate-fade-in-up" style={{ animationDelay: '1000ms' }}>
               <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight mb-6">All your links, one identity.</h2>
               <p className="text-muted-foreground mb-8 max-w-lg">
                  Stop juggling multiple links. Bind provides a single, beautiful page to house all your content, from social profiles to personal projects. It’s your digital identity, simplified.
               </p>
               <ul className="space-y-4">
                  {features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      <div className="p-1.5 bg-secondary/10 rounded-full border border-secondary/20 mt-1">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="font-semibold text-white">{feature.title}</h3>
                        <p className="text-muted-foreground text-sm">{feature.description}</p>
                      </div>
                    </li>
                  ))}
               </ul>
            </div>
          </div>
        </section>

         <section className="w-full max-w-4xl mx-auto pb-24">
           <div className="animate-fade-in-up" style={{ animationDelay: '1200ms' }}>
              <div className="flex items-center justify-center -space-x-2 mb-4">
                  <Users className="h-10 w-10 text-secondary p-1.5 bg-cyan-500/10 rounded-full" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold font-headline tracking-tight bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent pb-2">
                Join over 50,000 creators
              </h2>
              <p className="text-lg text-muted-foreground">
                They already use Bind to share their links and content with the world.
              </p>
           </div>
        </section>
      </main>
    </div>
  )
}
