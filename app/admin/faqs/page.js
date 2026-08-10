'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Plus, Edit, Trash2, HelpCircle } from 'lucide-react'
import { toast } from 'sonner'

const empty = { question: '', answer: '', order: 0 }

function AdminFAQs() {
  const [items, setItems] = useState([])
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [f, setF] = useState(empty)

  const load = () => api.get('/admin/faqs').then(setItems)
  useEffect(() => { load() }, [])

  function openNew() { setEditing(null); setF({ ...empty, order: (items.at(-1)?.order || 0) + 1 }); setOpen(true) }
  function openEdit(d) { setEditing(d); setF({ ...empty, ...d }); setOpen(true) }

  async function save() {
    if (!f.question || !f.answer) return toast.error('Question and answer required')
    if (editing) await api.put(`/admin/faqs/${editing.id}`, f)
    else await api.post('/admin/faqs', f)
    toast.success('Saved')
    setOpen(false); load()
  }
  async function del(id) { if (!confirm('Delete?')) return; await api.del(`/admin/faqs/${id}`); toast.success('Deleted'); load() }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">FAQs</h1>
          <p className="text-muted-foreground mt-1">Answers shown on your homepage FAQ section.</p>
        </div>
        <Button onClick={openNew} className="bg-primary"><Plus className="h-4 w-4 mr-2" /> Add FAQ</Button>
      </div>

      <div className="space-y-3">
        {items.map(x => (
          <div key={x.id} className="bg-white border border-border rounded-2xl p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="font-display text-lg font-semibold flex items-start gap-2"><HelpCircle className="h-4 w-4 text-accent mt-1.5 flex-shrink-0" /> {x.question}</div>
                <div className="text-sm text-muted-foreground mt-2 whitespace-pre-wrap">{x.answer}</div>
              </div>
              <div className="flex gap-1">
                <Button size="icon" variant="ghost" onClick={() => openEdit(x)}><Edit className="h-3.5 w-3.5" /></Button>
                <Button size="icon" variant="ghost" onClick={() => del(x.id)} className="text-destructive"><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>{editing ? 'Edit FAQ' : 'Add FAQ'}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Question</Label><Input value={f.question} onChange={e => setF({...f, question: e.target.value})} /></div>
            <div><Label>Answer</Label><Textarea rows={5} value={f.answer} onChange={e => setF({...f, answer: e.target.value})} /></div>
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
export default AdminFAQs
