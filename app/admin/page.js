'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api-client'
import { Map, CalendarDays, Sparkles, MessageSquare, TrendingUp, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'

function AdminDashboard() {
  const [stats, setStats] = useState({ tours: 0, bookings: 0, custom: 0, contacts: 0, recent: [], revenue: 0 })

  useEffect(() => { api.get('/admin/stats').then(setStats).catch(() => {}) }, [])

  const cards = [
    { label: 'Total Tours', value: stats.tours, icon: Map, color: 'from-emerald-500 to-emerald-700' },
    { label: 'Bookings', value: stats.bookings, icon: CalendarDays, color: 'from-amber-500 to-orange-600' },
    { label: 'Custom Requests', value: stats.custom, icon: Sparkles, color: 'from-sky-500 to-blue-700' },
    { label: 'Enquiries', value: stats.contacts, icon: MessageSquare, color: 'from-rose-500 to-pink-700' },
  ]

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Overview</div>
          <h1 className="font-display text-4xl font-semibold">Kia ora, welcome back 👋</h1>
          <p className="text-muted-foreground mt-1">Here's what’s happening across your tours today.</p>
        </div>
        <div className="bg-white border border-border rounded-2xl px-5 py-3 flex items-center gap-3">
          <TrendingUp className="h-5 w-5 text-accent" />
          <div>
            <div className="text-xs uppercase tracking-widest text-muted-foreground">Est. Revenue</div>
            <div className="font-display text-xl font-bold">NZ${stats.revenue?.toLocaleString?.() || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map(c => (
          <div key={c.label} className="bg-white border border-border rounded-2xl p-6 relative overflow-hidden">
            <div className={`absolute -right-6 -top-6 h-24 w-24 rounded-full bg-gradient-to-br ${c.color} opacity-10`} />
            <c.icon className="h-6 w-6 text-primary mb-4" />
            <div className="font-display text-4xl font-bold">{c.value}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.label}</div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-xl font-semibold">Recent Bookings</h3>
          <Link href="/admin/bookings" className="text-sm text-accent font-semibold flex items-center gap-1 hover:gap-2 transition-all">View all <ArrowRight className="h-3.5 w-3.5" /></Link>
        </div>
        <div className="divide-y divide-border">
          {(stats.recent || []).length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No bookings yet. When guests book on the site, they'll show up here.</div>}
          {(stats.recent || []).map(b => (
            <div key={b.id} className="p-5 flex items-center justify-between hover:bg-secondary/40">
              <div className="flex-1 min-w-0">
                <div className="font-semibold">{b.fullName} <span className="text-xs font-mono text-muted-foreground ml-2">{b.bookingRef}</span></div>
                <div className="text-sm text-muted-foreground truncate">{b.tourTitle} • {b.adults} adults{b.children > 0 ? ` + ${b.children} kids` : ''} • {b.travelDate}</div>
              </div>
              <Badge variant={b.status === 'New' ? 'default' : 'secondary'}>{b.status}</Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
export default AdminDashboard
