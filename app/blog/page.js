'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import { api } from '@/lib/api-client'
import { Calendar, ArrowUpRight, User } from 'lucide-react'

function formatDate(d) {
  if (!d) return ''
  try { return new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return '' }
}

function BlogList() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/blog').then(d => { setPosts(Array.isArray(d) ? d : []); setLoading(false) })
  }, [])

  const featured = posts[0]
  const rest = posts.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <section className="relative pt-32 pb-8 bg-secondary/30">
        <div className="container">
          <div className="text-accent text-sm font-semibold uppercase tracking-widest mb-3">Stories & Guides</div>
          <h1 className="font-display text-5xl md:text-6xl font-semibold mb-4">The Tripnz Journal</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Trip journals, destination guides, and behind-the-scenes stories from our team of Kiwi guides.</p>
        </div>
      </section>

      <section className="py-14">
        <div className="container">
          {loading ? (
            <div className="text-center py-16 text-muted-foreground">Loading...</div>
          ) : posts.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">No stories yet.</div>
          ) : (
            <>
              {featured && (
                <Link href={`/blog/${featured.slug}`} className="group grid grid-cols-1 lg:grid-cols-5 gap-8 mb-16 items-center">
                  <div className="lg:col-span-3 relative aspect-[16/10] rounded-2xl overflow-hidden">
                    <img src={featured.coverImage} alt={featured.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                    <div className="absolute top-4 left-4 flex gap-2">
                      {(featured.tags || []).slice(0, 2).map(t => <span key={t} className="bg-white/95 backdrop-blur px-3 py-1 rounded-full text-xs font-semibold">{t}</span>)}
                    </div>
                  </div>
                  <div className="lg:col-span-2">
                    <div className="text-xs uppercase tracking-widest text-accent font-semibold mb-3">Featured Story</div>
                    <h2 className="font-display text-3xl md:text-4xl font-semibold leading-tight mb-4 text-balance group-hover:text-primary transition-colors">{featured.title}</h2>
                    <p className="text-muted-foreground mb-6 leading-relaxed">{featured.excerpt}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
                      <span className="flex items-center gap-1.5"><User className="h-3.5 w-3.5" /> {featured.author}</span>
                      <span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" /> {formatDate(featured.publishedAt)}</span>
                    </div>
                    <span className="inline-flex items-center gap-2 font-semibold text-primary group-hover:gap-3 transition-all">Read story <ArrowUpRight className="h-4 w-4" /></span>
                  </div>
                </Link>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {rest.map(p => (
                  <Link key={p.id} href={`/blog/${p.slug}`} className="group">
                    <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                      <img src={p.coverImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      {p.tags?.[0] && <span className="absolute top-3 left-3 bg-white/95 px-2.5 py-1 rounded-full text-[11px] font-semibold">{p.tags[0]}</span>}
                    </div>
                    <h3 className="font-display text-xl font-semibold leading-tight mb-2 group-hover:text-primary transition">{p.title}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{p.excerpt}</p>
                    <div className="flex items-center gap-3 text-xs text-muted-foreground">
                      <span>{p.author}</span>
                      <span>·</span>
                      <span>{formatDate(p.publishedAt)}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
      <SiteFooter />
    </div>
  )
}
export default BlogList
