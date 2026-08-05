'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Check, X, MapPin, Clock, Users, Calendar, Sparkles, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

function TourDetailPage() {
  const { slug } = useParams()
  const router = useRouter()
  const [tour, setTour] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeImg, setActiveImg] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [form, setForm] = useState({
    fullName: '', email: '', phone: '', whatsapp: '',
    travelDate: '', adults: 2, children: 0, pickupLocation: '', specialRequirements: ''
  })

  useEffect(() => {
    fetch(`/api/tours/${slug}`).then(r => r.json()).then(d => { setTour(d); setLoading(false) })
  }, [slug])

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>
  if (!tour || tour.error) return <div className="min-h-screen flex items-center justify-center">Tour not found.</div>

  const images = tour.images?.length ? tour.images : [tour.featuredImage]

  async function submitBooking(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, tourId: tour.id, tourTitle: tour.title })
      })
      const data = await res.json()
      if (data.error) { toast.error(data.error); return }
      router.push(`/booking-success?ref=${data.bookingRef}`)
    } catch (err) {
      toast.error('Booking failed. Try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />

      {/* Gallery */}
      <section className="pt-24 pb-8">
        <div className="container">
          <Link href="/tours" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary mb-6"><ArrowLeft className="h-4 w-4" /> All Tours</Link>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 rounded-2xl overflow-hidden">
            <div className="lg:col-span-2 relative aspect-[16/10] lg:aspect-auto">
              <img src={images[activeImg]} alt={tour.title} className="absolute inset-0 w-full h-full object-cover" />
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-1 gap-3">
              {images.slice(0, 4).map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className={`relative aspect-square lg:aspect-[16/10] overflow-hidden rounded-lg ${activeImg === i ? 'ring-2 ring-accent' : ''}`}>
                  <img src={img} className="absolute inset-0 w-full h-full object-cover hover:scale-105 transition" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2">
            <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-accent font-semibold mb-3"><Sparkles className="h-3 w-3" /> {tour.category}</div>
            <h1 className="font-display text-4xl md:text-5xl font-semibold text-balance mb-4">{tour.title}</h1>
            <div className="flex flex-wrap gap-6 text-sm text-muted-foreground mb-8">
              <span className="flex items-center gap-1.5"><MapPin className="h-4 w-4" /> {tour.location}</span>
              <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" /> {tour.duration}</span>
              <span className="flex items-center gap-1.5"><Users className="h-4 w-4" /> Private group</span>
            </div>

            <p className="text-lg text-foreground/80 leading-relaxed mb-10">{tour.description}</p>

            {tour.highlights?.length > 0 && (
              <div className="mb-10">
                <h2 className="font-display text-2xl font-semibold mb-4">Highlights</h2>
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {tour.highlights.map((h,i) => (
                    <li key={i} className="flex items-start gap-2"><Sparkles className="h-4 w-4 text-accent mt-1 flex-shrink-0" /> <span>{h}</span></li>
                  ))}
                </ul>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-display text-xl font-semibold mb-3 text-primary">Included</h3>
                <ul className="space-y-2">
                  {(tour.included || []).map((x,i) => <li key={i} className="flex items-start gap-2 text-sm"><Check className="h-4 w-4 text-primary mt-0.5" /> {x}</li>)}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-xl font-semibold mb-3 text-muted-foreground">Not Included</h3>
                <ul className="space-y-2">
                  {(tour.excluded || []).map((x,i) => <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground"><X className="h-4 w-4 mt-0.5" /> {x}</li>)}
                </ul>
              </div>
            </div>

            <div className="mt-10 p-6 bg-secondary/40 rounded-2xl">
              <div className="font-semibold mb-1">Meeting Point</div>
              <div className="text-muted-foreground">{tour.meetingPoint}</div>
            </div>
          </div>

          {/* Booking form (sticky) */}
          <div className="lg:col-span-1">
            <div className="sticky top-28 bg-white border border-border rounded-2xl shadow-xl overflow-hidden">
              <div className="bg-primary text-primary-foreground p-6">
                <div className="text-xs uppercase tracking-widest opacity-80">From</div>
                <div className="flex items-baseline gap-2">
                  <span className="font-display text-4xl font-bold">NZ${tour.price}</span>
                  <span className="text-sm opacity-80">/ person</span>
                </div>
              </div>
              <form onSubmit={submitBooking} className="p-6 space-y-4">
                <div>
                  <Label>Full Name</Label>
                  <Input required value={form.fullName} onChange={e => setForm({...form, fullName: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Email</Label><Input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} /></div>
                  <div><Label>Phone</Label><Input required value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} /></div>
                </div>
                <div>
                  <Label>WhatsApp Number</Label>
                  <Input value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} placeholder="Same as phone if empty" />
                </div>
                <div>
                  <Label className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> Travel Date</Label>
                  <Input type="date" required value={form.travelDate} onChange={e => setForm({...form, travelDate: e.target.value})} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div><Label>Adults</Label><Input type="number" min="1" value={form.adults} onChange={e => setForm({...form, adults: e.target.value})} /></div>
                  <div><Label>Children</Label><Input type="number" min="0" value={form.children} onChange={e => setForm({...form, children: e.target.value})} /></div>
                </div>
                <div>
                  <Label>Pickup Location</Label>
                  <Input value={form.pickupLocation} onChange={e => setForm({...form, pickupLocation: e.target.value})} placeholder="Hotel name or address" />
                </div>
                <div>
                  <Label>Special Requirements</Label>
                  <Textarea rows={3} value={form.specialRequirements} onChange={e => setForm({...form, specialRequirements: e.target.value})} placeholder="Dietary, accessibility, etc." />
                </div>
                <Button type="submit" disabled={submitting} className="w-full h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base rounded-lg">
                  {submitting ? 'Booking...' : 'Request Booking'}
                </Button>
                <p className="text-[11px] text-muted-foreground text-center">No card required. We'll confirm within 24 hours.</p>
              </form>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  )
}

export default TourDetailPage
