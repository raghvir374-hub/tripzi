'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Phone, Mail, MessageCircle, Calendar, MapPin, Users, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const STATUSES = ['New','Contacted','Confirmed','Assigned','Completed','Cancelled']
const statusColor = {
  New: 'bg-sky-100 text-sky-800',
  Contacted: 'bg-amber-100 text-amber-800',
  Confirmed: 'bg-emerald-100 text-emerald-800',
  Assigned: 'bg-violet-100 text-violet-800',
  Completed: 'bg-slate-200 text-slate-800',
  Cancelled: 'bg-rose-100 text-rose-800',
}

function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [drivers, setDrivers] = useState([])
  const [open, setOpen] = useState(null)
  const [notes, setNotes] = useState('')
  const [filter, setFilter] = useState('All')

  const load = () => Promise.all([
    api.get('/admin/bookings').then(setBookings),
    api.get('/admin/drivers').then(d => setDrivers(Array.isArray(d) ? d : [])),
  ])
  useEffect(() => { load() }, [])

  async function updateStatus(id, status) {
    await api.patch(`/admin/bookings/${id}`, { status })
    toast.success('Status updated')
    load()
  }
  async function assignDriver(id, driverId) {
    const patch = driverId === '__none__' ? { driverId: null } : { driverId, status: 'Assigned' }
    await api.patch(`/admin/bookings/${id}`, patch)
    toast.success(driverId === '__none__' ? 'Driver unassigned' : 'Driver assigned')
    load()
  }
  async function saveNotes() {
    if (!open) return
    await api.patch(`/admin/bookings/${open.id}`, { notes })
    toast.success('Notes saved')
    setOpen(null)
    load()
  }
  async function del(id) {
    if (!confirm('Delete this booking?')) return
    await api.del(`/admin/bookings/${id}`)
    toast.success('Deleted')
    load()
  }

  const filtered = filter === 'All' ? bookings : bookings.filter(b => b.status === filter)

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <div>
          <h1 className="font-display text-4xl font-semibold">Bookings</h1>
          <p className="text-muted-foreground mt-1">{bookings.length} total • manage every enquiry that comes in.</p>
        </div>
        <div className="w-48">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All statuses</SelectItem>
              {STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {filtered.map(b => (
          <div key={b.id} className="bg-white border border-border rounded-2xl p-6 hover:shadow-md transition">
            <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="font-mono text-xs px-2 py-1 rounded bg-secondary text-foreground">{b.bookingRef}</span>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${statusColor[b.status] || 'bg-secondary'}`}>{b.status}</span>
                  <span className="text-xs text-muted-foreground">{new Date(b.createdAt).toLocaleString()}</span>
                </div>
                <div className="font-display text-xl font-semibold">{b.fullName}</div>
                <div className="text-sm text-primary font-medium mt-1">{b.tourTitle}</div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
                  <div className="flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-muted-foreground" /> <span className="truncate">{b.email}</span></div>
                  <div className="flex items-center gap-2"><Phone className="h-3.5 w-3.5 text-muted-foreground" /> {b.phone}</div>
                  <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5 text-muted-foreground" /> {b.travelDate}</div>
                  <div className="flex items-center gap-2"><Users className="h-3.5 w-3.5 text-muted-foreground" /> {b.adults}A {b.children > 0 && `+ ${b.children}C`}</div>
                  {b.pickupLocation && <div className="flex items-center gap-2 col-span-2"><MapPin className="h-3.5 w-3.5 text-muted-foreground" /> <span className="truncate">{b.pickupLocation}</span></div>}
                  {b.whatsapp && <div className="flex items-center gap-2"><MessageCircle className="h-3.5 w-3.5 text-muted-foreground" /> {b.whatsapp}</div>}
                </div>
                {b.specialRequirements && <div className="mt-3 text-sm bg-secondary/60 rounded-lg p-3"><strong className="text-xs uppercase tracking-widest text-muted-foreground">Special Requests:</strong> {b.specialRequirements}</div>}
                {b.notes && <div className="mt-3 text-sm bg-amber-50 border border-amber-200 rounded-lg p-3"><strong className="text-xs uppercase tracking-widest text-amber-700">Internal Notes:</strong> {b.notes}</div>}
              </div>
              <div className="flex flex-col gap-2 md:w-56">
                <Select value={b.status} onValueChange={v => updateStatus(b.id, v)}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{STATUSES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}</SelectContent>
                </Select>
                <Select value={b.driverId || '__none__'} onValueChange={v => assignDriver(b.id, v)}>
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Assign driver" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="__none__">— Unassigned —</SelectItem>
                    {drivers.map(d => <SelectItem key={d.id} value={d.id}>{d.name}{d.vehicle ? ` · ${d.vehicle}` : ''}</SelectItem>)}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" className="flex-1" onClick={() => { setOpen(b); setNotes(b.notes || '') }}>Notes</Button>
                  <a href={`https://wa.me/${(b.whatsapp || b.phone).replace(/\D/g,'')}?text=Kia%20ora%20${encodeURIComponent(b.fullName)}%2C%20thanks%20for%20booking%20${encodeURIComponent(b.tourTitle)}%20(${b.bookingRef}).`}
                     target="_blank" rel="noreferrer"
                     className="flex-1 h-9 rounded-md border border-input bg-green-500 hover:bg-green-600 text-white text-sm font-medium flex items-center justify-center gap-1">
                    <MessageCircle className="h-3.5 w-3.5" /> WhatsApp
                  </a>
                </div>
                <Button size="sm" variant="ghost" onClick={() => del(b.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5 mr-1" /> Delete</Button>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && <div className="p-16 text-center text-muted-foreground bg-white rounded-2xl border border-border">No bookings match this filter.</div>}
      </div>

      <Dialog open={!!open} onOpenChange={o => !o && setOpen(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Internal Notes</DialogTitle></DialogHeader>
          <Label>Notes for {open?.fullName}</Label>
          <Textarea rows={6} value={notes} onChange={e => setNotes(e.target.value)} />
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setOpen(null)}>Cancel</Button>
            <Button onClick={saveNotes} className="bg-primary">Save Notes</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default AdminBookings
