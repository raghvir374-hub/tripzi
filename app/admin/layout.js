'use client'
import { useEffect, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Compass, LayoutDashboard, Map, CalendarDays, Sparkles, MessageSquare, Settings, LogOut, Menu, X, Car, Image, Quote, HelpCircle, Info, BookOpen } from 'lucide-react'
import { cn } from '@/lib/utils'

const nav = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/tours', label: 'Tours', icon: Map },
  { href: '/admin/bookings', label: 'Bookings', icon: CalendarDays },
  { href: '/admin/drivers', label: 'Drivers', icon: Car },
  { href: '/admin/custom-tours', label: 'Custom Requests', icon: Sparkles },
  { href: '/admin/contacts', label: 'Contact Enquiries', icon: MessageSquare },
  { href: '/admin/blog', label: 'Blog / Stories', icon: BookOpen },
  { href: '/admin/destinations', label: 'Destinations', icon: Image },
  { href: '/admin/testimonials', label: 'Testimonials', icon: Quote },
  { href: '/admin/faqs', label: 'FAQs', icon: HelpCircle },
  { href: '/admin/settings', label: 'Site & About', icon: Settings },
]

export default function AdminLayout({ children }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checking, setChecking] = useState(true)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (pathname === '/admin/login') { setChecking(false); return }
    const t = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!t) { router.replace('/admin/login'); return }
    fetch('/api/admin/me', { headers: { Authorization: `Bearer ${t}` } })
      .then(r => r.json())
      .then(d => { if (d.error) { localStorage.removeItem('admin_token'); router.replace('/admin/login') } else { setChecking(false) } })
  }, [pathname, router])

  if (pathname === '/admin/login') return children
  if (checking) return <div className="min-h-screen flex items-center justify-center">Loading admin...</div>

  function logout() {
    const t = localStorage.getItem('admin_token')
    fetch('/api/admin/logout', { method: 'POST', headers: { Authorization: `Bearer ${t}` } })
    localStorage.removeItem('admin_token')
    router.replace('/admin/login')
  }

  return (
    <div className="min-h-screen flex bg-secondary/30">
      {/* Sidebar */}
      <aside className={cn('fixed lg:sticky top-0 left-0 h-screen w-64 bg-[hsl(165,40%,10%)] text-white flex-shrink-0 z-40 transform transition-transform flex flex-col', open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0')}>
        <div className="h-20 flex items-center gap-2 px-6 border-b border-white/10 flex-shrink-0">
          <span className="flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground"><Compass className="h-5 w-5" /></span>
          <div><div className="font-display text-lg font-semibold">Tripnz</div><div className="text-[10px] uppercase tracking-widest opacity-70">Admin</div></div>
        </div>
        <nav className="p-4 space-y-1 flex-1 overflow-y-auto">
          {nav.map(n => {
            const active = pathname === n.href || (n.href !== '/admin' && pathname.startsWith(n.href))
            return (
              <Link key={n.href} href={n.href} onClick={() => setOpen(false)}
                className={cn('flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition', active ? 'bg-accent text-accent-foreground' : 'text-white/80 hover:bg-white/10')}>
                <n.icon className="h-4 w-4" /> {n.label}
              </Link>
            )
          })}
        </nav>
        <button onClick={logout} className="m-4 flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-white/80 hover:bg-white/10 flex-shrink-0">
          <LogOut className="h-4 w-4" /> Sign Out
        </button>
      </aside>

      <div className="flex-1 min-w-0">
        {/* Topbar for mobile */}
        <div className="lg:hidden flex items-center justify-between h-16 px-4 bg-white border-b border-border">
          <button onClick={() => setOpen(!open)} className="p-2">{open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}</button>
          <span className="font-display font-semibold">Tripnz Admin</span>
          <div className="w-9" />
        </div>
        <main className="p-6 md:p-10">{children}</main>
      </div>
    </div>
  )
}
