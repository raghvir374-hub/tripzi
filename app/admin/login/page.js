'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Compass, Loader2 } from 'lucide-react'
import { toast } from 'sonner'

function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('admin@demo.com')
  const [password, setPassword] = useState('admin123')
  const [loading, setLoading] = useState(false)

  async function submit(e) {
    e.preventDefault()
    setLoading(true)
    try {
      const r = await fetch('/api/admin/login', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      const d = await r.json()
      if (d.error) { toast.error(d.error); return }
      localStorage.setItem('admin_token', d.token)
      localStorage.setItem('admin_email', d.email)
      toast.success('Welcome back!')
      router.push('/admin')
    } catch { toast.error('Login failed') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen flex bg-[hsl(165,40%,10%)] relative overflow-hidden">
      <img src="https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85" className="absolute inset-0 w-full h-full object-cover opacity-25" />
      <div className="relative z-10 flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-10">
          <div className="flex items-center gap-2 mb-8">
            <span className="flex items-center justify-center h-11 w-11 rounded-full bg-primary text-primary-foreground"><Compass className="h-6 w-6" /></span>
            <div>
              <div className="font-display text-xl font-semibold">Tripnz</div>
              <div className="text-xs text-muted-foreground">Admin Console</div>
            </div>
          </div>
          <h1 className="font-display text-3xl font-semibold mb-2">Welcome back</h1>
          <p className="text-muted-foreground mb-8">Sign in to manage tours, bookings and enquiries.</p>
          <form onSubmit={submit} className="space-y-4">
            <div><Label>Email</Label><Input value={email} onChange={e => setEmail(e.target.value)} required /></div>
            <div><Label>Password</Label><Input type="password" value={password} onChange={e => setPassword(e.target.value)} required /></div>
            <Button type="submit" disabled={loading} className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground text-base font-semibold">
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Sign In
            </Button>
          </form>
          <div className="mt-6 p-4 bg-secondary rounded-xl text-xs text-muted-foreground">
            <strong>Demo credentials:</strong> admin@demo.com / admin123
          </div>
        </div>
      </div>
    </div>
  )
}
export default AdminLoginPage
