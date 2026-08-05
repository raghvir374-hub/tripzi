'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'

function AdminContacts() {
  const [items, setItems] = useState([])
  useEffect(() => { api.get('/admin/contacts').then(setItems) }, [])
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold">Contact Enquiries</h1>
        <p className="text-muted-foreground mt-1">{items.length} messages.</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map(x => (
          <div key={x.id} className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <div className="font-display text-lg font-semibold">{x.name}</div>
              <div className="text-xs text-muted-foreground">{new Date(x.createdAt).toLocaleString()}</div>
            </div>
            <div className="text-sm text-muted-foreground mb-3">{x.email} • {x.phone || 'no phone'}</div>
            {x.subject && <div className="font-semibold mb-2">Re: {x.subject}</div>}
            <div className="text-sm whitespace-pre-wrap">{x.message}</div>
          </div>
        ))}
        {items.length === 0 && <div className="p-16 text-center text-muted-foreground bg-white rounded-2xl border border-border">No messages yet.</div>}
      </div>
    </div>
  )
}
export default AdminContacts
