'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/types'

const MAX_QTY = 99

function isValidQty(qty: unknown): qty is number {
  return typeof qty === 'number' && Number.isInteger(qty) && qty >= 1 && qty <= MAX_QTY
}

async function getUserClient() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user }
}

export async function addToCart(productId: string, quantity: number): Promise<ActionResult> {
  if (!isValidQty(quantity)) return { ok: false, error: 'Jumlah tidak valid' }
  const { supabase, user } = await getUserClient()
  if (!user) return { ok: false, error: 'Silakan login terlebih dahulu' }

  const { data: product } = await supabase
    .from('products')
    .select('id, stock, is_active')
    .eq('id', productId)
    .maybeSingle()
  if (!product || !product.is_active) return { ok: false, error: 'Produk tidak tersedia' }

  const { data: existing } = await supabase
    .from('cart_items')
    .select('id, quantity')
    .eq('user_id', user.id)
    .eq('product_id', productId)
    .maybeSingle()

  const newQty = (existing?.quantity ?? 0) + quantity
  if (newQty > product.stock) return { ok: false, error: `Stok tidak mencukupi (tersisa ${product.stock})` }
  if (newQty > MAX_QTY) return { ok: false, error: `Maksimal ${MAX_QTY} per produk` }

  const { error } = existing
    ? await supabase.from('cart_items').update({ quantity: newQty }).eq('id', existing.id).eq('user_id', user.id)
    : await supabase.from('cart_items').insert({ product_id: productId, quantity })

  if (error) return { ok: false, error: 'Gagal menambahkan ke keranjang' }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Produk ditambahkan ke keranjang' }
}

export async function updateCartQuantity(itemId: string, quantity: number): Promise<ActionResult> {
  if (!isValidQty(quantity)) return { ok: false, error: 'Jumlah tidak valid' }
  const { supabase, user } = await getUserClient()
  if (!user) return { ok: false, error: 'Silakan login terlebih dahulu' }

  const { data: item } = await supabase
    .from('cart_items')
    .select('id, products(stock)')
    .eq('id', itemId)
    .eq('user_id', user.id)
    .maybeSingle()
  const stock = (item?.products as unknown as { stock: number } | null)?.stock ?? 0
  if (!item) return { ok: false, error: 'Item tidak ditemukan' }
  if (quantity > stock) return { ok: false, error: `Stok tidak mencukupi (tersisa ${stock})` }

  const { error } = await supabase.from('cart_items').update({ quantity }).eq('id', itemId).eq('user_id', user.id)
  if (error) return { ok: false, error: 'Gagal memperbarui jumlah' }
  revalidatePath('/', 'layout')
  return { ok: true }
}

export async function removeCartItem(itemId: string): Promise<ActionResult> {
  const { supabase, user } = await getUserClient()
  if (!user) return { ok: false, error: 'Silakan login terlebih dahulu' }
  const { error } = await supabase.from('cart_items').delete().eq('id', itemId).eq('user_id', user.id)
  if (error) return { ok: false, error: 'Gagal menghapus item' }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Item dihapus dari keranjang' }
}
