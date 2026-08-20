// Server-only WhatsApp Business Cloud API sender.
// Never import this from client components.

const API_VERSION = process.env.WHATSAPP_GRAPH_API_VERSION || 'v22.0'

export function whatsappConfigured() {
  return !!(process.env.WHATSAPP_ACCESS_TOKEN && process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.ADMIN_WHATSAPP_NUMBER)
}

export async function sendWhatsAppText(to, body) {
  if (!process.env.WHATSAPP_ACCESS_TOKEN || !process.env.WHATSAPP_PHONE_NUMBER_ID) {
    return { sent: false, reason: 'credentials_missing' }
  }
  if (!to) return { sent: false, reason: 'missing_recipient' }
  const text = String(body || '').trim().slice(0, 4096)
  if (!text) return { sent: false, reason: 'empty' }

  const url = `https://graph.facebook.com/${API_VERSION}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.WHATSAPP_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        recipient_type: 'individual',
        to,
        type: 'text',
        text: { preview_url: false, body: text },
      }),
      cache: 'no-store',
    })
    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('WA send failed', res.status, data?.error?.message)
      return { sent: false, reason: 'api_error', status: res.status, error: data?.error?.message }
    }
    return { sent: true, messageId: data.messages?.[0]?.id }
  } catch (err) {
    console.error('WA send exception', err?.message)
    return { sent: false, reason: 'exception', error: err?.message }
  }
}

export async function notifyAdmin(text) {
  return sendWhatsAppText(process.env.ADMIN_WHATSAPP_NUMBER, text)
}

export function formatBookingAlert(b, tour) {
  return [
    `🌿 *NEW BOOKING — Tripnz*`,
    ``,
    `📌 Ref: ${b.bookingRef}`,
    `👤 ${b.fullName}`,
    `📞 ${b.phone}${b.whatsapp && b.whatsapp !== b.phone ? ` (WA: ${b.whatsapp})` : ''}`,
    `✉️  ${b.email}`,
    ``,
    `🗺️  ${tour?.title || b.tourTitle}`,
    `📅 ${b.travelDate}`,
    `👥 ${b.adults} adults${b.children > 0 ? ` + ${b.children} kids` : ''}`,
    b.pickupLocation ? `📍 Pickup: ${b.pickupLocation}` : '',
    b.specialRequirements ? `📝 Notes: ${b.specialRequirements}` : '',
    ``,
    `Open admin: ${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/bookings`,
  ].filter(Boolean).join('\n')
}

export function formatCustomAlert(c) {
  return [
    `✨ *NEW CUSTOM TOUR — Tripnz*`,
    ``,
    `📌 Ref: ${c.requestRef}`,
    `👤 ${c.name}`,
    `📞 ${c.phone}${c.whatsapp && c.whatsapp !== c.phone ? ` (WA: ${c.whatsapp})` : ''}`,
    `✉️  ${c.email}`,
    ``,
    `🗺️  Destinations: ${c.destinations || '—'}`,
    `📅 ${c.arrivalDate || '?'} → ${c.departureDate || '?'}`,
    `👥 ${c.adults} adults${c.children > 0 ? ` + ${c.children} kids` : ''}`,
    c.budget ? `💰 Budget: ${c.budget}` : '',
    c.preferredVehicle ? `🚙 Vehicle: ${c.preferredVehicle}` : '',
    c.travelStyle ? `🎨 Style: ${c.travelStyle}` : '',
    c.additionalRequirements ? `📝 Notes: ${c.additionalRequirements}` : '',
    ``,
    `Open admin: ${process.env.NEXT_PUBLIC_BASE_URL || ''}/admin/custom-tours`,
  ].filter(Boolean).join('\n')
}

export function formatContactAlert(c) {
  return [
    `💬 *NEW CONTACT MESSAGE — Tripnz*`,
    ``,
    `👤 ${c.name}`,
    `📞 ${c.phone || '—'}`,
    `✉️  ${c.email}`,
    c.subject ? `Subject: ${c.subject}` : '',
    ``,
    c.message,
  ].filter(Boolean).join('\n')
}

export function formatCustomerBookingConfirm(b, tour) {
  return [
    `Kia ora ${b.fullName.split(' ')[0]}! 🌿`,
    ``,
    `Thanks for booking with Tripnz. Here are your details:`,
    ``,
    `🗺️  ${tour?.title || b.tourTitle}`,
    `📌 Ref: ${b.bookingRef}`,
    `📅 ${b.travelDate}`,
    `👥 ${b.adults} adults${b.children > 0 ? ` + ${b.children} kids` : ''}`,
    b.pickupLocation ? `📍 Pickup: ${b.pickupLocation}` : '',
    ``,
    `Our team will confirm within 24 hours. Reply to this message anytime!`,
  ].filter(Boolean).join('\n')
}
