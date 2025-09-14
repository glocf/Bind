import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'
import Header from '@/components/header'

export default function Home() {
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
            LinkSmash is your go-to for modern, feature-rich biolinks and fast, secure file hosting. Everything you need — right here.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              className="w-full sm:w-auto bg-primary-foreground text-primary hover:bg-primary-foreground/90 font-semibold"
              asChild
            >
              <Link href="/account">Sign Up for Free</Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto font-semibold border-white/20 hover:bg-white/5 hover:text-white">
              View Pricing
            </Button>
          </div>
        </div>
        
        <div className="w-full max-w-6xl mx-auto mt-20 relative">
          <Image 
            src="https://cdn.discordapp.com/attachments/1258525740131487747/1262847525227204618/image.png?ex=66981881&is=6696c701&hm=4a7c0612711d943da39d54e19b5fd00318d10b77b78a9c372f6a5b78f0b71946&"
            alt="Product preview"
            width={1200}
            height={750}
            className="w-full h-auto rounded-xl shadow-2xl shadow-primary/10"
          />
        </div>
      </main>
    </div>
  )
}