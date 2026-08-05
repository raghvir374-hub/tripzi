'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Car, LogOut, Phone, MessageCircle, MapPin, Calendar, Users, ChevronRight, Loader2, Sparkles } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

const STATUS_FLOW = ['Assigned', 'On The Way', 'Picked Up', 'Completed']
const statusColor = {
  'Assigned': 'bg-sky-100 text-sky-800',
  'On The Way': 'bg-amber-100 text-amber-800',
  'Picked Up': 'bg-violet-100 text-violet-800',
  'Completed': 'bg-emerald-100 text-emerald-800',
}

function driverFetch(path, opts = {}) {
  const t = localStorage.getItem('driver_token')
  return fetch(`/api${path}`, { ...opts, headers: { 'Content-Type': 'application/json', ...(opts.headers || {}), Authorization: `Bearer ${t}` } }).then(r => r.json())
}

function DriverDashboard() {
  const router = useRouter()
  const [driver, setDriver] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const [me, list] = await Promise.all([
      driverFetch('/driver/me'),
      driverFetch('/driver/bookings'),
    ])
    if (me.error) { localStorage.removeItem('driver_token'); router.replace('/driver/login'); return }
    setDriver(me.driver)
    setBookings(Array.isArray(list) ? list : [])
    setLoading(false)
  }

  useEffect(() => {
    const t = typeof window !== 'undefined' ? localStorage.getItem('driver_token') : null
    if (!t) { router.replace('/driver/login'); return }
    load()
  }, [router])

  async function setTripStatus(id, status) {
    const r = await driverFetch(`/driver/bookings/${id}`, { method: 'PATCH', body: JSON.stringify({ tripStatus: status }) })
    if (r.error) return toast.error(r.error)
    toast.success(`Status: ${status}`)
    load()
  }

  async function toggleAvailable(v) {
    setDriver(d => ({ ...d, available: v }))
    await driverFetch('/driver/availability', { method: 'PATCH', body: JSON.stringify({ available: v }) })
    toast.success(v ? 'You are online' : 'You are offline')
  }

  function logout() {
    driverFetch('/driver/logout', { method: 'POST' })
    localStorage.removeItem('driver_token')
    router.replace('/driver/login')
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>

  const upcoming = bookings.filter(b => b.tripStatus !== 'Completed' && b.status !== 'Completed' && b.status !== 'Cancelled')
  const done = bookings.filter(b => b.tripStatus === 'Completed' || b.status === 'Completed')

  return (
    <div className="min-h-screen bg-secondary/30 pb-24">
      {/* Top bar */}
      <div className="bg-[hsl(165,40%,10%)] text-white sticky top-0 z-20">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-accent text-accent-foreground flex items-center justify-center font-bold">
              {driver.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </div>
            <div>
              <div className="text-xs opacity-70">Kia ora,</div>
              <div className="font-semibold">{driver.name}</div>
            </div>
          </div>
          <button onClick={logout} className="p-2 hover:bg-white/10 rounded-md"><LogOut className="h-5 w-5" /></button>
        </div>
        <div className="max-w-2xl mx-auto px-4 pb-4 flex items-center justify-between">
          <div className="flex items-center gap-2 text-sm">
            <div className={cn('h-2.5 w-2.5 rounded-full', driver.available ? 'bg-emerald-400' : 'bg-gray-400')} />
            <span>{driver.available ? 'Available for tours' : 'Currently offline'}</span>
          </div>
          <Switch checked={!!driver.available} onCheckedChange={toggleAvailable} />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {/* Vehicle */}
        {driver.vehicle && (
          <div className="bg-white rounded-2xl p-4 border border-border flex items-center gap-3">
            <div className="h-11 w-11 rounded-lg bg-primary/10 flex items-center justify-center"><Car className="h-5 w-5 text-primary" /></div>
            <div>
              <div className="text-xs text-muted-foreground uppercase tracking-widest">Your Vehicle</div>
              <div className="font-semibold">{driver.vehicle}</div>
            </div>
          </div>
        )}

        {/* Upcoming */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-display text-xl font-semibold">Upcoming Trips</h2>
            <Badge variant="secondary">{upcoming.length}</Badge>
          </div>
          {upcoming.length === 0 && (
            <div className="bg-white rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
              No trips assigned yet. Sit tight — dispatch will assign you soon.
            </div>
          )}
          <div className="space-y-3">
            {upcoming.map(b => <TripCard key={b.id} b={b} onStatus={setTripStatus} />)}
          </div>
        </div>

        {done.length > 0 && (
          <div>
            <h2 className="font-display text-xl font-semibold mb-3">Completed</h2>
            <div className="space-y-3">
              {done.slice(0, 5).map(b => <TripCard key={b.id} b={b} onStatus={setTripStatus} readOnly />)}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function TripCard({ b, onStatus, readOnly }) {
  const status = b.tripStatus || 'Assigned'
  const currentIdx = STATUS_FLOW.indexOf(status)
  const nextStatus = STATUS_FLOW[currentIdx + 1]
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(b.pickupLocation || b.meetingPoint || b.location || 'New Zealand')}`
  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden">
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <div className="font-mono text-xs px-2 py-0.5 bg-secondary rounded inline-block mb-1">{b.bookingRef}</div>
            <div className="font-display text-lg font-semibold leading-tight">{b.tourTitle}</div>
          </div>
          <span className={cn('text-xs px-2.5 py-1 rounded-full font-medium', statusColor[status] || 'bg-secondary')}>{status}</span>
        </div>
        <div className="space-y-2 text-sm text-foreground/85 mt-3">
          <div className="flex items-center gap-2"><Calendar className="h-4 w-4 text-muted-foreground" /> {b.travelDate}</div>
          <div className="flex items-center gap-2"><Users className="h-4 w-4 text-muted-foreground" /> {b.adults} adults{b.children > 0 && ` + ${b.children} kids`}</div>
          <div className="flex items-start gap-2"><MapPin className="h-4 w-4 text-muted-foreground mt-0.5" /> <span>{b.pickupLocation || b.meetingPoint || 'TBC'}</span></div>
          <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-muted-foreground" /> {b.fullName}</div>
        </div>
      </div>
      <div className="grid grid-cols-3 divide-x divide-border border-t border-border">
        <a href={`tel:${b.phone}`} className="py-3 flex items-center justify-center gap-1.5 text-sm font-medium text-primary hover:bg-secondary/60"><Phone className="h-4 w-4" /> Call</a>
        <a href={`https://wa.me/${(b.whatsapp || b.phone).replace(/\D/g,'')}?text=${encodeURIComponent(`Kia ora ${b.fullName.split(' ')[0]}, this is your Tripzi driver for ${b.tourTitle}.`)}`}
           target="_blank" rel="noreferrer"
           className="py-3 flex items-center justify-center gap-1.5 text-sm font-medium text-green-600 hover:bg-secondary/60">
          <MessageCircle className="h-4 w-4" /> WhatsApp
        </a>
        <a href={mapsUrl} target="_blank" rel="noreferrer" className="py-3 flex items-center justify-center gap-1.5 text-sm font-medium text-blue-600 hover:bg-secondary/60"><MapPin className="h-4 w-4" /> Maps</a>
      </div>
      {!readOnly && nextStatus && (
        <button onClick={() => onStatus(b.id, nextStatus)} className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold py-3 text-sm flex items-center justify-center gap-1">
          Mark as: {nextStatus} <ChevronRight className="h-4 w-4" />
        </button>
      )}
    </div>
  )
}
export default DriverDashboard
