'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const empty = {
  title: '', slug: '', shortDescription: '', description: '',
  featuredImage: '', images: [], highlights: [], included: [], excluded: [],
  duration: '1 Day', price: 0, location: '', meetingPoint: '',
  category: 'Nature', featured: false, status: 'published'
}

export function TourForm({ initial, isNew }) {
  const router = useRouter()
  const [t, setT] = useState(initial || empty)
  const [saving, setSaving] = useState(false)

  function up(k, v) { setT(x => ({ ...x, [k]: v })) }
  function upList(k, v) { up(k, v.split('\n').map(s => s.trim()).filter(Boolean)) }

  async function save() {
    setSaving(true)
    try {
      const payload = { ...t, price: Number(t.price) }
      const res = isNew ? await api.post('/admin/tours', payload) : await api.put(`/admin/tours/${t.id}`, payload)
      if (res.error) return toast.error(res.error)
      toast.success(isNew ? 'Tour created' : 'Tour updated')
      router.push('/admin/tours')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/tours" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"><ArrowLeft className="h-3 w-3" /> Back to Tours</Link>
          <h1 className="font-display text-4xl font-semibold">{isNew ? 'New Tour' : 'Edit Tour'}</h1>
        </div>
        <Button onClick={save} disabled={saving} className="bg-primary hover:bg-primary/90"><Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Tour'}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
            <div><Label>Title</Label><Input value={t.title} onChange={e => up('title', e.target.value)} /></div>
            <div><Label>Slug (URL)</Label><Input value={t.slug} onChange={e => up('slug', e.target.value)} placeholder="auto-generated if empty" /></div>
            <div><Label>Short Description</Label><Textarea rows={2} value={t.shortDescription} onChange={e => up('shortDescription', e.target.value)} /></div>
            <div><Label>Full Description</Label><Textarea rows={6} value={t.description} onChange={e => up('description', e.target.value)} /></div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
            <div><Label>Featured Image URL</Label><Input value={t.featuredImage} onChange={e => up('featuredImage', e.target.value)} placeholder="https://..." /></div>
            <div><Label>Additional Image URLs (one per line)</Label><Textarea rows={4} value={(t.images || []).join('\n')} onChange={e => upList('images', e.target.value)} placeholder="https://..." /></div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
            <div><Label>Highlights (one per line)</Label><Textarea rows={4} value={(t.highlights || []).join('\n')} onChange={e => upList('highlights', e.target.value)} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div><Label>Included (one per line)</Label><Textarea rows={4} value={(t.included || []).join('\n')} onChange={e => upList('included', e.target.value)} /></div>
              <div><Label>Excluded (one per line)</Label><Textarea rows={4} value={(t.excluded || []).join('\n')} onChange={e => upList('excluded', e.target.value)} /></div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
            <div><Label>Price (NZD)</Label><Input type="number" value={t.price} onChange={e => up('price', e.target.value)} /></div>
            <div><Label>Duration</Label><Input value={t.duration} onChange={e => up('duration', e.target.value)} placeholder="e.g. 1 Day" /></div>
            <div><Label>Location</Label><Input value={t.location} onChange={e => up('location', e.target.value)} /></div>
            <div><Label>Meeting Point</Label><Input value={t.meetingPoint} onChange={e => up('meetingPoint', e.target.value)} /></div>
            <div>
              <Label>Category</Label>
              <Select value={t.category} onValueChange={v => up('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {['Nature','Cultural','Adventure','City'].map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Status</Label>
              <Select value={t.status} onValueChange={v => up('status', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between pt-2">
              <Label className="m-0">Featured on Homepage</Label>
              <Switch checked={!!t.featured} onCheckedChange={v => up('featured', v)} />
            </div>
          </div>
          {t.featuredImage && <img src={t.featuredImage} className="rounded-2xl aspect-video w-full object-cover border border-border" />}
        </div>
      </div>
    </div>
  )
}

export default function NewTourPage() {
  return <TourForm initial={null} isNew={true} />
}
