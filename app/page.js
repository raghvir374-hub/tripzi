'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import TourCard from '@/components/site/tour-card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowRight, Search, Award, Users, Sparkles, ShieldCheck, MapPin, Star, PlayCircle, ChevronDown } from 'lucide-react'
import { motion } from 'framer-motion'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'

function Home() {
  const [tours, setTours] = useState([])
  const [settings, setSettings] = useState({})
  const [destinations, setDestinations] = useState([])
  const [testimonials, setTestimonials] = useState([])
  const [faqs, setFaqs] = useState([])
  const [openFaq, setOpenFaq] = useState(0)

  useEffect(() => {
    api.get('/tours?featured=true').then(setTours).catch(() => {})
    api.get('/settings').then(setSettings).catch(() => {})
    api.get('/destinations').then(d => setDestinations(Array.isArray(d) ? d : [])).catch(() => {})
    api.get('/testimonials').then(d => setTestimonials(Array.isArray(d) ? d : [])).catch(() => {})
    api.get('/faqs').then(d => setFaqs(Array.isArray(d) ? d : [])).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* HERO */}
      <section className="relative h-[100vh] min-h-[720px] w-full overflow-hidden">
        <img src={settings.heroImage || 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85'}
          alt="New Zealand" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-hero-gradient" />
        <div className="relative container h-full flex flex-col justify-center pt-20 text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/10 backdrop-blur border border-white/20 px-4 py-1.5 text-xs uppercase tracking-widest mb-6">
              <Sparkles className="h-3.5 w-3.5 text-accent" /> Curated Aotearoa journeys
            </div>
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl leading-[0.95] font-semibold text-balance mb-6">
              {(settings.heroTitle || 'Aotearoa, on your terms.').split(',').map((part, i, arr) => (
                <span key={i} className={i === arr.length - 1 && arr.length > 1 ? 'italic text-accent block' : 'block'}>
                  {part.trim()}{i < arr.length - 1 ? ',' : ''}
                </span>
              ))}
            </h1>
            <p className="text-lg md:text-xl text-white/85 max-w-2xl leading-relaxed mb-10">
              {settings.heroSubtitle || 'Hand-crafted private tours across New Zealand — from Middle-earth to the Emerald Lakes.'}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-full h-14 px-8 text-base">
                <Link href="/tours">Explore Tours <ArrowRight className="ml-2 h-4 w-4" /></Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="h-14 px-8 rounded-full border-white/30 bg-white/5 backdrop-blur text-white hover:bg-white/15 hover:text-white text-base">
                <Link href="/custom-tour"><PlayCircle className="mr-2 h-4 w-4" /> Design Your Own</Link>
              </Button>
            </div>
          </motion.div>

          {/* Search / Quick booking */}
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, delay: 0.2 }}
            className="absolute bottom-10 left-4 right-4 md:left-8 md:right-8 lg:left-auto lg:right-8 lg:w-auto">
            <div className="container">
              <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl p-4 md:p-6 grid grid-cols-1 md:grid-cols-4 gap-3 items-end">
                <div className="md:col-span-2">
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Where to?</label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Hobbiton, Taupo, Tongariro..." className="pl-9 h-11 text-foreground bg-white border-border" />
                  </div>
                </div>
                <div>
                  <label className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Travel Date</label>
                  <Input type="date" className="mt-1 h-11 text-foreground bg-white border-border" />
                </div>
                <Button asChild className="h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-lg">
                  <Link href="/tours">Search Tours</Link>
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FEATURED TOURS */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
            <div>
              <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Signature Journeys</div>
              <h2 className="font-display text-4xl md:text-5xl font-semibold text-balance max-w-2xl">Our most-loved New Zealand experiences</h2>
            </div>
            <Button asChild variant="outline" size="lg" className="rounded-full border-primary/20">
              <Link href="/tours">View All Tours <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {(tours || []).slice(0, 6).map(t => <TourCard key={t.id} tour={t} />)}
          </div>
        </div>
      </section>

      {/* DESTINATIONS */}
      <section className="py-24 bg-secondary/40">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Popular Destinations</div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold">Six regions, one unforgettable island story</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
            {destinations.map(d => (
              <div key={d.name} className="relative aspect-[3/4] rounded-2xl overflow-hidden group cursor-pointer">
                <img src={d.img} alt={d.name} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-card-gradient" />
                <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                  <div className="text-[10px] uppercase tracking-widest opacity-80">{d.tag}</div>
                  <div className="font-display text-xl font-semibold">{d.name}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-background">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="grid grid-cols-2 gap-4">
              <img src="https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85"
                className="rounded-2xl aspect-[3/4] object-cover w-full" />
              <img src="https://images.unsplash.com/photo-1590002893558-64f0d58dcca4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHxIb2JiaXRvbnxlbnwwfHx8fDE3ODU5MjIyNzd8MA&ixlib=rb-4.1.0&q=85"
                className="rounded-2xl aspect-[3/4] object-cover w-full mt-10" />
            </div>
            <div className="absolute -bottom-6 left-6 bg-white shadow-2xl rounded-2xl p-5 flex items-center gap-4 max-w-xs">
              <div className="h-14 w-14 rounded-full bg-accent flex items-center justify-center"><Award className="h-7 w-7 text-accent-foreground" /></div>
              <div>
                <div className="font-display text-2xl font-bold">12+ yrs</div>
                <div className="text-sm text-muted-foreground">Guiding Aotearoa</div>
              </div>
            </div>
          </div>
          <div>
            <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Why Tripzi</div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-balance">Small teams. Local guides. Zero corner-cutting.</h2>
            <p className="text-muted-foreground text-lg mb-8 leading-relaxed">We're a boutique tour operator based in Auckland, run by Kiwis who’ve spent decades exploring every corner of these islands. Every journey is private, hand-planned, and executed by a certified local guide.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                { icon: ShieldCheck, title: '100% Private', desc: 'Just your party. No random pack-ins.' },
                { icon: Users, title: 'Local Kiwi Guides', desc: 'Certified & storytelling-obsessed.' },
                { icon: Sparkles, title: 'Bespoke Itineraries', desc: 'Tell us the vibe, we plan the miles.' },
                { icon: Award, title: '4.9★ Traveller Rating', desc: 'Across 1,200+ private tours.' },
              ].map(f => (
                <div key={f.title} className="flex gap-4">
                  <div className="h-11 w-11 rounded-full bg-primary/10 text-primary flex items-center justify-center flex-shrink-0"><f.icon className="h-5 w-5" /></div>
                  <div>
                    <div className="font-semibold mb-1">{f.title}</div>
                    <div className="text-sm text-muted-foreground">{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-[hsl(165,40%,10%)] text-white">
        <div className="container">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Traveller Stories</div>
            <h2 className="font-display text-4xl md:text-5xl font-semibold">Loved by adventurers, honeymooners &amp; families</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(t => (
              <div key={t.name} className="bg-white/5 border border-white/10 rounded-2xl p-8 backdrop-blur">
                <div className="flex gap-1 mb-4">{[...Array(5)].map((_,i) => <Star key={i} className="h-4 w-4 fill-accent text-accent" />)}</div>
                <p className="text-white/85 leading-relaxed mb-6">“{t.text}”</p>
                <div className="flex items-center gap-3">
                  <img src={t.avatar} alt={t.name} className="h-12 w-12 rounded-full object-cover" />
                  <div><div className="font-semibold">{t.name}</div><div className="text-sm text-white/60">{t.country}</div></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container max-w-3xl">
            <div className="text-center mb-14">
              <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Good to Know</div>
              <h2 className="font-display text-4xl md:text-5xl font-semibold">Frequently asked questions</h2>
            </div>
            <div className="space-y-3">
              {faqs.map((f, i) => (
                <div key={f.id} className={cn('bg-white border rounded-2xl overflow-hidden transition-all', openFaq === i ? 'border-primary shadow-md' : 'border-border')}>
                  <button onClick={() => setOpenFaq(openFaq === i ? -1 : i)}
                    className="w-full px-6 py-5 flex items-center justify-between gap-4 text-left">
                    <span className="font-display text-lg font-semibold pr-4">{f.question}</span>
                    <ChevronDown className={cn('h-5 w-5 text-muted-foreground flex-shrink-0 transition-transform', openFaq === i && 'rotate-180 text-primary')} />
                  </button>
                  {openFaq === i && (
                    <div className="px-6 pb-6 -mt-1 text-muted-foreground leading-relaxed whitespace-pre-wrap">{f.answer}</div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="py-24 bg-background">
        <div className="container">
          <div className="relative overflow-hidden rounded-3xl">
            <img src="https://images.unsplash.com/photo-1584877745572-ea9b2bcee602?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwyfHxUb25nYXJpcm98ZW58MHx8fHwxNzg1OTIyMjc3fDA&ixlib=rb-4.1.0&q=85" className="absolute inset-0 w-full h-full object-cover" alt="" />
            <div className="absolute inset-0 bg-gradient-to-r from-[hsl(165,40%,10%)]/95 via-[hsl(165,40%,10%)]/70 to-transparent" />
            <div className="relative p-10 md:p-16 lg:p-20 max-w-2xl text-white">
              <h2 className="font-display text-4xl md:text-5xl font-semibold mb-6 text-balance">Ready to write your Aotearoa story?</h2>
              <p className="text-white/85 text-lg mb-8">Tell us your dream trip — your dates, your pace, your must-sees — and we'll design the itinerary within 24 hours.</p>
              <div className="flex flex-wrap gap-3">
                <Button asChild size="lg" className="bg-accent hover:bg-accent/90 text-accent-foreground rounded-full h-13 px-8 font-semibold">
                  <Link href="/custom-tour">Start Custom Journey</Link>
                </Button>
                <Button asChild variant="outline" size="lg" className="rounded-full h-13 px-8 border-white/40 bg-white/5 text-white hover:bg-white/15 hover:text-white">
                  <Link href="/contact">Talk to a Human</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default Home
