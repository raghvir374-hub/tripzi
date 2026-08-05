'use client'
import { useEffect, useState, useMemo } from 'react'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import TourCard from '@/components/site/tour-card'
import { Input } from '@/components/ui/input'
import { Search } from 'lucide-react'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'

const CATEGORIES = ['All', 'Nature', 'Cultural', 'Adventure', 'City']

function ToursPage() {
  const [tours, setTours] = useState([])
  const [category, setCategory] = useState('All')
  const [q, setQ] = useState('')

  useEffect(() => {
    api.get('/tours').then(setTours).catch(() => {})
  }, [])

  const filtered = useMemo(() => {
    return (tours || []).filter(t =>
      (category === 'All' || t.category === category) &&
      (q === '' || t.title.toLowerCase().includes(q.toLowerCase()) || t.location.toLowerCase().includes(q.toLowerCase()))
    )
  }, [tours, category, q])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative pt-32 pb-16 bg-secondary/30">
        <div className="container">
          <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">All Journeys</div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold mb-4">Discover New Zealand</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">From volcanic alpine crossings to sunlit Bay of Plenty coastlines, every tour is a hand-picked private experience.</p>

          <div className="mt-10 flex flex-col md:flex-row gap-4 md:items-center md:justify-between">
            <div className="flex flex-wrap gap-2">
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setCategory(c)}
                  className={cn('px-5 py-2 rounded-full text-sm font-medium border transition', category === c ? 'bg-primary text-primary-foreground border-primary' : 'bg-white border-border hover:border-primary/40')}>
                  {c}
                </button>
              ))}
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input value={q} onChange={e => setQ(e.target.value)} placeholder="Search tours..." className="pl-9 h-11 bg-white" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          {filtered.length === 0 ? (
            <div className="text-center py-24 text-muted-foreground">No tours match your search.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map(t => <TourCard key={t.id} tour={t} />)}
            </div>
          )}
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default ToursPage
