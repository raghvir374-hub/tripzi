'use client'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import { Award, Users, MapPin, Sparkles } from 'lucide-react'

function AboutPage() {
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative pt-32 pb-16">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">About Kiwi Trails</div>
            <h1 className="font-display text-5xl md:text-6xl font-semibold mb-6 text-balance">Aotearoa, told by the people who love it most.</h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-6">We are a small team of Auckland-based Kiwis obsessed with sharing New Zealand the right way — slowly, intimately and always in private company. Since 2013 we've guided over 3,000 travellers across every region of our two islands.</p>
            <p className="text-lg text-muted-foreground leading-relaxed">No mass buses. No rushed stops. Just you, your group, a certified local guide and a private vehicle — crafting a story you'll tell for years.</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <img src="https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85" className="rounded-2xl aspect-[3/4] object-cover" />
            <img src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHx0cmF2ZWwlMjBidXN8ZW58MHx8fHwxNzg1OTIyMzIwfDA&ixlib=rb-4.1.0&q=85" className="rounded-2xl aspect-[3/4] object-cover mt-10" />
          </div>
        </div>
      </section>

      <section className="py-16 bg-secondary/40">
        <div className="container grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { icon: Users, num: '3,000+', label: 'Happy Travellers' },
            { icon: MapPin, num: '42', label: 'NZ Destinations' },
            { icon: Award, num: '4.9★', label: 'Average Rating' },
            { icon: Sparkles, num: '12yrs', label: 'Guiding Aotearoa' },
          ].map(s => (
            <div key={s.label} className="bg-white rounded-2xl p-6 text-center">
              <s.icon className="h-6 w-6 text-accent mx-auto mb-3" />
              <div className="font-display text-3xl font-bold">{s.num}</div>
              <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
export default AboutPage
