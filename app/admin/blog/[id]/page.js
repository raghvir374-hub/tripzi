'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api-client'
import { BlogForm } from '../new/page'

function EditBlogPage() {
  const { id } = useParams()
  const [post, setPost] = useState(null)
  useEffect(() => { api.get(`/admin/blog_posts/${id}`).then(setPost) }, [id])
  if (!post) return <div>Loading...</div>
  return <BlogForm initial={post} isNew={false} />
}
export default EditBlogPage
