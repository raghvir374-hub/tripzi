'use client'
import { useEffect, useState } from 'react'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import { Award, Users, MapPin, Sparkles } from 'lucide-react'

function AboutPage() {
  const [s, setS] = useState({})
  useEffect(() => { fetch('/api/settings').then(r => r.json()).then(setS) }, [])

  const stats = [
    { icon: Users, num: s.aboutStat1Value, label: s.aboutStat1Label },
    { icon: MapPin, num: s.aboutStat2Value, label: s.aboutStat2Label },
    { icon: Award, num: s.aboutStat3Value, label: s.aboutStat3Label },
    { icon: Sparkles, num: s.aboutStat4Value, label: s.aboutStat4Label },
  ].filter(x => x.num || x.label)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative pt-32 pb-16">
        <div className="container grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">{s.aboutTagline || 'About Tripzi'}</div>
            <h1 className="font-display text-5xl md:text-6xl font-semibold mb-6 text-balance">{s.aboutHeadline || 'Aotearoa, told by the people who love it most.'}</h1>
            <div className="text-lg text-muted-foreground leading-relaxed space-y-4 whitespace-pre-wrap">{s.aboutBody || 'Loading...'}</div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {s.aboutImage1 && <img src={s.aboutImage1} className="rounded-2xl aspect-[3/4] object-cover" />}
            {s.aboutImage2 && <img src={s.aboutImage2} className="rounded-2xl aspect-[3/4] object-cover mt-10" />}
          </div>
        </div>
      </section>

      {stats.length > 0 && (
        <section className="py-16 bg-secondary/40">
          <div className="container grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((st, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center">
                <st.icon className="h-6 w-6 text-accent mx-auto mb-3" />
                <div className="font-display text-3xl font-bold">{st.num}</div>
                <div className="text-sm text-muted-foreground mt-1">{st.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}
      <SiteFooter />
    </div>
  )
}
export default AboutPage
