import Link from 'next/link'
import { Compass, Mail, Phone, MapPin, Facebook, Instagram, Twitter } from 'lucide-react'

export default function SiteFooter() {
  return (
    <footer className="bg-[hsl(165,40%,10%)] text-white/80 mt-24">
      <div className="container py-16 grid grid-cols-1 md:grid-cols-4 gap-10">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center justify-center h-10 w-10 rounded-full bg-accent text-accent-foreground"><Compass className="h-5 w-5" /></span>
            <span className="font-display text-2xl font-semibold text-white">Tripzi</span>
          </div>
          <p className="text-sm leading-relaxed">Hand-crafted private tours across Aotearoa. From Middle-earth to Middle-of-nowhere — we plan every mile.</p>
          <div className="flex gap-3 mt-6">
            <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition"><Facebook className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition"><Instagram className="h-4 w-4" /></a>
            <a href="#" className="h-9 w-9 rounded-full bg-white/10 hover:bg-accent hover:text-accent-foreground flex items-center justify-center transition"><Twitter className="h-4 w-4" /></a>
          </div>
        </div>

        <div>
          <h4 className="font-display text-lg text-white mb-4">Explore</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/tours" className="hover:text-accent">All Tours</Link></li>
            <li><Link href="/custom-tour" className="hover:text-accent">Custom Journey</Link></li>
            <li><Link href="/blog" className="hover:text-accent">Journal</Link></li>
            <li><Link href="/about" className="hover:text-accent">About Us</Link></li>
            <li><Link href="/contact" className="hover:text-accent">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-white mb-4">Destinations</h4>
          <ul className="space-y-2 text-sm">
            <li>Hobbiton Movie Set</li>
            <li>Tongariro National Park</li>
            <li>Lake Taupo</li>
            <li>Auckland &amp; Wellington</li>
            <li>Tauranga &amp; Bay of Plenty</li>
          </ul>
        </div>

        <div>
          <h4 className="font-display text-lg text-white mb-4">Get in Touch</h4>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin className="h-4 w-4 mt-0.5 text-accent" /> 12 Quay Street, Auckland CBD, NZ</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4 text-accent" /> +64 21 555 0199</li>
            <li className="flex items-center gap-2"><Mail className="h-4 w-4 text-accent" /> hello@tripzi.co.nz</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10">
        <div className="container py-6 flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-white/60">
          <span>© {new Date().getFullYear()} Tripzi. All rights reserved.</span>
          <div className="flex gap-6"><a href="#" className="hover:text-accent">Privacy</a><a href="#" className="hover:text-accent">Terms</a></div>
        </div>
      </div>
    </footer>
  )
}
