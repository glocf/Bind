import { Link, Globe } from 'lucide-react'
import { socialPresets, socialIcons } from './social-icons'

export function getIconForUrl(url: string): React.ComponentType<{ className?: string }> {
  try {
    if (!url || !url.startsWith('http')) return Link;
    const domain = new URL(url).hostname.replace('www.', '')
    
    const preset = socialPresets.find(p => domain.includes(p.domain))
    if (preset) {
      return preset.icon
    }

    if (domain.includes('')) return Globe
  } catch (e) {
    // Invalid URL
  }
  return Link
}
