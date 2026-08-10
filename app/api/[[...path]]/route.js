import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { notifyAdmin, sendWhatsAppText, formatBookingAlert, formatCustomAlert, formatContactAlert, formatCustomerBookingConfirm } from '@/lib/whatsapp'

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

let seedPromise = null
async function ensureSeed(db) {
  if (seedPromise) return seedPromise
  seedPromise = (async () => {
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
      // About page content
      aboutTagline: 'About Tripzi',
      aboutHeadline: 'Aotearoa, told by the people who love it most.',
      aboutBody: 'We are a small team of Auckland-based Kiwis obsessed with sharing New Zealand the right way — slowly, intimately and always in private company. Since 2013 we have guided over 3,000 travellers across every region of our two islands.\n\nNo mass buses. No rushed stops. Just you, your group, a certified local guide and a private vehicle — crafting a story you will tell for years.',
      aboutImage1: 'https://images.unsplash.com/photo-1465056836041-7f43ac27dcb5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwxfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85',
      aboutImage2: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1NzV8MHwxfHNlYXJjaHwyfHx0cmF2ZWwlMjBidXN8ZW58MHx8fHwxNzg1OTIyMzIwfDA&ixlib=rb-4.1.0&q=85',
      aboutStat1Value: '3,000+', aboutStat1Label: 'Happy Travellers',
      aboutStat2Value: '42', aboutStat2Label: 'NZ Destinations',
      aboutStat3Value: '4.9★', aboutStat3Label: 'Average Rating',
      aboutStat4Value: '12yrs', aboutStat4Label: 'Guiding Aotearoa',
    })
  }
  const dc = await db.collection('destinations').countDocuments()
  if (dc === 0) {
    const now = new Date()
    const seed = [
      { name: 'Hobbiton', tag: 'Middle-earth', img: 'https://images.unsplash.com/photo-1578305035108-429188b9ede6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwyfHxIb2JiaXRvbnxlbnwwfHx8fDE3ODU5MjIyNzd8MA&ixlib=rb-4.1.0&q=85', order: 1 },
      { name: 'Tongariro', tag: 'Alpine', img: 'https://images.unsplash.com/photo-1603989165791-b846b349fe3e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwzfHxUb25nYXJpcm98ZW58MHx8fHwxNzg1OTIyMjc3fDA&ixlib=rb-4.1.0&q=85', order: 2 },
      { name: 'Lake Taupo', tag: 'Geothermal', img: 'https://images.unsplash.com/photo-1604038484630-3c95cf1459a0?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTY2Njd8MHwxfHNlYXJjaHwyfHxMYWtlJTIwVGF1cG98ZW58MHx8fHwxNzg1OTIyMzE0fDA&ixlib=rb-4.1.0&q=85', order: 3 },
      { name: 'Auckland', tag: 'City of Sails', img: 'https://images.unsplash.com/photo-1595125989588-36d745a2a828?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDZ8MHwxfHNlYXJjaHwzfHxBdWNrbGFuZCUyMHNreWxpbmV8ZW58MHx8fHwxNzg1OTIyMzE0fDA&ixlib=rb-4.1.0&q=85', order: 4 },
      { name: 'Wellington', tag: 'Capital', img: 'https://images.unsplash.com/photo-1578959392610-495de77b85e6?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjA1MDV8MHwxfHNlYXJjaHwxfHxXZWxsaW5ndG9uJTIwaGFyYm9yfGVufDB8fHx8MTc4NTkyMjMxNHww&ixlib=rb-4.1.0&q=85', order: 5 },
      { name: 'Tauranga', tag: 'Bay of Plenty', img: 'https://images.unsplash.com/photo-1597655601841-214a4cfe8b2c?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwzfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85', order: 6 },
    ]
    await db.collection('destinations').insertMany(seed.map(s => ({ id: uuidv4(), ...s, createdAt: now })))
  }
  const tc = await db.collection('testimonials').countDocuments()
  if (tc === 0) {
    const now = new Date()
    const seed = [
      { name: 'Priya & Arjun', country: 'India', text: 'The Hobbiton private tour was pure magic — our guide even knew where Frodo\u2019s stunt double lived. Tripzi made our honeymoon.', avatar: 'https://i.pravatar.cc/120?img=47', rating: 5, order: 1 },
      { name: 'Emma Whitaker', country: 'UK', text: 'Tongariro Crossing was on my bucket list for 20 years. The certified guide, the shuttle logistics, everything was flawless.', avatar: 'https://i.pravatar.cc/120?img=45', rating: 5, order: 2 },
      { name: 'The Chen Family', country: 'Singapore', text: 'They tailored a 9-day North Island road trip with kids in mind. Every hotel, every meal, every stop — perfect.', avatar: 'https://i.pravatar.cc/120?img=32', rating: 5, order: 3 },
    ]
    await db.collection('testimonials').insertMany(seed.map(s => ({ id: uuidv4(), ...s, createdAt: now })))
  }
  const fc = await db.collection('faqs').countDocuments()
  if (fc === 0) {
    const now = new Date()
    const seed = [
      { question: 'Are all Tripzi tours private?', answer: 'Yes — every journey is private for you and your travelling companions. No strangers, no fixed departures, no rushed stops.', order: 1 },
      { question: 'Do I need to pay a deposit to reserve a date?', answer: 'A 20% deposit secures your date once we confirm availability. The balance is due 7 days before your tour.', order: 2 },
      { question: 'What if the weather is bad?', answer: 'Our guides monitor conditions in real time and will rearrange the day to keep you safe and dry. Full refunds are given for cancellations we make due to safety.', order: 3 },
      { question: 'Can you accommodate dietary requirements?', answer: 'Absolutely. Let us know when you book — we work with restaurants across New Zealand to cater vegetarian, vegan, gluten-free, halal, and allergy-conscious meals.', order: 4 },
      { question: 'How do I get picked up?', answer: 'For most tours we pick you up from your Auckland CBD hotel or a nominated meeting point. Regional pickups are noted on each tour page.', order: 5 },
    ]
    await db.collection('faqs').insertMany(seed.map(s => ({ id: uuidv4(), ...s, createdAt: now })))
  }
  const bc = await db.collection('blog_posts').countDocuments()
  if (bc === 0) {
    const now = new Date()
    const seed = [
      {
        title: 'The Ultimate Guide to Tongariro Alpine Crossing',
        slug: 'ultimate-guide-tongariro-alpine-crossing',
        excerpt: 'Everything you need to know before tackling New Zealand\u2019s greatest one-day hike \u2014 from gear lists to Emerald Lake photo spots.',
        coverImage: 'https://images.unsplash.com/photo-1536744052983-bcf122437f48?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NTYxODl8MHwxfHNlYXJjaHwxfHxUb25nYXJpcm98ZW58MHx8fHwxNzg1OTIyMjc3fDA&ixlib=rb-4.1.0&q=85',
        author: 'Aroha, Head Guide',
        tags: ['Hiking', 'Tongariro', 'Adventure'],
        body: `The Tongariro Alpine Crossing is 19.4 km of raw volcanic drama, dropped in the middle of the North Island. It\u2019s regularly voted one of the greatest single-day hikes on Earth, and after guiding hundreds of parties across it, I can tell you: it lives up to the hype.\n\n## When to go\nDecember to April is the "green season" and easiest for most walkers. Winter crossings require crampons, ice-axes and a certified alpine guide.\n\n## What to pack\n- Sturdy waterproof boots (this is not a sneaker walk)\n- 2\u20133 litres of water per person\n- Wind & waterproof shell\n- Snacks with real calories \u2014 chocolate, nuts, wraps\n- Sunscreen (the sun is fierce above the tree-line)\n\n## The highlights\nStart pre-dawn at Mangatepopo, wind through the Devil\u2019s Staircase, then crest the Red Crater for that unbelievable view of the Emerald Lakes glowing turquoise below. Descend through Ketetahi Springs and finish at the northern car park \u2014 roughly 7\u20139 hours all up.\n\n## Book with us\nOur private guided Crossing includes shuttle logistics, gear checks, snacks, and a certified local who tells you the legends behind every crater. Reach out via the Custom Tour form to plan yours.`,
        published: true,
        publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 7),
        order: 1,
      },
      {
        title: 'Hobbiton Beyond the Movie Set: 5 Insider Secrets',
        slug: 'hobbiton-insider-secrets',
        excerpt: 'The Shire is more than a photo backdrop. Here are five stories your Hobbiton guide might not tell you \u2014 unless you ask.',
        coverImage: 'https://images.unsplash.com/photo-1627686973009-0de79c0c3f6b?crop=entropy&cs=srgb&fm=jpg&ixid=M3w4NjAzNDR8MHwxfHNlYXJjaHwxfHxIb2JiaXRvbnxlbnwwfHx8fDE3ODU5MjIyNzd8MA&ixlib=rb-4.1.0&q=85',
        author: 'Matt, Tripzi Founder',
        tags: ['Hobbiton', 'Movies', 'Waikato'],
        body: `Sir Peter Jackson chose Alexander Farm because of one perfect view. Standing at the Party Field looking back toward the Alexander family homestead, the rolling green hills form an amphitheatre that photographs like nowhere else on the planet.\n\n## 1. The Party Tree is real\nThat towering oak at the centre of the set is a genuine 100-year-old oak. Every leaf you see was hand-glued back on after a storm knocked them off two weeks before filming.\n\n## 2. Each Hobbit Hole has a story\nThe production team assigned each of the 44 Hobbit Holes to a specific fictional Hobbit family. Look for the tiny occupation-themed props at each door \u2014 the beekeeper, the cheesemaker, the woodcutter.\n\n## 3. The Green Dragon serves real ale\nBrewed on-site to a period-authentic recipe. The Sackville Cider is our favourite \u2014 order a half if you\u2019re driving.\n\n## 4. Best photo time is late afternoon\nGolden hour hits the western hillside from around 4:30pm in summer. Book the late tour if you can.\n\n## 5. Look up\nSmoke curls from the chimneys thanks to hidden gas burners \u2014 many visitors miss it because they\u2019re busy photographing the doors.`,
        published: true,
        publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24 * 3),
        order: 2,
      },
      {
        title: '10 Days on the North Island: The Perfect Private Itinerary',
        slug: '10-day-north-island-private-itinerary',
        excerpt: 'From Auckland harbour to Wellington cable cars, here\u2019s the exact route we design for first-time visitors who want to see it all.',
        coverImage: 'https://images.unsplash.com/photo-1494500764479-0c8f2919a3d8?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2Mzl8MHwxfHNlYXJjaHwyfHxOZXclMjBaZWFsYW5kJTIwbGFuZHNjYXBlfGVufDB8fHx8MTc4NTkyMjI3N3ww&ixlib=rb-4.1.0&q=85',
        author: 'The Tripzi Team',
        tags: ['Itinerary', 'North Island', 'Planning'],
        body: `We\u2019re asked "how long do I really need on the North Island?" every day. Our answer is 10 days \u2014 enough to breathe, but tight enough to keep momentum. Here\u2019s the itinerary we book most often.\n\n## Days 1\u20132: Auckland\nArrival day is for jet-lag recovery. Day 2 covers Mount Eden panoramas, Devonport ferry, and a Waiheke Island wine crawl.\n\n## Day 3: Hobbiton + Waitomo\nMorning at the Movie Set, afternoon in the glow-worm caves. Overnight in Rotorua.\n\n## Days 4\u20135: Rotorua & Taupo\nGeothermal wonderland: Wai-O-Tapu, Polynesian Spa, Maori cultural evening. Then Taupo for Huka Falls and lakeside dinner.\n\n## Days 6\u20137: Tongariro & Napier\nAlpine Crossing on Day 6 (weather permitting), then east to Napier\u2019s art-deco streets and Hawke\u2019s Bay wineries.\n\n## Days 8\u20139: Wellington\nCable car, Te Papa museum, Weta Workshop, Cuba Street cafes. Wellington is small \u2014 walk everywhere.\n\n## Day 10: Departure\nEasy morning, transfer to Wellington airport.\n\nReach out to design yours \u2014 we can flex any of these stops.`,
        published: true,
        publishedAt: new Date(now.getTime() - 1000 * 60 * 60 * 24),
        order: 3,
      },
    ]
    await db.collection('blog_posts').insertMany(seed.map(s => ({ id: uuidv4(), ...s, createdAt: now, updatedAt: now })))
  }
  })()
  return seedPromise
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

    // Public lookup by booking ref (used by voucher PDF on success page)
    const brMatch = route.match(/^\/bookings\/lookup\/([\w-]+)$/)
    if (brMatch && method === 'GET') {
      const b = await db.collection('bookings').findOne({ bookingRef: brMatch[1] })
      if (!b) return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
      const tour = b.tourId ? await db.collection('tours').findOne({ id: b.tourId }) : null
      return handleCORS(NextResponse.json({ booking: clean(b), tour: clean(tour) }))
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
      // Fire-and-forget WhatsApp notifications
      notifyAdmin(formatBookingAlert(doc, tour)).catch(() => {})
      if (doc.whatsapp) sendWhatsAppText(doc.whatsapp, formatCustomerBookingConfirm(doc, tour)).catch(() => {})
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
      notifyAdmin(formatCustomAlert(doc)).catch(() => {})
      return handleCORS(NextResponse.json(clean(doc)))
    }

    if (route === '/contacts' && method === 'POST') {
      const b = await request.json()
      const doc = { id: uuidv4(), ...b, read: false, createdAt: new Date() }
      await db.collection('contacts').insertOne(doc)
      notifyAdmin(formatContactAlert(doc)).catch(() => {})
      return handleCORS(NextResponse.json(clean(doc)))
    }

    // Public content lists (used by home + about pages)
    if (route === '/destinations' && method === 'GET') {
      const list = await db.collection('destinations').find({}).sort({ order: 1, createdAt: 1 }).toArray()
      return handleCORS(NextResponse.json(list.map(clean)))
    }
    if (route === '/testimonials' && method === 'GET') {
      const list = await db.collection('testimonials').find({}).sort({ order: 1, createdAt: 1 }).toArray()
      return handleCORS(NextResponse.json(list.map(clean)))
    }
    if (route === '/faqs' && method === 'GET') {
      const list = await db.collection('faqs').find({}).sort({ order: 1, createdAt: 1 }).toArray()
      return handleCORS(NextResponse.json(list.map(clean)))
    }

    // Public blog
    if (route === '/blog' && method === 'GET') {
      const url = new URL(request.url)
      const tag = url.searchParams.get('tag')
      const q = { published: true }
      if (tag) q.tags = tag
      const list = await db.collection('blog_posts').find(q).sort({ publishedAt: -1, createdAt: -1 }).toArray()
      return handleCORS(NextResponse.json(list.map(clean)))
    }
    const blogMatch = route.match(/^\/blog\/([\w-]+)$/)
    if (blogMatch && method === 'GET') {
      const post = await db.collection('blog_posts').findOne({ slug: blogMatch[1], published: true })
      if (!post) return handleCORS(NextResponse.json({ error: 'Not found' }, { status: 404 }))
      const related = await db.collection('blog_posts').find({ slug: { $ne: post.slug }, published: true }).sort({ publishedAt: -1 }).limit(3).toArray()
      return handleCORS(NextResponse.json({ post: clean(post), related: related.map(clean) }))
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

      // Generic CMS CRUD for destinations, testimonials, faqs, blog_posts
      for (const coll of ['destinations', 'testimonials', 'faqs', 'blog_posts']) {
        if (route === `/admin/${coll}` && method === 'GET') {
          const list = await db.collection(coll).find({}).sort({ order: 1, createdAt: -1 }).toArray()
          return handleCORS(NextResponse.json(list.map(clean)))
        }
        if (route === `/admin/${coll}` && method === 'POST') {
          const b = await request.json()
          const doc = { id: uuidv4(), ...b, createdAt: new Date() }
          if (doc.order !== undefined) doc.order = Number(doc.order)
          if (coll === 'blog_posts') {
            if (!doc.slug && doc.title) doc.slug = slugify(doc.title)
            doc.updatedAt = new Date()
            if (doc.published && !doc.publishedAt) doc.publishedAt = new Date()
          }
          await db.collection(coll).insertOne(doc)
          return handleCORS(NextResponse.json(clean(doc)))
        }
        const m = route.match(new RegExp(`^/admin/${coll}/([\\w-]+)$`))
        if (m && method === 'GET') {
          const d = await db.collection(coll).findOne({ id: m[1] })
          return handleCORS(NextResponse.json(clean(d)))
        }
        if (m && method === 'PUT') {
          const b = await request.json()
          delete b._id; delete b.id
          if (b.order !== undefined) b.order = Number(b.order)
          if (coll === 'blog_posts') {
            b.updatedAt = new Date()
            if (b.published && !b.publishedAt) b.publishedAt = new Date()
          }
          await db.collection(coll).updateOne({ id: m[1] }, { $set: b })
          const d = await db.collection(coll).findOne({ id: m[1] })
          return handleCORS(NextResponse.json(clean(d)))
        }
        if (m && method === 'DELETE') {
          await db.collection(coll).deleteOne({ id: m[1] })
          return handleCORS(NextResponse.json({ ok: true }))
        }
      }

      // Drivers CRUD
      if (route === '/admin/drivers' && method === 'GET') {
        const list = await db.collection('drivers').find({}).sort({ createdAt: -1 }).toArray()
        return handleCORS(NextResponse.json(list.map(clean)))
      }
      if (route === '/admin/drivers' && method === 'POST') {
        const b = await request.json()
        if (!b.name || !b.phone || !b.pin) return handleCORS(NextResponse.json({ error: 'name, phone, pin required' }, { status: 400 }))
        const pin = String(b.pin).padStart(4, '0').slice(0, 6)
        const doc = {
          id: uuidv4(),
          name: b.name,
          phone: b.phone,
          pin,
          vehicle: b.vehicle || '',
          license: b.license || '',
          available: b.available !== false,
          createdAt: new Date(),
        }
        await db.collection('drivers').insertOne(doc)
        return handleCORS(NextResponse.json(clean(doc)))
      }
      const ad = route.match(/^\/admin\/drivers\/([\w-]+)$/)
      if (ad && method === 'PUT') {
        const b = await request.json()
        delete b._id; delete b.id
        if (b.pin) b.pin = String(b.pin).padStart(4, '0').slice(0, 6)
        await db.collection('drivers').updateOne({ id: ad[1] }, { $set: b })
        const d = await db.collection('drivers').findOne({ id: ad[1] })
        return handleCORS(NextResponse.json(clean(d)))
      }
      if (ad && method === 'DELETE') {
        await db.collection('drivers').deleteOne({ id: ad[1] })
        return handleCORS(NextResponse.json({ ok: true }))
      }
    }

    // ---- Driver portal auth ----
    if (route === '/driver/login' && method === 'POST') {
      const { phone, pin } = await request.json()
      if (!phone || !pin) return handleCORS(NextResponse.json({ error: 'Phone and PIN required' }, { status: 400 }))
      const normPhone = String(phone).replace(/\s+/g, '')
      const driver = await db.collection('drivers').findOne({ phone: normPhone, pin: String(pin) })
      if (!driver) return handleCORS(NextResponse.json({ error: 'Invalid credentials' }, { status: 401 }))
      const token = 'drv-' + uuidv4() + '-' + uuidv4()
      await db.collection('driver_sessions').insertOne({ token, driverId: driver.id, createdAt: new Date() })
      return handleCORS(NextResponse.json({ token, driver: clean(driver) }))
    }
    if (route === '/driver/logout' && method === 'POST') {
      const auth = request.headers.get('authorization') || ''
      const token = auth.replace(/^Bearer\s+/i, '').trim()
      if (token) await db.collection('driver_sessions').deleteOne({ token })
      return handleCORS(NextResponse.json({ ok: true }))
    }

    // ---- Driver protected ----
    if (route.startsWith('/driver/')) {
      const auth = request.headers.get('authorization') || ''
      const token = auth.replace(/^Bearer\s+/i, '').trim()
      const session = token ? await db.collection('driver_sessions').findOne({ token }) : null
      if (!session) return handleCORS(NextResponse.json({ error: 'Unauthorized' }, { status: 401 }))
      const driver = await db.collection('drivers').findOne({ id: session.driverId })
      if (!driver) return handleCORS(NextResponse.json({ error: 'Driver removed' }, { status: 401 }))

      if (route === '/driver/me' && method === 'GET') {
        return handleCORS(NextResponse.json({ driver: clean(driver) }))
      }
      if (route === '/driver/bookings' && method === 'GET') {
        const list = await db.collection('bookings').find({ driverId: driver.id }).sort({ travelDate: 1 }).toArray()
        // attach tour meetingPoint
        const tourIds = [...new Set(list.map(b => b.tourId).filter(Boolean))]
        const tours = await db.collection('tours').find({ id: { $in: tourIds } }).toArray()
        const tourMap = Object.fromEntries(tours.map(t => [t.id, t]))
        const enriched = list.map(b => ({ ...clean(b), meetingPoint: tourMap[b.tourId]?.meetingPoint, location: tourMap[b.tourId]?.location }))
        return handleCORS(NextResponse.json(enriched))
      }
      const db_ = route.match(/^\/driver\/bookings\/([\w-]+)$/)
      if (db_ && method === 'PATCH') {
        const b = await request.json()
        const allowed = ['tripStatus']
        const upd = {}
        allowed.forEach(k => { if (b[k] !== undefined) upd[k] = b[k] })
        if (b.tripStatus === 'Completed') upd.status = 'Completed'
        await db.collection('bookings').updateOne({ id: db_[1], driverId: driver.id }, { $set: upd })
        const t = await db.collection('bookings').findOne({ id: db_[1] })
        return handleCORS(NextResponse.json(clean(t)))
      }
      if (route === '/driver/availability' && method === 'PATCH') {
        const { available } = await request.json()
        await db.collection('drivers').updateOne({ id: driver.id }, { $set: { available: !!available } })
        return handleCORS(NextResponse.json({ ok: true }))
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
