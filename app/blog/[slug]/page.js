import { headers } from 'next/headers'
import BlogPostView from './view'

async function fetchPost(slug) {
  try {
    const h = await headers()
    const host = h.get('x-forwarded-host') || h.get('host')
    const proto = h.get('x-forwarded-proto') || 'https'
    const base = process.env.NEXT_PUBLIC_BASE_URL || `${proto}://${host}`
    const res = await fetch(`${base}/api/blog/${slug}`, { cache: 'no-store' })
    if (!res.ok) return null
    return res.json()
  } catch { return null }
}

export async function generateMetadata({ params }) {
  const { slug } = await params
  const data = await fetchPost(slug)
  const p = data?.post
  if (!p) return { title: 'Story — Tripzi' }
  const title = `${p.title} — Tripzi`
  return {
    title,
    description: p.excerpt,
    openGraph: {
      title, description: p.excerpt, type: 'article',
      images: p.coverImage ? [{ url: p.coverImage }] : undefined,
      publishedTime: p.publishedAt,
      authors: p.author ? [p.author] : undefined,
      tags: p.tags,
    },
    twitter: { card: 'summary_large_image', title, description: p.excerpt, images: p.coverImage ? [p.coverImage] : undefined },
    alternates: { canonical: `/blog/${p.slug}` },
  }
}

export default async function Page({ params }) {
  const { slug } = await params
  const data = await fetchPost(slug)
  return <BlogPostView initial={data} slug={slug} />
}
