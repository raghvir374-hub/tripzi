'use client'
import { jsPDF } from 'jspdf'

export function downloadBookingVoucher(booking, tour, settings) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' })
  const W = 210, H = 297

  // Colors
  const primary = [11, 66, 55]     // deep emerald
  const accent  = [232, 143, 42]   // amber
  const muted   = [110, 110, 110]
  const dark    = [30, 30, 30]

  // ==== Header band ====
  doc.setFillColor(...primary)
  doc.rect(0, 0, W, 55, 'F')

  // Compass icon (simple circle)
  doc.setDrawColor(...accent)
  doc.setLineWidth(1.2)
  doc.circle(20, 22, 7)
  doc.setFillColor(...accent)
  doc.circle(20, 22, 2, 'F')

  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(22)
  doc.text('Tripzi', 32, 22)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(220, 235, 225)
  doc.text('Premium New Zealand Private Tours', 32, 28)

  // Right side - booking ref
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(220, 235, 225)
  doc.text('BOOKING REFERENCE', W - 20, 18, { align: 'right' })
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(20)
  doc.setTextColor(255, 255, 255)
  doc.text(booking.bookingRef || '—', W - 20, 28, { align: 'right' })

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(8)
  doc.setTextColor(220, 235, 225)
  doc.text(`Issued: ${new Date().toLocaleDateString('en-NZ', { day: 'numeric', month: 'short', year: 'numeric' })}`, W - 20, 34, { align: 'right' })

  // Accent line below header
  doc.setFillColor(...accent)
  doc.rect(0, 55, W, 2, 'F')

  // ==== Title ====
  doc.setTextColor(...dark)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(24)
  doc.text('Booking Confirmation', 20, 78)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.setTextColor(...muted)
  const introText = doc.splitTextToSize(`Kia ora ${booking.fullName || 'traveller'}! Your booking has been received. Please present this voucher on the day of your tour.`, W - 40)
  doc.text(introText, 20, 87)

  // ==== Tour card ====
  let y = 105
  doc.setDrawColor(220, 220, 220)
  doc.setFillColor(248, 246, 240)
  doc.roundedRect(20, y, W - 40, 42, 3, 3, 'FD')
  doc.setTextColor(...primary)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('YOUR TOUR', 26, y + 8)
  doc.setTextColor(...dark)
  doc.setFontSize(15)
  const tourTitle = doc.splitTextToSize(tour?.title || booking.tourTitle || 'Custom Journey', W - 55)
  doc.text(tourTitle, 26, y + 16)

  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(...muted)
  const loc = tour?.location ? `Location: ${tour.location}` : ''
  const dur = tour?.duration ? `Duration: ${tour.duration}` : ''
  const meet = tour?.meetingPoint ? `Meeting Point: ${tour.meetingPoint}` : ''
  const infoY = y + 24 + (tourTitle.length - 1) * 5
  if (loc) doc.text(loc, 26, infoY)
  if (dur) doc.text(dur, 26, infoY + 5)
  if (meet) doc.text(meet, 26, infoY + 10)

  // ==== Details grid ====
  y = 158
  doc.setTextColor(...primary)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(11)
  doc.text('TRAVELLER DETAILS', 20, y)
  doc.setDrawColor(...accent)
  doc.setLineWidth(0.5)
  doc.line(20, y + 2, 70, y + 2)

  y += 10
  const rows = [
    ['Full Name', booking.fullName],
    ['Email', booking.email],
    ['Phone', booking.phone],
    ['WhatsApp', booking.whatsapp || booking.phone],
    ['Travel Date', booking.travelDate],
    ['Adults', String(booking.adults || 1)],
    ['Children', String(booking.children || 0)],
    ['Pickup Location', booking.pickupLocation || '—'],
  ]
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  rows.forEach((r, i) => {
    const col = i % 2
    const row = Math.floor(i / 2)
    const x = 20 + col * 90
    const yy = y + row * 14
    doc.setTextColor(...muted)
    doc.setFontSize(8)
    doc.text(r[0].toUpperCase(), x, yy)
    doc.setTextColor(...dark)
    doc.setFontSize(10)
    doc.text(String(r[1] || '—'), x, yy + 5)
  })

  y = y + Math.ceil(rows.length / 2) * 14 + 4

  if (booking.specialRequirements) {
    doc.setTextColor(...primary)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(11)
    doc.text('SPECIAL REQUIREMENTS', 20, y)
    doc.line(20, y + 2, 80, y + 2)
    y += 8
    doc.setTextColor(...dark)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(10)
    const sr = doc.splitTextToSize(booking.specialRequirements, W - 40)
    doc.text(sr, 20, y)
    y += sr.length * 5 + 4
  }

  // ==== What's included box ====
  if (tour?.included?.length) {
    y = Math.max(y, 230)
    doc.setDrawColor(...accent)
    doc.setFillColor(255, 249, 240)
    doc.roundedRect(20, y, W - 40, 30, 3, 3, 'FD')
    doc.setTextColor(...primary)
    doc.setFont('helvetica', 'bold')
    doc.setFontSize(10)
    doc.text('WHAT\u2019S INCLUDED', 26, y + 8)
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(9)
    doc.setTextColor(...dark)
    const inc = (tour.included || []).slice(0, 5).map(i => '• ' + i).join('    ')
    const lines = doc.splitTextToSize(inc, W - 55)
    doc.text(lines, 26, y + 14)
  }

  // ==== Footer ====
  doc.setFillColor(...primary)
  doc.rect(0, H - 22, W, 22, 'F')
  doc.setTextColor(255, 255, 255)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('Need to change something?', 20, H - 13)
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(9)
  doc.setTextColor(220, 235, 225)
  doc.text(`Email ${settings?.contactEmail || 'hello@tripzi.co.nz'}  •  Phone/WhatsApp ${settings?.contactPhone || '021 144 9859'}`, 20, H - 7)
  doc.setTextColor(...accent)
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(9)
  doc.text('www.tripzi.co.nz', W - 20, H - 10, { align: 'right' })

  doc.save(`Tripzi-Voucher-${booking.bookingRef}.pdf`)
}
