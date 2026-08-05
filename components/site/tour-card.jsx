import Link from 'next/link'
import { MapPin, Clock, Star, ArrowUpRight } from 'lucide-react'

export default function TourCard({ tour }) {
  return (
    <Link href={`/tours/${tour.slug}`} className="group relative block overflow-hidden rounded-2xl bg-card shadow-sm hover:shadow-2xl transition-all duration-500 border border-border/50">
      <div className="relative aspect-[4/5] overflow-hidden">
        <img src={tour.featuredImage} alt={tour.title} className="absolute inset-0 h-full w-full object-cover group-hover:scale-110 transition-transform duration-700" />
        <div className="absolute inset-0 bg-card-gradient" />
        {tour.featured && (
          <span className="absolute top-4 left-4 bg-accent text-accent-foreground text-[11px] uppercase font-bold tracking-wider px-3 py-1 rounded-full">Featured</span>
        )}
        <span className="absolute top-4 right-4 bg-white/95 text-foreground text-xs font-semibold px-3 py-1 rounded-full flex items-center gap-1">
          <Star className="h-3 w-3 fill-accent text-accent" /> 4.9
        </span>
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <div className="flex items-center gap-3 text-xs opacity-90 mb-2">
            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{tour.location}</span>
            <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{tour.duration}</span>
          </div>
          <h3 className="font-display text-2xl font-semibold leading-tight mb-2 text-balance">{tour.title}</h3>
          <div className="flex items-end justify-between">
            <div>
              <div className="text-[11px] uppercase tracking-wider opacity-70">From</div>
              <div className="font-display text-2xl font-bold">NZ${tour.price}</div>
            </div>
            <div className="h-10 w-10 rounded-full bg-white text-primary flex items-center justify-center group-hover:bg-accent group-hover:text-accent-foreground transition">
              <ArrowUpRight className="h-4 w-4" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  )
}
