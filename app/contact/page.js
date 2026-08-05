'use client'
import { useState, useEffect } from 'react'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Mail, Phone, MapPin, Send } from 'lucide-react'
import { toast } from 'sonner'

function ContactPage() {
  const [submitting, setSubmitting] = useState(false)
  const [settings, setSettings] = useState({})
  const [f, setF] = useState({ name: '', email: '', phone: '', subject: '', message: '' })

  useEffect(() => { fetch('/api/settings').then(r => r.json()).then(setSettings) }, [])

  async function submit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      const r = await fetch('/api/contacts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(f) })
      const d = await r.json()
      if (d.error) return toast.error(d.error)
      toast.success('Message sent! We’ll reply within 24 hours.')
      setF({ name: '', email: '', phone: '', subject: '', message: '' })
    } catch { toast.error('Failed. Try again.') }
    finally { setSubmitting(false) }
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative pt-32 pb-16 bg-secondary/30">
        <div className="container">
          <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Get in Touch</div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold mb-4">Kia ora! Say hello.</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Questions, custom requests, or last-minute bookings — we usually reply within an hour.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            {[
              { icon: Mail, label: 'Email', value: settings.contactEmail || 'hello@tripzi.co.nz' },
              { icon: Phone, label: 'Phone / WhatsApp', value: settings.contactPhone || '+64 21 555 0199' },
              { icon: MapPin, label: 'Office', value: settings.address || '12 Quay Street, Auckland CBD' },
            ].map(c => (
              <div key={c.label} className="flex gap-4 p-6 bg-white rounded-2xl border border-border">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0"><c.icon className="h-5 w-5" /></div>
                <div>
                  <div className="text-xs uppercase tracking-widest text-muted-foreground mb-1">{c.label}</div>
                  <div className="font-semibold">{c.value}</div>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={submit} className="lg:col-span-2 bg-white border border-border rounded-2xl p-8 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Name</Label><Input required value={f.name} onChange={e => setF({...f, name: e.target.value})} /></div>
              <div><Label>Email</Label><Input required type="email" value={f.email} onChange={e => setF({...f, email: e.target.value})} /></div>
              <div><Label>Phone</Label><Input value={f.phone} onChange={e => setF({...f, phone: e.target.value})} /></div>
              <div><Label>Subject</Label><Input value={f.subject} onChange={e => setF({...f, subject: e.target.value})} /></div>
            </div>
            <div><Label>Message</Label><Textarea rows={6} required value={f.message} onChange={e => setF({...f, message: e.target.value})} /></div>
            <Button type="submit" disabled={submitting} className="h-12 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-lg px-8">
              {submitting ? 'Sending...' : <>Send Message <Send className="ml-2 h-4 w-4" /></>}
            </Button>
          </form>
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
export default ContactPage
