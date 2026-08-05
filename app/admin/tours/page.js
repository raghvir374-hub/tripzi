'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { api } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Plus, Edit, Trash2, Eye } from 'lucide-react'
import { toast } from 'sonner'

function AdminTours() {
  const [tours, setTours] = useState([])
  const load = () => api.get('/admin/tours').then(setTours)
  useEffect(() => { load() }, [])

  async function del(id) {
    if (!confirm('Delete this tour?')) return
    await api.del(`/admin/tours/${id}`)
    toast.success('Tour deleted')
    load()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-4xl font-semibold">Tours</h1>
          <p className="text-muted-foreground mt-1">Create and manage your published journeys.</p>
        </div>
        <Button asChild className="bg-primary hover:bg-primary/90"><Link href="/admin/tours/new"><Plus className="h-4 w-4 mr-2" /> New Tour</Link></Button>
      </div>
      <div className="bg-white border border-border rounded-2xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-secondary/50 text-left">
            <tr><th className="p-4">Tour</th><th className="p-4">Category</th><th className="p-4">Duration</th><th className="p-4">Price</th><th className="p-4">Status</th><th className="p-4"></th></tr>
          </thead>
          <tbody className="divide-y divide-border">
            {tours.map(t => (
              <tr key={t.id} className="hover:bg-secondary/30">
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <img src={t.featuredImage} className="h-12 w-16 rounded object-cover" />
                    <div>
                      <div className="font-semibold">{t.title}</div>
                      <div className="text-xs text-muted-foreground">{t.location}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4">{t.category}</td>
                <td className="p-4">{t.duration}</td>
                <td className="p-4 font-semibold">NZ${t.price}</td>
                <td className="p-4">
                  <Badge variant={t.status === 'published' ? 'default' : 'secondary'}>{t.status}</Badge>
                  {t.featured && <Badge className="ml-2 bg-accent text-accent-foreground">Featured</Badge>}
                </td>
                <td className="p-4 text-right">
                  <div className="flex items-center gap-1 justify-end">
                    <Button asChild size="icon" variant="ghost"><Link href={`/tours/${t.slug}`} target="_blank"><Eye className="h-4 w-4" /></Link></Button>
                    <Button asChild size="icon" variant="ghost"><Link href={`/admin/tours/${t.id}`}><Edit className="h-4 w-4" /></Link></Button>
                    <Button size="icon" variant="ghost" onClick={() => del(t.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {tours.length === 0 && <div className="p-8 text-center text-muted-foreground text-sm">No tours yet.</div>}
      </div>
    </div>
  )
}
export default AdminTours
