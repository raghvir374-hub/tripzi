import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

let clientPromise = null

async function connectToMongo() {
  if (!clientPromise) {
    const c = new MongoClient(process.env.MONGO_URL)
    clientPromise = c.connect().then(() => c)
  }
  const client = await clientPromise
  return client.db(process.env.DB_NAME || 'tripzi')
}

function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
}

export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

const ADMIN_EMAIL = 'admin@demo.com'
const ADMIN_PASSWORD = 'admin123'

async function requireAdmin(db, request) {
  const auth = request.headers.get('authorization') || ''
  const token = auth.replace(/^Bearer\s+/i, '').trim()
  if (!token) return null
  const session = await db.collection('admin_sessions').findOne({ token })
  if (!session) return null
  return session
}

function slugify(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
}

function bookingRef() {
  return 'KT-' + Math.random().toString(36).slice(2, 8).toUpperCase()
}

const SEED_TOURS = [
  {
    title: 'Hobbiton Movie Set — Middle-earth Private Tour',
    slug: 'hobbiton-movie-set-private-tour',
    shortDescription: 'Step into the Shire on a private guided tour of the iconic Hobbiton set with an included Green Dragon feast.',
    description: 'Journey deep into Waikato’s green rolling hills and enter the world of Middle-earth. This immersive private tour brings you inside 44 uniquely detailed Hobbit Holes, along the Party Field, past the mill and double-arched bridge, and into The Green Dragon Inn for a traditional feast. Your local guide shares the untold stories of how Sir Peter Jackson brought Tolkien’s world to life.',
    featuredImage: 'https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxIb2JiaXRvbnxlbnwwfHx8fDE3ODU5MjIyNzd8MA&ixlib=rb-4.1.0&q=85',
    images: [
      'https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxIb2JiaXRvbnxlbnwwfHx8fDE3ODU5MjIyNzd8MA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1578305035108-429188b9ede6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHxIb2JiaXRvbnxlbnwwfHx8fDE3ODU5MjIyNzd8MA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1590002893558-64f0d58dcca4?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwzfHxIb2JiaXRvbnxlbnwwfHx8fDE3ODU5MjIyNzd8MA&ixlib=rb-4.1.0&q=85',
    ],
    highlights: ['Guided walk through 44 Hobbit Holes','Iconic Party Tree & Bag End photo stop','Feast at The Green Dragon Inn','Small group / private vehicle','Local storytelling guide'],
    included: ['Return private transfers','Bilingual guide','Entry & tour tickets','Green Dragon feast','Bottled water'],
    excluded: ['Alcoholic beverages beyond feast','Personal expenses','Tips'],
    duration: '1 Day',
    price: 349,
    location: 'Matamata, Waikato',
    meetingPoint: 'Auckland CBD hotels or Matamata i-Site',
    category: 'Cultural',
    featured: true,
    status: 'published',
  },
  {
    title: 'Tongariro Alpine Crossing — Volcanoes & Emerald Lakes',
    slug: 'tongariro-alpine-crossing',
    shortDescription: 'The world’s greatest day hike — 19.4 km across active volcanoes, emerald lakes and lunar landscapes.',
    description: 'Considered one of the greatest single-day hikes on the planet, the Tongariro Alpine Crossing takes you across a dual UNESCO World Heritage site. Traverse ancient lava flows, gaze into the Red Crater, and marvel at the surreal turquoise of the Emerald Lakes. Our certified alpine guide handles logistics, transfers, and safety so you can focus on the views.',
    featuredImage: 'https://images.unsplash.com/photo-1536744052983-bcf122437f48?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxUb25nYXJpcm98ZW58MHx8fHwxNzg1OTIyMjc3fDA&ixlib=rb-4.1.0&q=85',
    images: [
      'https://images.unsplash.com/photo-1536744052983-bcf122437f48?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxUb25nYXJpcm98ZW58MHx8fHwxNzg1OTIyMjc3fDA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1603989165791-b846b349fe3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxUb25nYXJpcm98ZW58MHx8fHwxNzg1OTIyMjc3fDA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1584877745572-ea9b2bcee602?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwyfHxUb25nYXJpcm98ZW58MHx8fHwxNzg1OTIyMjc3fDA&ixlib=rb-4.1.0&q=85',
    ],
    highlights: ['Certified alpine guide','19.4 km through active volcanic terrain','Views of Mount Ngauruhoe (Mt Doom)','Emerald & Blue Lakes photo stops','Shuttle transfers included'],
    included: ['Return shuttle from National Park Village','Certified guide','Trail snack pack','Safety gear briefing'],
    excluded: ['Hiking boots','Warm clothing (rentals available)','Lunch'],
    duration: '1 Day (7-9 hrs)',
    price: 289,
    location: 'Tongariro National Park',
    meetingPoint: 'National Park Village — 6:30am',
    category: 'Adventure',
    featured: true,
    status: 'published',
  },
  {
    title: 'Lake Taupo Geothermal & Huka Falls Escape',
    slug: 'lake-taupo-geothermal-huka-falls',
    shortDescription: 'Cruise on New Zealand’s largest lake, roar past the mighty Huka Falls and soak in natural hot springs.',
    description: 'Discover the volcanic heart of the North Island. This full-day escape combines a scenic cruise across Lake Taupo to the Maori rock carvings, a jet-boat ride to thundering Huka Falls, and a soothing soak at a geothermal hot pool. A perfect blend of adventure, culture and relaxation.',
    featuredImage: 'https://images.unsplash.com/photo-1604995384335-6b5ca07aee5a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxMYWtlJTIwVGF1cG98ZW58MHx8fHwxNzg1OTIyMzE0fDA&ixlib=rb-4.1.0&q=85',
    images: [
      'https://images.unsplash.com/photo-1604995384335-6b5ca07aee5a?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwxfHxMYWtlJTIwVGF1cG98ZW58MHx8fHwxNzg1OTIyMzE0fDA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1604038484630-3c95cf1459a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxMYWtlJTIwVGF1cG98ZW58MHx8fHwxNzg1OTIyMzE0fDA&ixlib=rb-4.1.0&q=85',
    ],
    highlights: ['Cruise to the Maori rock carvings','Huka Falls jet-boat ride','Geothermal hot pool soak','Lakeside gourmet lunch','Private guide'],
    included: ['Hotel pickup & drop-off','Cruise & jet-boat tickets','Hot pool entry','Gourmet lunch'],
    excluded: ['Extra beverages','Souvenir purchases'],
    duration: '1 Day',
    price: 419,
    location: 'Taupo, Central North Island',
    meetingPoint: 'Taupo i-Site or hotel',
    category: 'Nature',
    featured: true,
    status: 'published',
  },
  {
    title: 'Auckland City & Waiheke Wine Island',
    slug: 'auckland-city-waiheke-wine',
    shortDescription: 'Skyline highlights of the City of Sails followed by a ferry across to Waiheke’s boutique vineyards.',
    description: 'Begin in Auckland’s vibrant harbourfront with panoramic views from Mount Eden and Devonport. After lunch, catch the ferry to Waiheke Island where three award-winning vineyards await with olive-oil tastings, cellar-door pours, and views across the Hauraki Gulf.',
    featuredImage: 'https://images.unsplash.com/photo-1515248027005-c33283ec3fba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHw0fHxBdWNrbGFuZCUyMHNreWxpbmV8ZW58MHx8fHwxNzg1OTIyMzE0fDA&ixlib=rb-4.1.0&q=85',
    images: [
      'https://images.unsplash.com/photo-1515248027005-c33283ec3fba?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHw0fHxBdWNrbGFuZCUyMHNreWxpbmV8ZW58MHx8fHwxNzg1OTIyMzE0fDA&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1595125989588-36d745a2a828?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxBdWNrbGFuZCUyMHNreWxpbmV8ZW58MHx8fHwxNzg1OTIyMzE0fDA&ixlib=rb-4.1.0&q=85',
    ],
    highlights: ['Skyline panoramas from Mount Eden','Devonport & harbour drive','Ferry to Waiheke','3 vineyard cellar doors','Olive oil tasting'],
    included: ['Private vehicle','Guide','Ferry tickets','Wine tastings','Light lunch'],
    excluded: ['Bottled wine purchases','Dinner'],
    duration: '1 Day',
    price: 379,
    location: 'Auckland & Waiheke Island',
    meetingPoint: 'Auckland CBD hotels',
    category: 'City',
    featured: false,
    status: 'published',
  },
  {
    title: 'Tauranga & Mount Maunganui Coastal Discovery',
    slug: 'tauranga-mount-maunganui-coastal',
    shortDescription: 'A sun-kissed day exploring the Bay of Plenty — climb Mauao, kayak the harbour and taste fresh kiwifruit.',
    description: 'The Bay of Plenty lives up to its name. Wander golden Mount Beach, hike Mauao for 360-degree ocean views, kayak the calm harbour and finish with a stop at a working kiwifruit orchard. Ideal for cruise-ship visitors and coastal lovers alike.',
    featuredImage: 'https://images.unsplash.com/photo-1547314283-befb6cc5cf29?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85',
    images: [
      'https://images.unsplash.com/photo-1547314283-befb6cc5cf29?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHw0fHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85',
    ],
    highlights: ['Guided Mauao summit walk','Kayak the harbour','Kiwifruit orchard tasting','Cruise-ship pickup available'],
    included: ['Private transfers','Guide','Kayak & gear','Orchard entry & tasting'],
    excluded: ['Lunch','Personal items'],
    duration: '1 Day',
    price: 329,
    location: 'Tauranga, Bay of Plenty',
    meetingPoint: 'Tauranga cruise terminal or hotel',
    category: 'Nature',
    featured: false,
    status: 'published',
  },
  {
    title: 'Wellington Capital & Weta Workshop',
    slug: 'wellington-weta-workshop',
    shortDescription: 'A creative capital day — harbour views, Te Papa museum and behind-the-scenes at Weta Workshop.',
    description: 'New Zealand’s capital packs a punch. Ride the cable car above the city, stroll harbourfront cafes, explore Te Papa Tongarewa museum and step behind the scenes at the world-famous Weta Workshop — the FX studio behind The Lord of the Rings, Avatar and more.',
    featuredImage: 'https://images.unsplash.com/photo-1783016938408-0b44661b2d6c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwzfHxXZWxsaW5ndG9uJTIwaGFyYm9yfGVufDB8fHx8MTc4NTkyMjMxNHww&ixlib=rb-4.1.0&q=85',
    images: [
      'https://images.unsplash.com/photo-1783016938408-0b44661b2d6c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwzfHxXZWxsaW5ndG9uJTIwaGFyYm9yfGVufDB8fHx8MTc4NTkyMjMxNHww&ixlib=rb-4.1.0&q=85',
      'https://images.unsplash.com/photo-1578959392610-495de77b85e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwxfHxXZWxsaW5ndG9uJTIwaGFyYm9yfGVufDB8fHx8MTc4NTkyMjMxNHww&ixlib=rb-4.1.0&q=85',
    ],
    highlights: ['Wellington cable car','Te Papa museum','Weta Workshop guided tour','Harbourfront lunch stop'],
    included: ['Private vehicle','Guide','Museum & Weta tickets'],
    excluded: ['Lunch','Souvenirs'],
    duration: '1 Day',
    price: 399,
    location: 'Wellington',
    meetingPoint: 'Wellington CBD hotels',
    category: 'Cultural',
    featured: false,
    status: 'published',
  },
]

async function ensureSeed(db) {
  const count = await db.collection('tours').countDocuments()
  if (count === 0) {
    const now = new Date()
    const docs = SEED_TOURS.map(t => ({ id: uuidv4(), ...t, createdAt: now, updatedAt: now }))
    await db.collection('tours').insertMany(docs)
  }
  const settingsCount = await db.collection('settings').countDocuments()
  if (settingsCount === 0) {
    await db.collection('settings').insertOne({
      id: 'site',
      heroTitle: 'Aotearoa, on your terms.',
      heroSubtitle: 'Hand-crafted private tours across New Zealand — from Middle-earth to the Emerald Lakes.',
      heroImage: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85',
      contactEmail: 'hello@tripzi.co.nz',
      contactPhone: '+64 21 555 0199',
      whatsappNumber: '+64215550199',
      address: '12 Quay Street, Auckland CBD, New Zealand',
    })
  }
}

function clean(doc) { if (!doc) return doc; const { _id, ...rest } = doc; return rest }

async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method
  try {
    const db = await connectToMongo()
    await ensureSeed(db)

    // ---- Public ----
    if (route === '/tours' && method === 'GET') {
      const url = new URL(request.url)
      const category = url.searchParams.get('category')
      const featured = url.searchParams.get('featured')
      const q = { status: 'published' }
      if (category && category !== 'All') q.category = category
      if (featured === 'true') q.featured = true
      const tours = await db.collection('tours').find(q).sort({ featured: -1, createdAt: -1 }).toArray()
      return handleCORS(NextResponse.json(tours.map(clean)))
    }
    const tourMatch = route.match(/^\/tours\/([\w-]+)$/)
    if (tourMatch && method === 'GET') {
      const tour = await db.collection('tours').findOne({ slug: tourMatch[1] })
      if (!tour) return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
      return handleCORS(NextResponse.json(clean(tour)))
    }

    if (route === '/settings' && method === 'GET') {
      const s = await db.collection('settings').findOne({ id: 'site' })
      return handleCORS(NextResponse.json(clean(s) || {}))
    }

    if (route === '/bookings' && method === 'POST') {
      const b = await request.json()
      if (!b.fullName || !b.email || !b.phone || !b.tourId) {
        return handleCORS(NextResponse.json({ error: 'Missing fields' }, { status: 400 }))
      }
      const tour = await db.collection('tours').findOne({ id: b.tourId })
      const doc = {
        id: uuidv4(),
        bookingRef: bookingRef(),
        tourId: b.tourId,
        tourTitle: tour?.title || b.tourTitle || 'Custom',
        tourPrice: tour?.price || 0,
        fullName: b.fullName,
        email: b.email,
        phone: b.phone,
        whatsapp: b.whatsapp || b.phone,
        travelDate: b.travelDate,
        adults: Number(b.adults || 1),
        children: Number(b.children || 0),
        pickupLocation: b.pickupLocation || '',
        specialRequirements: b.specialRequirements || '',
        status: 'New',
        notes: '',
        createdAt: new Date(),
      }
      await db.collection('bookings').insertOne(doc)
      return handleCORS(NextResponse.json(clean(doc)))
    }

    if (route === '/custom-tours' && method === 'POST') {
      const b = await request.json()
      const doc = {
        id: uuidv4(),
        requestRef: 'CT-' + Math.random().toString(36).slice(2, 8).toUpperCase(),
        ...b,
        status: 'New',
        createdAt: new Date(),
      }
      await db.collection('custom_tours').insertOne(doc)
      return handleCORS(NextResponse.json(clean(doc)))
    }

    if (route === '/contacts' && method === 'POST') {
      const b = await request.json()
      const doc = { id: uuidv4(), ...b, read: false, createdAt: new Date() }
      await db.collection('contacts').insertOne(doc)
      return handleCORS(NextResponse.json(clean(doc)))
    }

    // ---- Admin auth ----
    if (route === '/admin/login' && method === 'POST') {
      const { email, password } = await request.json()
      if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
        return handleCORS(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }))
      }
      const token = uuidv4() + '-' + uuidv4()
      await db.collection('admin_sessions').insertOne({ token, email, createdAt: new Date() })
      return handleCORS(NextResponse.json({ token, email }))
    }
    if (route === '/admin/logout' && method === 'POST') {
      const auth = request.headers.get('authorization') || ''
      const token = auth.replace(/^Bearer\s+/i, '').trim()
      if (token) await db.collection('admin_sessions').deleteOne({ token })
      return handleCORS(NextResponse.json({ ok: true }))
    }
    if (route === '/admin/me' && method === 'GET') {
      const s = await requireAdmin(db, request)
      if (!s) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      return handleCORS(NextResponse.json({ email: s.email }))
    }

    // ---- Admin protected ----
    if (route.startsWith('/admin/')) {
      const s = await requireAdmin(db, request)
      if (!s) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))

      if (route === '/admin/stats' && method === 'GET') {
        const [tours, bookings, custom, contacts, recent] = await Promise.all([
          db.collection('tours').countDocuments(),
          db.collection('bookings').countDocuments(),
          db.collection('custom_tours').countDocuments(),
          db.collection('contacts').countDocuments(),
          db.collection('bookings').find({}).sort({ createdAt: -1 }).limit(5).toArray(),
        ])
        const revenue = await db.collection('bookings').aggregate([
          { $match: { status: { $in: ['Confirmed', 'Completed'] } } },
          { $group: { _id: null, total: { $sum: { $multiply: ['$tourPrice', { $add: ['$adults', { $multiply: ['$children', 0.6] }] }] } } } }
        ]).toArray()
        return handleCORS(NextResponse.json({ tours, bookings, custom, contacts, recent: recent.map(clean), revenue: Math.round(revenue[0]?.total || 0) }))
      }

      if (route === '/admin/tours' && method === 'GET') {
        const list = await db.collection('tours').find({}).sort({ createdAt: -1 }).toArray()
        return handleCORS(NextResponse.json(list.map(clean)))
      }
      if (route === '/admin/tours' && method === 'POST') {
        const b = await request.json()
        const doc = {
          id: uuidv4(),
          title: b.title,
          slug: b.slug || slugify(b.title || ''),
          shortDescription: b.shortDescription || '',
          description: b.description || '',
          featuredImage: b.featuredImage || '',
          images: b.images || [],
          highlights: b.highlights || [],
          included: b.included || [],
          excluded: b.excluded || [],
          duration: b.duration || '1 Day',
          price: Number(b.price || 0),
          location: b.location || '',
          meetingPoint: b.meetingPoint || '',
          category: b.category || 'Nature',
          featured: !!b.featured,
          status: b.status || 'published',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
        await db.collection('tours').insertOne(doc)
        return handleCORS(NextResponse.json(clean(doc)))
      }
      const at = route.match(/^\/admin\/tours\/([\w-]+)$/)
      if (at) {
        if (method === 'GET') {
          const t = await db.collection('tours').findOne({ id: at[1] })
          return handleCORS(NextResponse.json(clean(t)))
        }
        if (method === 'PUT') {
          const b = await request.json()
          delete b._id
          delete b.id
          b.updatedAt = new Date()
          if (b.price !== undefined) b.price = Number(b.price)
          await db.collection('tours').updateOne({ id: at[1] }, { $set: b })
          const t = await db.collection('tours').findOne({ id: at[1] })
          return handleCORS(NextResponse.json(clean(t)))
        }
        if (method === 'DELETE') {
          await db.collection('tours').deleteOne({ id: at[1] })
          return handleCORS(NextResponse.json({ ok: true }))
        }
      }

      if (route === '/admin/bookings' && method === 'GET') {
        const list = await db.collection('bookings').find({}).sort({ createdAt: -1 }).toArray()
        return handleCORS(NextResponse.json(list.map(clean)))
      }
      const ab = route.match(/^\/admin\/bookings\/([\w-]+)$/)
      if (ab && method === 'PATCH') {
        const b = await request.json()
        delete b._id
        await db.collection('bookings').updateOne({ id: ab[1] }, { $set: b })
        const t = await db.collection('bookings').findOne({ id: ab[1] })
        return handleCORS(NextResponse.json(clean(t)))
      }
      if (ab && method === 'DELETE') {
        await db.collection('bookings').deleteOne({ id: ab[1] })
        return handleCORS(NextResponse.json({ ok: true }))
      }

      if (route === '/admin/custom-tours' && method === 'GET') {
        const list = await db.collection('custom_tours').find({}).sort({ createdAt: -1 }).toArray()
        return handleCORS(NextResponse.json(list.map(clean)))
      }
      if (route === '/admin/contacts' && method === 'GET') {
        const list = await db.collection('contacts').find({}).sort({ createdAt: -1 }).toArray()
        return handleCORS(NextResponse.json(list.map(clean)))
      }

      if (route === '/admin/settings' && method === 'PUT') {
        const b = await request.json()
        delete b._id
        await db.collection('settings').updateOne({ id: 'site' }, { $set: b }, { upsert: true })
        const s = await db.collection('settings').findOne({ id: 'site' })
        return handleCORS(NextResponse.json(clean(s)))
      }
    }

    return handleCORS(NextResponse.json({ error: `Route ${route} not found` }, { status: 404 }))
  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json({ error: 'Internal server error', detail: String(error?.message || error) }, { status: 500 }))
  }
}

export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute
