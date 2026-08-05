'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Car, Phone } from 'lucide-react'
import { toast } from 'sonner'

const empty = { name: '', phone: '', pin: '', vehicle: '', license: '', available: true }

function AdminDrivers() {
  const [drivers, setDrivers] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [f, setF] = useState(empty)

  const load = () => api.get('/admin/drivers').then(setDrivers)
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setF(empty); setOpen(true) }
  function openEdit(d) { setEditing(d); setF({ ...empty, ...d, pin: '' }); setOpen(true) }

  async function save() {
    if (!f.name || !f.phone || (!editing && !f.pin)) return toast.error('Name, phone and PIN required')
    if (editing) {
      const payload = { ...f }
      if (!payload.pin) delete payload.pin
      const r = await api.put(`/admin/drivers/${editing.id}`, payload)
      if (r.error) return toast.error(r.error)
    } else {
      const r = await api.post('/admin/drivers', f)
      if (r.error) return toast.error(r.error)
    }
    toast.success('Saved')
    setOpen(false)
    load()
  }

  async function del(id) {
    if (!confirm('Delete driver?')) return
    await api.del(`/admin/drivers/${id}`)
    toast.success('Driver removed')
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Drivers</h1>
          <p className="text-muted-foreground mt-1">Manage your fleet team. Drivers sign in on their phones with phone + PIN.</p>
        </div>
        <Button onClick={openNew} className="bg-primary"><Plus className="h-4 w-4 mr-2" /> Add Driver</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map(d => (
          <div key={d.id} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold">
                  {d.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
                </div>
                <div>
                  <div className="font-semibold">{d.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1"><Phone className="h-3 w-3" /> {d.phone}</div>
                </div>
              </div>
              <Badge variant={d.available ? 'default' : 'secondary'} className={d.available ? 'bg-emerald-500' : ''}>{d.available ? 'Available' : 'Off'}</Badge>
            </div>
            {d.vehicle && <div className="text-sm flex items-center gap-2 text-muted-foreground"><Car className="h-3.5 w-3.5" /> {d.vehicle}</div>}
            {d.license && <div className="text-xs text-muted-foreground mt-1">License: {d.license}</div>}
            <div className="flex gap-2 mt-4">
              <Button size="sm" variant="outline" onClick={() => openEdit(d)}><Edit className="h-3.5 w-3.5" /></Button>
              <Button size="sm" variant="ghost" onClick={() => del(d.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
          </div>
        ))}
        {drivers.length === 0 && (
          <div className="col-span-full p-16 text-center text-muted-foreground bg-white rounded-2xl border border-border">No drivers yet. Add one to give them app access.</div>
        )}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Driver' : 'Add Driver'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Full Name</Label><Input value={f.name} onChange={e => setF({...f, name: e.target.value})} /></div>
            <div><Label>Phone (with country code)</Label><Input value={f.phone} onChange={e => setF({...f, phone: e.target.value.trim()})} placeholder="+64..." /></div>
            <div><Label>4-digit PIN {editing && <span className="text-xs text-muted-foreground">(leave blank to keep existing)</span>}</Label><Input type="password" maxLength={6} value={f.pin} onChange={e => setF({...f, pin: e.target.value.replace(/\D/g,'')})} placeholder="1234" /></div>
            <div><Label>Vehicle</Label><Input value={f.vehicle} onChange={e => setF({...f, vehicle: e.target.value})} placeholder="e.g. Toyota Hiace — ABC123" /></div>
            <div><Label>License / Documents</Label><Input value={f.license} onChange={e => setF({...f, license: e.target.value})} placeholder="License #" /></div>
            <div className="flex items-center justify-between"><Label className="m-0">Currently available</Label><Switch checked={!!f.available} onCheckedChange={v => setF({...f, available: v})} /></div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button onClick={save} className="bg-primary">{editing ? 'Save' : 'Create'}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
export default AdminDrivers
