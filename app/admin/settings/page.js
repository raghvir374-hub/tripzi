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
    if (r.error) toast.error(r.error); else toast.success('Saved. Refresh your homepage to see changes.')
    setSaving(false)
  }

  function up(k, v) { setS(x => ({ ...x, [k]: v })) }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Site & About</h1>
          <p className="text-muted-foreground mt-1">Edit homepage hero, contact info, and About page content.</p>
        </div>
        <Button onClick={save} disabled={saving} className="bg-primary"><Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save All'}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white border border-border rounded-2xl p-6 space-y-4">
          <div className="font-display text-xl font-semibold mb-2">Homepage Hero</div>
          <div><Label>Hero Title <span className="text-xs text-muted-foreground">(text after the comma will be italic amber)</span></Label><Input value={s.heroTitle || ''} onChange={e => up('heroTitle', e.target.value)} /></div>
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

        <div className="bg-white border border-border rounded-2xl p-6 space-y-4 lg:col-span-2">
          <div className="font-display text-xl font-semibold mb-2">About Page</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>Tagline (small text)</Label><Input value={s.aboutTagline || ''} onChange={e => up('aboutTagline', e.target.value)} /></div>
            <div><Label>Headline</Label><Input value={s.aboutHeadline || ''} onChange={e => up('aboutHeadline', e.target.value)} /></div>
          </div>
          <div><Label>About Body (supports line breaks)</Label><Textarea rows={6} value={s.aboutBody || ''} onChange={e => up('aboutBody', e.target.value)} /></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><Label>About Image 1 URL</Label><Input value={s.aboutImage1 || ''} onChange={e => up('aboutImage1', e.target.value)} /></div>
            <div><Label>About Image 2 URL</Label><Input value={s.aboutImage2 || ''} onChange={e => up('aboutImage2', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[1,2,3,4].map(i => (
              <div key={i} className="space-y-2">
                <div className="text-xs uppercase tracking-widest text-muted-foreground font-semibold">Stat {i}</div>
                <Input placeholder="Value (e.g. 3,000+)" value={s[`aboutStat${i}Value`] || ''} onChange={e => up(`aboutStat${i}Value`, e.target.value)} />
                <Input placeholder="Label" value={s[`aboutStat${i}Label`] || ''} onChange={e => up(`aboutStat${i}Label`, e.target.value)} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminSettings
