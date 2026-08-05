'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { api } from '@/lib/api-client'
import { TourForm } from '../new/page'

function EditTourPage() {
  const { id } = useParams()
  const [tour, setTour] = useState(null)
  useEffect(() => { api.get(`/admin/tours/${id}`).then(setTour) }, [id])
  if (!tour) return <div>Loading...</div>
  return <TourForm initial={tour} isNew={false} />
}
export default EditTourPage
