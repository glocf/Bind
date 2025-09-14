import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/header'
import Footer from '@/components/footer'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { Input } from '@/components/ui/input'

export default async function Home() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    redirect('/account');
  }

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-[#100518] to-[#08020c]">
      <div className="absolute inset-0 opacity-[.03] bg-[url('https://www.transparenttextures.com/patterns/gplay.png')] bg-repeat"></div>
      <Header />
      <main className="flex-grow flex flex-col items-center justify-center text-center px-4 relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-7xl font-bold text-white tracking-tight">
            Everything you want, right here.
          </h1>
          <p className="mt-6 text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Bind is your go-to for modern, feature-rich biolinks and fast, secure file hosting. Everything you need — right here.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <div className="relative w-full sm:w-auto">
              <Input 
                type="text" 
                placeholder="bind.us/username" 
                className="bg-zinc-900/50 border-white/20 text-white placeholder:text-white/40 h-12 pl-4 pr-32 rounded-lg focus:ring-primary/50" 
              />
            </div>
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary text-primary-foreground font-semibold hover:bg-primary/90"
              asChild
            >
              <Link href="/account">Claim Now</Link>
            </Button>
          </div>
        </div>
        
        <div className="w-full max-w-6xl mx-auto mt-20 relative">
          <Image 
            src="https://cdn.discordapp.com/attachments/1258525740131487747/1262952877134381156/image.png?ex=6698797f&is&hm=13d100741275988e05c93c4113b28b6d87e35b0b2f56f43e3d93de2f7a9446f0&"
            alt="Product preview"
            width={1200}
            height={750}
            className="w-full h-auto rounded-xl shadow-2xl shadow-primary/10"
          />
        </div>
      </main>
      <Footer />
    </div>
  )
}
