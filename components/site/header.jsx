'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, Compass } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const links = [
  { href: '/', label: 'Home' },
  { href: '/tours', label: 'Tours' },
  { href: '/custom-tour', label: 'Custom Tour' },
  { href: '/blog', label: 'Journal' },
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
]

export default function SiteHeader() {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isHome = pathname === '/'
  const transparent = isHome && !scrolled

  return (
    <header className={cn(
      'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
      transparent ? 'bg-transparent' : 'bg-background/85 backdrop-blur-lg border-b border-border/50 shadow-sm'
    )}>
      <div className="container flex items-center justify-between h-20">
        <Link href="/" className="flex items-center gap-2 group">
          <span className={cn('flex items-center justify-center h-10 w-10 rounded-full transition-colors', transparent ? 'bg-white/15 text-white' : 'bg-primary text-primary-foreground')}>
            <Compass className="h-5 w-5" />
          </span>
          <span className={cn('font-display text-xl font-semibold tracking-tight', transparent ? 'text-white' : 'text-foreground')}>Tripnz</span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link key={l.href} href={l.href}
              className={cn(
                'px-4 py-2 text-sm font-medium rounded-full transition-colors',
                transparent ? 'text-white/90 hover:bg-white/10' : 'text-foreground/70 hover:text-foreground hover:bg-secondary',
                pathname === l.href && (transparent ? 'bg-white/15 text-white' : 'text-primary')
              )}>
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:flex items-center gap-2">
          <Button asChild size="sm" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full font-semibold px-5">
            <Link href="/tours">Book Now</Link>
          </Button>
        </div>

        <button className={cn('md:hidden p-2 rounded-md', transparent ? 'text-white' : 'text-foreground')} onClick={() => setOpen(!open)}>
          {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-background border-t border-border">
          <div className="container py-4 flex flex-col gap-1">
            {links.map(l => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}
                className={cn('px-4 py-3 rounded-lg text-sm font-medium', pathname === l.href ? 'bg-primary text-primary-foreground' : 'hover:bg-secondary')}>
                {l.label}
              </Link>
            ))}
            <Button asChild className="mt-2 bg-accent hover:bg-accent/90 text-accent-foreground">
              <Link href="/tours" onClick={() => setOpen(false)}>Book Now</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  )
}
