'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Car, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function DriverLoginPage() {
  const router = useRouter()
  const [phone, setPhone] = useState('')
  const [pin, setPin] = useState('')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/driver/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone: phone.trim(), pin: pin.trim() })
      })
      const d = await r.json()
      if (d.error) { toast.error(d.error); return }
      localStorage.setItem('driver_token', d.token)
      localStorage.setItem('driver_name', d.driver.name)
      toast.success(`Kia ora, ${d.driver.name.split(' ')[0]}!`)
      router.push('/driver')
    } catch { toast.error('Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-[hsl(165,40%,10%)] relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div className="relative z-10 flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl p-8">
          <div className="flex items-center gap-2 mb-8">
            <span className="flex items-center justify-center h-11 w-11 rounded-full bg-primary text-primary-foreground"><Car className="h-6 w-6" /></span>
            <div>
              <div className="font-display text-lg font-semibold">Tripnz</div>
              <div className="text-xs text-muted-foreground">Driver App</div>
            </div>
          </div>
          <h1 className="font-display text-2xl font-semibold mb-1">Sign in</h1>
          <p className="text-sm text-muted-foreground mb-6">Enter your phone number and 4-digit PIN.</p>
          <form onSubmit={submit} className="space-y-4">
            <div><Label>Phone Number</Label><Input inputMode="tel" placeholder="+64..." value={phone} onChange={e => setPhone(e.target.value)} required /></div>
            <div><Label>PIN</Label><Input inputMode="numeric" type="password" maxLength={6} placeholder="••••" value={pin} onChange={e => setPin(e.target.value.replace(/\D/g,''))} required /></div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign In
            </Button>
          </form>
          <p className="text-xs text-center text-muted-foreground mt-6">Don&apos;t have credentials? Contact your dispatch team.</p>
        </div>
      </div>
    </div>
  )
}
export default DriverLoginPage
