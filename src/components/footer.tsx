import Link from 'next/link'
import { Badge } from './ui/badge'
import { Button } from './ui/button'

const GunIcon = () => (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-primary-foreground">
        <path d="M14.5858 9.41421L18.8284 5.17157L20.2426 6.58579L16 10.8284L15.2929 11.5355L14.5858 12.2426L12.4645 14.364L13.1716 15.0711L14.5858 13.6569L19.5355 18.6066L18.1213 20.0208L13.1716 15.0711L11.7574 16.4853L10.3431 15.0711L3 22.4142L1.58579 21L8.92893 13.6569L7.51472 12.2426L6.10051 13.6569L4.68629 12.2426L9.63604 7.29289L10.3431 6.58579L11.7574 5.17157L14.5858 7.99999L14.5858 9.41421Z" fill="currentColor"/>
    </svg>
)

const SocialIcon = ({ href, children }: { href: string, children: React.ReactNode }) => (
    <a href={href} target="_blank" rel="noopener noreferrer" className="text-white/50 hover:text-white transition-colors">
        {children}
    </a>
)

export default function Footer() {
  return (
    <footer className="bg-[#050108] text-white/80 py-12 px-4 sm:px-6 lg:px-8">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <GunIcon />
              <span className="font-bold text-lg text-white">Bind</span>
              <Badge variant="secondary" className="bg-green-500/10 text-green-400 border-green-500/20">
                <span className="relative flex h-2 w-2 mr-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                System Status
              </Badge>
            </div>
            <p className="text-sm text-white/50 max-w-xs">
              Create feature-rich, customizable and modern link-in-bio pages with Bind.
            </p>
            <div className="flex items-center space-x-4 mt-4">
                <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14.5 10c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2Z"/><path d="M12 18.5c-4.3 0-8.2-2.3-10-5.5.3-.8.7-1.5 1.2-2.1.2-.3.5-.6.8-.8 1.1-.9 2.4-1.5 3.8-1.9 1-.3 2-.5 3.1-.5h.1c1.1 0 2.2.2 3.2.5 1.4.4 2.7 1 3.8 1.9.3.2.6.5.8.8.6.6 1 1.3 1.2 2.1-1.8 3.2-5.7 5.5-10 5.5Z"/></svg></SocialIcon>
                <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg></SocialIcon>
                <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg></SocialIcon>
                <SocialIcon href="#"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 2.8 3.2 3 5.2-2.7-1.4-5.3-2.1-8-2.1s-5.3.7-8 2.1c.2-2 1.4-3.8 3-5.2-1.3-1.3-2-3.4-2-3.4s.7-1.4 2-1.4c.7 0 1.3.3 1.6.8C8.7 5.3 9.8 6 12 6s3.3-.7 4.4-1.6c.3-.5 1-.8 1.6-.8 1.3 0 2 1.4 2 1.4Z"/></svg></SocialIcon>
            </div>
          </div>
          
          <div className="text-sm">
            <h4 className="font-semibold text-white mb-4">General</h4>
            <ul className="space-y-3">
              <li><Link href="/login" className="hover:text-white transition-colors">Login</Link></li>
              <li><Link href="/account" className="hover:text-white transition-colors">Sign Up</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Pricing</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Website Status</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <h4 className="font-semibold text-white mb-4">Resources</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Help Center</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Changelog</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Redeem Code</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Salad.com Product</Link></li>
            </ul>
          </div>

          <div className="text-sm">
            <h4 className="font-semibold text-white mb-4">Contact</h4>
            <ul className="space-y-3">
              <li><Link href="#" className="hover:text-white transition-colors">Discord Server</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Support Email</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Business Email</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Legal Email</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center text-sm text-white/50">
          <p>Copyright © 2024 Bind. All Rights Reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Copyright Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
