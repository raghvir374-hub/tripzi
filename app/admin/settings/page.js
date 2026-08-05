'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Save } from 'lucide-react'
import { toast } from 'sonner'

function AdminSettings() {
  const [s, setS] = useState({})
  const [saving, setSaving] = useState(false)

  useEffect(() => { fetch('/api/settings').then(r => r.json()).then(setS) }, [])

  async function save() {
    setSaving(true)
    const r = await api.put('/admin/settings', s)
    if (r.error) toast.error(r.error); else toast.success('Settings saved')
    setSaving(false)
  }

  function up(k, v) { setS(x => ({ ...x, [k]: v })) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Website Settings</h1>
          <p className="text-muted-foreground mt-1">Edit homepage hero, contact info & branding.</p>
        </div>
        <Button onClick={save} disabled={saving} className="bg-primary"><Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save'}</Button>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="font-display text-xl font-semibold mb-2">Homepage Hero</div>
          <div><Label>Hero Title</Label><Input value={s.heroTitle || ''} onChange={e => up('heroTitle', e.target.value)} /></div>
          <div><Label>Hero Subtitle</Label><Textarea rows={3} value={s.heroSubtitle || ''} onChange={e => up('heroSubtitle', e.target.value)} /></div>
          <div><Label>Hero Image URL</Label><Input value={s.heroImage || ''} onChange={e => up('heroImage', e.target.value)} /></div>
          {s.heroImage && <img src={s.heroImage} className="rounded-lg aspect-video w-full object-cover" />}
        </div>
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="font-display text-xl font-semibold mb-2">Contact Details</div>
          <div><Label>Contact Email</Label><Input value={s.contactEmail || ''} onChange={e => up('contactEmail', e.target.value)} /></div>
          <div><Label>Contact Phone</Label><Input value={s.contactPhone || ''} onChange={e => up('contactPhone', e.target.value)} /></div>
          <div><Label>WhatsApp Number</Label><Input value={s.whatsappNumber || ''} onChange={e => up('whatsappNumber', e.target.value)} placeholder="+64..." /></div>
          <div><Label>Office Address</Label><Textarea rows={2} value={s.address || ''} onChange={e => up('address', e.target.value)} /></div>
        </div>
      </div>
    </div>
  )
}
export default AdminSettings
