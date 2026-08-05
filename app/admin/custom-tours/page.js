'use client'
import { useEffect, useState } from 'react'
import { api } from '@/lib/api-client'
import { Sparkles, Users, Calendar, DollarSign, Car, Home } from 'lucide-react'

function AdminCustomTours() {
  const [items, setItems] = useState([])
  useEffect(() => { api.get('/admin/custom-tours').then(setItems) }, [])

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-4xl font-semibold">Custom Requests</h1>
        <p className="text-muted-foreground mt-1">{items.length} bespoke journey requests.</p>
      </div>
      <div className="grid grid-cols-1 gap-4">
        {items.map(x => (
          <div key={x.id} className="bg-white border border-border rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-3 flex-wrap">
              <span className="font-mono text-xs px-2 py-1 rounded bg-secondary">{x.requestRef}</span>
              <span className="text-xs text-muted-foreground">{new Date(x.createdAt).toLocaleString()}</span>
            </div>
            <div className="font-display text-xl font-semibold">{x.name}</div>
            <div className="text-sm text-muted-foreground">{x.email} • {x.phone}</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4 text-sm">
              <div><div className="text-[10px] uppercase text-muted-foreground">Destinations</div><div>{x.destinations}</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">Dates</div><div>{x.arrivalDate} → {x.departureDate}</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">Guests</div><div>{x.adults} adults{x.children > 0 && ` + ${x.children} kids`}</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">Budget</div><div>{x.budget || '—'}</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">Vehicle</div><div>{x.preferredVehicle}</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">Hotel</div><div>{x.hotelRequired}</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">Airport pickup</div><div>{x.airportPickup}</div></div>
              <div><div className="text-[10px] uppercase text-muted-foreground">Style</div><div>{x.travelStyle}</div></div>
            </div>
            {x.additionalRequirements && <div className="mt-3 text-sm bg-secondary/60 rounded-lg p-3">{x.additionalRequirements}</div>}
          </div>
        ))}
        {items.length === 0 && <div className="p-16 text-center text-muted-foreground bg-white rounded-2xl border border-border">No custom requests yet.</div>}
      </div>
    </div>
  )
}
export default AdminCustomTours
