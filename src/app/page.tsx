
import { Button } from '@/components/ui/button'
import Image from 'next/image'
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
    icon: <Link2 className="h-10 w-10 text-primary" />,
    title: 'Modern Biolinks',
    description: 'Create a stunning biolink page that houses all your important links in one place. Perfect for social media, portfolios, and more.',
  },
  {
    icon: <Brush className="h-10 w-10 text-primary" />,
    title: 'Deep Customization',
    description: 'Make your page truly yours. Customize backgrounds, buttons, fonts, and layouts to match your personal brand.',
  },
  {
    icon: <Bot className="h-10 w-10 text-primary" />,
    title: 'AI-Powered Backgrounds',
    description: 'Generate unique and beautiful background images for your profile simply by describing your interests in your bio.',
  },
  {
    icon: <BarChart className="h-10 w-10 text-primary" />,
    title: 'Analytics',
    description: 'Understand your audience better. Track link clicks, page views, and other important metrics to see what\'s working.',
  },
]

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/account');
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="fixed inset-0 -z-10 h-full w-full">
        <Image
          src="https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?q=80&w=2071&auto=format&fit=crop"
          alt="Background"
          fill
          style={{ objectFit: 'cover' }}
          className="opacity-10"
        />
      </div>
      <Header />
      <div className="h-[50vh] w-full" />
      <main className="flex-grow flex flex-col items-center text-center px-4 relative z-10 bg-gradient-to-b from-transparent via-[#100518] to-[#08020c]">
        <div className="max-w-4xl mx-auto pt-16 pb-24">
           <h1 
            className="text-5xl md:text-7xl font-bold text-white tracking-tight animate-fade-in-up"
            style={{ animationDelay: '200ms' }}
          >
            Everything you want, right here.
          </h1>
          <p>
            Bind is your go-to for modern, feature-rich biolinks and fast, secure file hosting. Everything you need — right here.
          </p>
          <div 
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up"
            style={{ animationDelay: '500ms' }}
          >
             <div className="relative w-full sm:w-auto">
              <div className="relative flex items-center w-full max-w-md mx-auto">
                <span className="absolute left-4 text-white/40">bind.us/</span>
                <Input
                  type="text"
                  placeholder="username"
                  className="w-full h-12 pr-32 pl-20 rounded-lg bg-white/10 text-white border-white/20 placeholder:text-white/40"
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
        </div>
        
        <section className="w-full max-w-6xl mx-auto pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <Card 
                  key={index}
                  className="bg-card/50 backdrop-blur-sm border-white/10 text-left animate-fade-in-up"
                  style={{ animationDelay: `${index * 150 + 650}ms` }}
                >
                  <CardHeader>
                    {feature.icon}
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="text-xl font-bold mb-2">{feature.title}</CardTitle>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </section>

      </main>
      <Footer />
    </div>
  )
}
