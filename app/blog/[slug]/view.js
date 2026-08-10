'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import SiteHeader from '@/components/site/header'
import SiteFooter from '@/components/site/footer'
import { Calendar, User, ArrowLeft, ArrowUpRight, Tag } from 'lucide-react'

function formatDate(d) {
  if (!d) return ''
  try { return new Date(d).toLocaleDateString('en-NZ', { day: 'numeric', month: 'long', year: 'numeric' }) }
  catch { return '' }
}

// Render markdown-ish body: split by lines, render ## headings and paragraphs, and bullet lists starting with '- '
function renderBody(body) {
  const blocks = []
  const lines = (body || '').split('\n')
  let listBuf = []
  let paraBuf = []
  const flushPara = () => { if (paraBuf.length) { blocks.push({ type: 'p', text: paraBuf.join(' ') }); paraBuf = [] } }
  const flushList = () => { if (listBuf.length) { blocks.push({ type: 'ul', items: listBuf }); listBuf = [] } }
  for (const raw of lines) {
    const line = raw.trim()
    if (line.startsWith('## ')) { flushPara(); flushList(); blocks.push({ type: 'h2', text: line.slice(3) }) }
    else if (line.startsWith('- ')) { flushPara(); listBuf.push(line.slice(2)) }
    else if (line === '') { flushPara(); flushList() }
    else paraBuf.push(line)
  }
  flushPara(); flushList()
  return blocks
}

export default function BlogPostView({ initial, slug }) {
  const [data, setData] = useState(initial)
  useEffect(() => { if (!initial) fetch(`/api/blog/${slug}`).then(r => r.json()).then(setData) }, [initial, slug])

  if (!data || data.error) return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <div className="min-h-[60vh] flex items-center justify-center">Story not found.</div>
      <SiteFooter />
    </div>
  )
  const p = data.post
  const blocks = renderBody(p.body)

  // JSON-LD structured data
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'BlogPosting',
    headline: p.title, description: p.excerpt, image: p.coverImage,
    datePublished: p.publishedAt, author: { '@type': 'Person', name: p.author || 'Tripzi' },
    publisher: { '@type': 'Organization', name: 'Tripzi' },
  }

  return (
    <div className="min-h-screen bg-background">
      <SiteHeader />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      {/* Hero */}
      <section className="relative h-[70vh] min-h-[520px] w-full overflow-hidden">
        <img src={p.coverImage} alt={p.title} className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/50" />
        <div className="relative container h-full flex items-end pb-16 text-white">
          <div className="max-w-3xl">
            <Link href="/blog" className="inline-flex items-center gap-1.5 text-sm text-white/85 hover:text-white mb-6"><ArrowLeft className="h-3.5 w-3.5" /> All Stories</Link>
            <div className="flex gap-2 mb-4">{(p.tags || []).slice(0, 3).map(t => <span key={t} className="bg-white/15 backdrop-blur border border-white/20 px-3 py-1 rounded-full text-xs font-medium">{t}</span>)}</div>
            <h1 className="font-display text-4xl md:text-6xl font-semibold text-balance leading-tight">{p.title}</h1>
            <div className="flex flex-wrap items-center gap-4 mt-6 text-sm text-white/85">
              <span className="flex items-center gap-1.5"><User className="h-4 w-4" /> {p.author}</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" /> {formatDate(p.publishedAt)}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Body */}
      <section className="py-16">
        <div className="container max-w-3xl">
          <div className="text-xl text-foreground/85 leading-relaxed mb-8 font-medium">{p.excerpt}</div>
          <article className="prose-content space-y-5 text-lg leading-relaxed text-foreground/85">
            {blocks.map((b, i) => {
              if (b.type === 'h2') return <h2 key={i} className="font-display text-2xl md:text-3xl font-semibold mt-10 mb-3 text-foreground">{b.text}</h2>
              if (b.type === 'ul') return <ul key={i} className="list-disc pl-6 space-y-2">{b.items.map((it, j) => <li key={j}>{it}</li>)}</ul>
              return <p key={i}>{b.text}</p>
            })}
          </article>
        </div>
      </section>

      {/* Related */}
      {(data.related || []).length > 0 && (
        <section className="py-16 bg-secondary/40">
          <div className="container">
            <h3 className="font-display text-2xl md:text-3xl font-semibold mb-8">Keep reading</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {data.related.map(r => (
                <Link key={r.id} href={`/blog/${r.slug}`} className="group">
                  <div className="relative aspect-[4/3] rounded-2xl overflow-hidden mb-4">
                    <img src={r.coverImage} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  </div>
                  <h4 className="font-display text-lg font-semibold group-hover:text-primary transition">{r.title}</h4>
                  <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <SiteFooter />
    </div>
  )
}
