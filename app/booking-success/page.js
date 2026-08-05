'use client'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import { CheckCircle2, Mail, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Suspense } from 'react'

function Inner() {
  const params = useSearchParams()
  const ref = params.get('ref')
  const type = params.get('type')
  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="pt-32 pb-24">
        <div className="container max-w-2xl text-center">
          <div className="inline-flex h-24 w-24 rounded-full bg-primary/10 items-center justify-center mb-6">
            <CheckCircle2 className="h-14 w-14 text-primary" />
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-semibold mb-4">{type === 'custom' ? 'Request received!' : 'Booking confirmed!'}</h1>
          <p className="text-lg text-muted-foreground mb-6">Kia ora! We've received your {type === ’custom' ? 'custom journey request' : 'tour booking'} and our team will be in touch within 24 hours.</p>
          {ref && (
            <div className="inline-block bg-white border-2 border-dashed border-accent rounded-2xl px-8 py-5 mb-10">
              <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">Your Reference</div>
              <div className="font-display text-3xl font-bold text-primary">{ref}</div>
            </div>
          )}
          <div className="bg-secondary/40 rounded-2xl p-6 text-left mb-8">
            <div className="font-semibold mb-3">What happens next?</div>
            <ol className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">1</span> Our team reviews your details and prepares your itinerary.</li>
              <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">2</span> We'll WhatsApp / email you within 24 hours with pricing & options.</li>
              <li className="flex gap-3"><span className="h-6 w-6 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center flex-shrink-0">3</span> Confirm, pay a deposit, and pack your bags. See you soon!</li>
            </ol>
          </div>
          <div className="flex flex-wrap gap-3 justify-center">
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-full h-12 px-8"><Link href="/tours">Explore More Tours <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            <Button asChild variant="outline" className="rounded-full h-12 px-8"><Link href="/">Back to Home</Link></Button>
          </div>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}

function BookingSuccessPage() {
  return <Suspense fallback={<div />}> <Inner /> </Suspense>
}
export default BookingSuccessPage
