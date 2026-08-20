import type { Order } from '@/types'

/**
 * Store configuration — the WhatsApp number that receives orders.
 * Swap in your own business number (country code + number, digits only).
 */
export const STORE = {
  name: 'Crumb & Craft',
  whatsappNumber: '15550123456',
  displayPhone: '+1 (555) 012-3456',
  hours: 'Tue–Sun · 7:00–19:00',
  address: '48 Fournier Lane, Old Mill District',
}

export const money = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD' })

export function generateOrderId(): string {
  const t = Date.now().toString(36).toUpperCase().slice(-4)
  const r = Math.floor(Math.random() * 90 + 10)
  return `CC-${t}${r}`
}

/**
 * Endpoint for pre-filled chats. We use api.whatsapp.com rather than wa.me:
 * wa.me's redirect server re-encodes the text parameter and corrupts
 * non-BMP characters, while api.whatsapp.com forwards the message intact.
 */
const WA_BASE = 'https://api.whatsapp.com/send'

function waLink(text: string): string {
  return `${WA_BASE}?phone=${STORE.whatsappNumber}&text=${encodeURIComponent(text)}`
}

/**
 * Builds the structured order message sent to the store's WhatsApp.
 * WhatsApp renders *bold* — the layout is deliberately rigid so the
 * kitchen never has to guess quantities or totals. Emoji-free by design:
 * every character survives every WhatsApp entry path (app, web, fallback).
 */
export function buildOrderMessage(order: Order): string {
  const line = '──────────────────'
  const items = order.items
    .map(
      ({ product, qty }) =>
        `• ${qty} × ${product.name} — ${money(product.price * qty)}`,
    )
    .join('\n')

  const fulfillment =
    order.customer.fulfillment === 'delivery'
      ? `Delivery — ${order.customer.address}`
      : `Pickup — ${STORE.address}`

  const parts = [
    `*NEW ORDER — ${STORE.name.toUpperCase()}*`,
    `Order *#${order.id}*`,
    line,
    items,
    line,
    `Subtotal: ${money(order.subtotal)}`,
    `Delivery: ${order.deliveryFee === 0 ? 'FREE' : money(order.deliveryFee)}`,
    `*TOTAL: ${money(order.total)}*`,
    line,
    `Name: ${order.customer.name}`,
    `Phone: ${order.customer.phone}`,
    fulfillment,
    `Payment: ${order.paymentLabel}`,
  ]

  if (order.customer.note.trim()) {
    parts.push(`Note: ${order.customer.note.trim()}`)
  }

  parts.push(line, `Sent from the ${STORE.name} web store`)
  return parts.join('\n')
}

export function orderLink(order: Order): string {
  return waLink(buildOrderMessage(order))
}

export function chatLink(text: string): string {
  return waLink(text)
}
