import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bot, Brush, Globe, Link2, Users } from 'lucide-react'

const features = [
  {
    icon: <Globe className="h-8 w-8 text-white" />,
    title: 'Modern Biolinks',
    description: 'Create a stunning biolink page that houses all your important links in one place.',
  },
  {
    icon: <Brush className="h-8 w-8 text-white" />,
    title: 'Advanced Customization',
    description: 'Make your page truly yours. Customize backgrounds, buttons, fonts, and layouts.',
  },
  {
    icon: <Bot className="h-8 w-8 text-white" />,
    title: 'AI-Powered Backgrounds',
    description: 'Generate unique background images for your profile simply by describing your interests.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-white" />,
    title: 'Detailed Analytics',
    description: 'Track link clicks and page views to understand your audience better.',
  },
]

export default async function Home() {
  const supabase = await createClient();
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div
                key={index}
                className="relative group animate-fade-in-up"
                style={{ animationDelay: `${index * 150 + 650}ms` }}
              >
                <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-secondary rounded-lg blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-aurora"></div>
                <Card className="relative bg-card text-left h-full">
                  <CardHeader>
                    {feature.icon}
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl font-bold mb-2 text-white">{feature.title}</CardTitle>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </div>
            ))}
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
      <Footer />
    </div>
  )
}
