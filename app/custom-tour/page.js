'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Sparkles } from 'lucide-react'
import { toast } from 'sonner'

function CustomTourPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [f, setF] = useState({
    name: '', email: '', phone: '', whatsapp: '',
    destinations: '', arrivalDate: '', departureDate: '',
    adults: 2, children: 0, budget: '',
    preferredVehicle: 'Luxury SUV', hotelRequired: 'Yes', airportPickup: 'Yes',
    travelStyle: 'Relaxed', additionalRequirements: ''
  })

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const r = await fetch('/api/custom-tours', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f)
      })
      const d = await r.json()
      if (d.error) return toast.error(d.error)
      router.push(`/booking-success?ref=${d.requestRef}&type=custom`)
    } catch (e) { toast.error('Failed. Try again.') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative pt-32 pb-16 bg-secondary/30">
        <div className="container">
          <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3 flex items-center gap-2"><Sparkles className="h-4 w-4" /> Design Your Own</div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold mb-4">Custom Journey Request</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Tell us your dream New Zealand trip and we'll craft a private itinerary within 24 hours.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container max-w-3xl">
          <form onSubmit={submit} className="bg-white border border-border rounded-2xl p-8 shadow-sm space-y-8">
            <div>
              <h3 className="font-display text-2xl font-semibold mb-4">Your Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div><Label>Full Name</Label><Input required value={f.name} onChange={e => setF({...f, name: e.target.value})} /></div>
                <div><Label>Email</Label><Input type="email" required value={f.email} onChange={e => setF({...f, email: e.target.value})} /></div>
                <div><Label>Phone</Label><Input required value={f.phone} onChange={e => setF({...f, phone: e.target.value})} /></div>
                <div><Label>WhatsApp</Label><Input value={f.whatsapp} onChange={e => setF({...f, whatsapp: e.target.value})} /></div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold mb-4">Travel Plans</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2"><Label>Destinations you want to visit</Label><Input value={f.destinations} onChange={e => setF({...f, destinations: e.target.value})} placeholder="e.g. Hobbiton, Taupo, Wellington" /></div>
                <div><Label>Arrival Date</Label><Input type="date" value={f.arrivalDate} onChange={e => setF({...f, arrivalDate: e.target.value})} /></div>
                <div><Label>Departure Date</Label><Input type="date" value={f.departureDate} onChange={e => setF({...f, departureDate: e.target.value})} /></div>
                <div><Label>Adults</Label><Input type="number" min="1" value={f.adults} onChange={e => setF({...f, adults: e.target.value})} /></div>
                <div><Label>Children</Label><Input type="number" min="0" value={f.children} onChange={e => setF({...f, children: e.target.value})} /></div>
                <div className="md:col-span-2"><Label>Approximate Budget (NZD)</Label><Input value={f.budget} onChange={e => setF({...f, budget: e.target.value})} placeholder="e.g. NZ$4,000 per person" /></div>
              </div>
            </div>

            <div>
              <h3 className="font-display text-2xl font-semibold mb-4">Preferences</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Preferred Vehicle</Label>
                  <Select value={f.preferredVehicle} onValueChange={v => setF({...f, preferredVehicle: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Luxury SUV">Luxury SUV</SelectItem>
                      <SelectItem value="Private Van">Private Van</SelectItem>
                      <SelectItem value="Mini Coach">Mini Coach</SelectItem>
                      <SelectItem value="Campervan">Campervan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Hotel Required?</Label>
                  <Select value={f.hotelRequired} onValueChange={v => setF({...f, hotelRequired: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes, please book</SelectItem>
                      <SelectItem value="No">No, I'll book my own</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Airport Pickup?</Label>
                  <Select value={f.airportPickup} onValueChange={v => setF({...f, airportPickup: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Travel Style</Label>
                  <Select value={f.travelStyle} onValueChange={v => setF({...f, travelStyle: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Relaxed">Relaxed & Slow</SelectItem>
                      <SelectItem value="Balanced">Balanced</SelectItem>
                      <SelectItem value="Adventure">Adventure-packed</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2"><Label>Additional Requirements</Label><Textarea rows={4} value={f.additionalRequirements} onChange={e => setF({...f, additionalRequirements: e.target.value})} placeholder="Dietary needs, accessibility, must-sees..." /></div>
              </div>
            </div>

            <Button type="submit" disabled={submitting} className="w-full h-13 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold text-base rounded-lg">
              {submitting ? 'Submitting...' : 'Send My Request'}
            </Button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}

export default CustomTourPage
