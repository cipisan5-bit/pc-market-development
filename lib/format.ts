import type { OrderStatus, PaymentMethod } from './types'

const rupiah = new Intl.NumberFormat('id-ID', {
  style: 'currency',
  currency: 'IDR',
  maximumFractionDigits: 0,
})

export function formatRupiah(value: number) {
  return rupiah.format(value)
}

const dateFmt = new Intl.DateTimeFormat('id-ID', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  timeZone: 'Asia/Jakarta',
})

export function formatDate(value: string) {
  return dateFmt.format(new Date(value))
}

export function shortId(id: string) {
  return `#${id.slice(0, 8).toUpperCase()}`
}

export const ORDER_STATUSES: OrderStatus[] = ['pending', 'processing', 'shipped', 'completed', 'cancelled']

export const STATUS_LABEL: Record<OrderStatus, string> = {
  pending: 'Menunggu',
  processing: 'Diproses',
  shipped: 'Dikirim',
  completed: 'Selesai',
  cancelled: 'Dibatalkan',
}

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  transfer: 'Transfer Bank',
  cod: 'Bayar di Tempat (COD)',
  ewallet: 'E-Wallet',
}
