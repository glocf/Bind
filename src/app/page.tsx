import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { Header } from '@/components/header'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { BarChart, Bot, Brush, Link2 } from 'lucide-react'

const features = [
  {
    icon: <Link2 className="h-8 w-8 text-white" />,
    title: 'Modern Biolinks',
    description: 'Create a stunning biolink page that houses all your important links in one place. Perfect for social media, portfolios, and more.',
  },
  {
    icon: <Brush className="h-8 w-8 text-white" />,
    title: 'Deep Customization',
    description: 'Make your page truly yours. Customize backgrounds, buttons, fonts, and layouts to match your personal brand.',
  },
  {
    icon: <Bot className="h-8 w-8 text-white" />,
    title: 'AI-Powered Backgrounds',
    description: 'Generate unique background images for your profile simply by describing your interests.',
  },
  {
    icon: <BarChart className="h-8 w-8 text-white" />,
    title: 'Analytics',
    description: 'Understand your audience better. Track link clicks, page views, and other important metrics to see what\'s working.',
  },
]

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/account');
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
      <div className="fixed inset-0 -z-10 h-full w-full animate-background-pan bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      <Header />
      <main className="flex-grow flex flex-col items-center text-center px-4 pt-24 md:pt-32">
        <div className="max-w-4xl mx-auto pb-24">
          <div className="animate-fade-in-up" style={{ animationDelay: '200ms' }}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight bg-gradient-to-b from-white to-white/70 bg-clip-text text-transparent">
              Everything you want, right here.
            </h1>
            <p className="mt-6 text-lg text-white/70 max-w-2xl mx-auto">
              Bind is your go-to for modern, feature-rich biolinks and fast, secure file hosting. Everything you need — right here.
            </p>
          </div>
          <div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
            <div className="relative w-full max-w-md mx-auto">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">bind.us/</span>
              <Input
                type="text"
                placeholder="username"
                className="w-full h-12 pr-32 pl-20 rounded-lg bg-white/5 text-white border-white/20 placeholder:text-white/40 focus:ring-primary/50"
              />
              <Button
                size="lg"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-10 w-auto bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
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
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg blur opacity-20 group-hover:opacity-60 transition duration-1000 group-hover:duration-200 animate-aurora"></div>
                <Card className="relative bg-card/80 backdrop-blur-sm border-white/10 text-left h-full">
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
      </main>
      <Footer />
    </div>
  )
}
