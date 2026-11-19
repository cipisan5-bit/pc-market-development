'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import { ORDER_STATUSES } from '@/lib/format'
import type { ActionResult, OrderStatus, PaymentMethod } from '@/lib/types'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
const PAYMENT_METHODS: PaymentMethod[] = ['transfer', 'cod', 'ewallet']

type CheckoutInput = {
  shippingName: string
  phone: string
  address: string
  notes: string
  paymentMethod: PaymentMethod
  idempotencyKey: string
}

function dbMessage(message: string | undefined, fallback: string) {
  // Messages raised by our own RPCs are safe, user-facing Indonesian text.
  if (!message) return fallback
  if (/stok|keranjang|tidak tersedia|wajib|tidak valid|tidak diizinkan|sudah dibatalkan|tidak ditemukan/i.test(message)) {
    return message
  }
  return fallback
}

export async function placeOrder(input: CheckoutInput): Promise<ActionResult<{ orderId: string }>> {
  const shippingName = input.shippingName?.trim() ?? ''
  const phone = input.phone?.trim() ?? ''
  const address = input.address?.trim() ?? ''
  const notes = input.notes?.trim() ?? ''

  if (shippingName.length < 2 || shippingName.length > 100) return { ok: false, error: 'Nama penerima tidak valid' }
  if (!/^[0-9+\-\s]{8,20}$/.test(phone)) return { ok: false, error: 'Nomor telepon tidak valid' }
  if (address.length < 10 || address.length > 500) return { ok: false, error: 'Alamat minimal 10 karakter' }
  if (notes.length > 300) return { ok: false, error: 'Catatan maksimal 300 karakter' }
  if (!PAYMENT_METHODS.includes(input.paymentMethod)) return { ok: false, error: 'Metode pembayaran tidak valid' }
  if (!UUID_RE.test(input.idempotencyKey)) return { ok: false, error: 'Permintaan tidak valid' }

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('place_order', {
    p_shipping_name: shippingName,
    p_phone: phone,
    p_address: address,
    p_notes: notes,
    p_payment_method: input.paymentMethod,
    p_idempotency_key: input.idempotencyKey,
  })

  if (error || !data) return { ok: false, error: dbMessage(error?.message, 'Gagal membuat pesanan') }
  revalidatePath('/', 'layout')
  return { ok: true, data: { orderId: data as string }, message: 'Pesanan berhasil dibuat' }
}

export async function updateOrderStatus(orderId: string, status: OrderStatus): Promise<ActionResult> {
  if (!UUID_RE.test(orderId) || !ORDER_STATUSES.includes(status)) {
    return { ok: false, error: 'Permintaan tidak valid' }
  }
  const supabase = await createClient()
  const { error } = await supabase.rpc('update_order_status', { p_order_id: orderId, p_status: status })
  if (error) return { ok: false, error: dbMessage(error.message, 'Gagal memperbarui status pesanan') }
  revalidatePath('/', 'layout')
  return { ok: true, message: status === 'cancelled' ? 'Pesanan dibatalkan' : 'Status pesanan diperbarui' }
}
