'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'

const empty = { title: '', slug: '', excerpt: '', coverImage: '', author: 'The Tripzi Team', tags: [], body: '', published: false }

export function BlogForm({ initial, isNew }) {
  const router = useRouter()
  const [t, setT] = useState(initial || empty)
  const [saving, setSaving] = useState(false)
  const [tagInput, setTagInput] = useState((initial?.tags || []).join(', '))

  function up(k, v) { setT(x => ({ ...x, [k]: v })) }

  async function save() {
    setSaving(true)
    try {
      const payload = { ...t, tags: tagInput.split(',').map(s => s.trim()).filter(Boolean) }
      const res = isNew ? await api.post('/admin/blog_posts', payload) : await api.put(`/admin/blog_posts/${t.id}`, payload)
      if (res.error) return toast.error(res.error)
      toast.success(isNew ? 'Story created' : 'Story updated')
      router.push('/admin/blog')
    } finally { setSaving(false) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <Link href="/admin/blog" className="text-sm text-muted-foreground hover:text-foreground inline-flex items-center gap-1 mb-2"><ArrowLeft className="h-3 w-3" /> Back to Stories</Link>
          <h1 className="font-display text-4xl font-semibold">{isNew ? 'New Story' : 'Edit Story'}</h1>
        </div>
        <Button onClick={save} disabled={saving} className="bg-primary"><Save className="h-4 w-4 mr-2" /> {saving ? 'Saving...' : 'Save Story'}</Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
            <div><Label>Title</Label><Input value={t.title} onChange={e => up('title', e.target.value)} /></div>
            <div><Label>Slug (URL). Leave empty to auto-generate.</Label><Input value={t.slug} onChange={e => up('slug', e.target.value)} placeholder="e.g. hobbiton-insider-secrets" /></div>
            <div><Label>Excerpt (short preview shown on the blog list)</Label><Textarea rows={2} value={t.excerpt} onChange={e => up('excerpt', e.target.value)} /></div>
          </div>

          <div className="bg-white rounded-2xl border border-border p-6 space-y-3">
            <Label>Body</Label>
            <p className="text-xs text-muted-foreground">Use blank lines to separate paragraphs. Start a line with <code>## </code> for a section heading, and <code>- </code> for a bullet point.</p>
            <Textarea rows={22} value={t.body} onChange={e => up('body', e.target.value)} className="font-mono text-sm" />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-border p-6 space-y-4">
            <div className="flex items-center justify-between">
              <Label className="m-0">Published (visible on site)</Label>
              <Switch checked={!!t.published} onCheckedChange={v => up('published', v)} />
            </div>
            <div><Label>Author</Label><Input value={t.author} onChange={e => up('author', e.target.value)} /></div>
            <div><Label>Tags (comma-separated)</Label><Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Hobbiton, Waikato, Movies" /></div>
            <div><Label>Cover Image URL</Label><Input value={t.coverImage} onChange={e => up('coverImage', e.target.value)} placeholder="https://..." /></div>
            {t.coverImage && <img src={t.coverImage} className="rounded-lg aspect-video w-full object-cover border border-border" />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function NewBlogPage() {
  return <BlogForm initial={null} isNew={true} />
}
