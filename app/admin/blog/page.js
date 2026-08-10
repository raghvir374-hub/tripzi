'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'

function AdminBlog() {
  const [posts, setPosts] = useState([])
  const load = () => api.get('/admin/blog_posts').then(setPosts)
  useEffect(() => { load() }, [])
  async function del(id) { if (!confirm('Delete story?')) return; await api.del(`/admin/blog_posts/${id}`); toast.success('Deleted'); load() }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Blog / Stories</h1>
          <p className="text-muted-foreground mt-1">Publish trip journals & destination guides to boost SEO.</p>
        </div>
        <Button asChild className="bg-primary"><Link href="/admin/blog/new"><Plus className="h-4 w-4 mr-2" /> New Story</Link></Button>
      </div>
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr><th className="p-4">Story</th><th className="p-4">Author</th><th className="p-4">Tags</th><th className="p-4">Status</th><th className="p-4"></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {posts.map(p => (
              <tr key={p.id} className="hover:bg-secondary/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    {p.coverImage && <img src={p.coverImage} className="h-12 w-16 rounded object-cover" />}
                    <div className="min-w-0">
                      <div className="font-semibold truncate">{p.title}</div>
                      <div className="text-xs text-muted-foreground truncate">/{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">{p.author || '—'}</td>
                <td className="p-4"><div className="flex gap-1 flex-wrap">{(p.tags || []).map(t => <span key={t} className="text-[10px] bg-secondary px-2 py-0.5 rounded-full">{t}</span>)}</div></td>
                <td className="p-4"><Badge variant={p.published ? 'default' : 'secondary'}>{p.published ? 'Published' : 'Draft'}</Badge></td>
                <td className="p-4 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    {p.published && <Button asChild size="icon" variant="ghost"><Link href={`/blog/${p.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link></Button>}
                    <Button asChild size="icon" variant="ghost"><Link href={`/admin/blog/${p.id}`}><Edit className="h-4 w-4" /></Link></Button>
                    <Button size="icon" variant="ghost" onClick={() => del(p.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {posts.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No stories yet. Click “New Story” to publish your first one.</div>}
      </div>
    </div>
  )
}
export default AdminBlog
