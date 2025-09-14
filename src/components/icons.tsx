import { Link, Github, Twitter, Instagram, Youtube, Twitch, Linkedin } from 'lucide-react'

export function getIconForUrl(url: string): React.ComponentType<{ className?: string }> {
  try {
    const domain = new URL(url).hostname.replace('www.', '')
    if (domain.includes('github.com')) return Github
    if (domain.includes('twitter.com') || domain.includes('x.com')) return Twitter
    if (domain.includes('instagram.com')) return Instagram
    if (domain.includes('youtube.com')) return Youtube
    if (domain.includes('twitch.tv')) return Twitch
    if (domain.includes('linkedin.com')) return Linkedin
  } catch (e) {
    // Invalid URL
  }
  return Link
}
