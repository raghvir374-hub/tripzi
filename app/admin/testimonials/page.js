'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, Star, Quote } from 'lucide-react'
import { toast } from 'sonner'

const empty = { name: '', country: '', text: '', avatar: '', rating: 5, order: 0 }

function AdminTestimonials() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [f, setF] = useState(empty)

  const load = () => api.get('/admin/testimonials').then(setItems)
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setF({ ...empty, order: (items.at(-1)?.order || 0) + 1 }); setOpen(true) }
  function openEdit(d) { setEditing(d); setF({ ...empty, ...d }); setOpen(true) }

  async function save() {
    if (!f.name || !f.text) return toast.error('Name and text required')
    if (editing) await api.put(`/admin/testimonials/${editing.id}`, f)
    else await api.post('/admin/testimonials', f)
    toast.success('Saved')
    setOpen(false); load()
  }
  async function del(id) { if (!confirm('Delete?')) return; await api.del(`/admin/testimonials/${id}`); toast.success('Deleted'); load() }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Testimonials</h1>
          <p className="text-muted-foreground mt-1">Traveller stories shown on your homepage.</p>
        </div>
        <Button onClick={openNew} className="bg-primary"><Plus className="h-4 w-4 mr-2" /> Add Testimonial</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {items.map(t => (
          <div key={t.id} className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-start justify-between gap-4">
              <Quote className="h-6 w-6 text-accent flex-shrink-0" />
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => openEdit(t)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => del(t.id)}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
            <p className="text-foreground/85 leading-relaxed mt-3">&ldquo;{t.text}&rdquo;</p>
            <div className="flex items-center gap-3 mt-4">
              {t.avatar && <img src={t.avatar} alt={t.name} className="h-11 w-11 rounded-full object-cover" />}
              <div>
                <div className="font-semibold">{t.name}</div>
                <div className="text-xs text-muted-foreground">{t.country}</div>
              </div>
              <div className="ml-auto flex gap-0.5">{[...Array(t.rating || 5)].map((_, i) => <Star key={i} className="h-3 w-3 fill-accent text-accent" />)}</div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit Testimonial' : 'Add Testimonial'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Name</Label><Input value={f.name} onChange={e => setF({...f, name: e.target.value})} /></div>
              <div><Label>Country</Label><Input value={f.country} onChange={e => setF({...f, country: e.target.value})} /></div>
            </div>
            <div><Label>Quote</Label><Textarea rows={4} value={f.text} onChange={e => setF({...f, text: e.target.value})} /></div>
            <div><Label>Avatar Image URL (optional)</Label><Input value={f.avatar} onChange={e => setF({...f, avatar: e.target.value})} /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label>Rating (1-5)</Label><Input type="number" min="1" max="5" value={f.rating} onChange={e => setF({...f, rating: Number(e.target.value)})} /></div>
              <div><Label>Sort Order</Label><Input type="number" value={f.order} onChange={e => setF({...f, order: e.target.value})} /></div>
            </div>
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
export default AdminTestimonials
