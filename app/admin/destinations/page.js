'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2 } from 'lucide-react'
import { toast } from 'sonner'

const empty = { name: '', tag: '', img: '', order: 0 }

function AdminDestinations() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [f, setF] = useState(empty)

  const load = () => api.get('/admin/destinations').then(setItems)
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setF({ ...empty, order: (items.at(-1)?.order || 0) + 1 }); setOpen(true) }
  function openEdit(d) { setEditing(d); setF({ ...empty, ...d }); setOpen(true) }

  async function save() {
    if (!f.name || !f.img) return toast.error('Name and image URL required')
    if (editing) await api.put(`/admin/destinations/${editing.id}`, f)
    else await api.post('/admin/destinations', f)
    toast.success('Saved')
    setOpen(false); load()
  }
  async function del(id) { if (!confirm('Delete?')) return; await api.del(`/admin/destinations/${id}`); toast.success('Deleted'); load() }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Destinations</h1>
          <p className="text-muted-foreground mt-1">The featured region cards on your homepage.</p>
        </div>
        <Button onClick={openNew} className="bg-primary"><Plus className="h-4 w-4 mr-2" /> Add Destination</Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map(d => (
          <div key={d.id} className="group relative aspect-[3/4] rounded-2xl overflow-hidden bg-secondary">
            <img src={d.img} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition">
              <Button size="icon" variant="secondary" className="h-8 w-8" onClick={() => openEdit(d)}><Edit className="h-3.5 w-3.5" /></Button>
              <Button size="icon" variant="secondary" className="h-8 w-8 text-destructive" onClick={() => del(d.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
            </div>
            <div className="absolute inset-x-0 bottom-0 p-3 text-white">
              <div className="text-[10px] uppercase tracking-widest opacity-80">{d.tag}</div>
              <div className="font-display text-lg font-semibold">{d.name}</div>
              <div className="text-[10px] opacity-70 mt-1">Order: {d.order}</div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Destination' : 'Add Destination'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={f.name} onChange={e => setF({...f, name: e.target.value})} /></div>
            <div><Label>Tagline (e.g. Alpine, City of Sails)</Label><Input value={f.tag} onChange={e => setF({...f, tag: e.target.value})} /></div>
            <div><Label>Image URL</Label><Input value={f.img} onChange={e => setF({...f, img: e.target.value})} placeholder="https://..." /></div>
            {f.img && <img src={f.img} className="rounded-lg aspect-video object-cover" />}
            <div><Label>Sort Order</Label><Input type="number" value={f.order} onChange={e => setF({...f, order: e.target.value})} /></div>
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
export default AdminDestinations
