'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/types'

export type ProductInput = {
  name: string
  brand: string
  description: string
  categoryId: string
  price: number
  stock: number
  imageUrl: string
  isActive: boolean
}

async function getAdminClient() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { supabase, isAdmin: false }
  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle()
  return { supabase, isAdmin: profile?.role === 'admin' }
}

function validate(input: ProductInput): string | null {
  const name = input.name?.trim() ?? ''
  if (name.length < 2 || name.length > 200) return 'Nama produk 2-200 karakter'
  if (!input.categoryId) return 'Kategori wajib dipilih'
  if (!Number.isInteger(input.price) || input.price < 0 || input.price > 1_000_000_000) return 'Harga tidak valid'
  if (!Number.isInteger(input.stock) || input.stock < 0 || input.stock > 100_000) return 'Stok tidak valid'
  if ((input.description?.length ?? 0) > 5000) return 'Deskripsi terlalu panjang'
  const img = input.imageUrl?.trim()
  if (img && !img.startsWith('/') && !img.startsWith('https://')) return 'URL gambar tidak valid'
  return null
}

function toRow(input: ProductInput) {
  return {
    name: input.name.trim(),
    brand: input.brand?.trim() || null,
    description: input.description?.trim() || null,
    category_id: input.categoryId,
    price: input.price,
    stock: input.stock,
    image_url: input.imageUrl?.trim() || null,
    is_active: input.isActive,
  }
}

function revalidateCatalog() {
  revalidatePath('/', 'layout')
}

export async function createProduct(input: ProductInput): Promise<ActionResult<{ id: string }>> {
  const invalid = validate(input)
  if (invalid) return { ok: false, error: invalid }
  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) return { ok: false, error: 'Akses ditolak' }

  const { data, error } = await supabase.from('products').insert(toRow(input)).select('id').single()
  if (error) return { ok: false, error: 'Gagal menambahkan produk' }
  revalidateCatalog()
  return { ok: true, data: { id: data.id }, message: 'Produk berhasil ditambahkan' }
}

export async function updateProduct(id: string, input: ProductInput): Promise<ActionResult> {
  const invalid = validate(input)
  if (invalid) return { ok: false, error: invalid }
  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) return { ok: false, error: 'Akses ditolak' }

  const { error } = await supabase
    .from('products')
    .update({ ...toRow(input), updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) return { ok: false, error: 'Gagal memperbarui produk' }
  revalidateCatalog()
  return { ok: true, message: 'Produk berhasil diperbarui' }
}

export async function deleteProduct(id: string): Promise<ActionResult> {
  const { supabase, isAdmin } = await getAdminClient()
  if (!isAdmin) return { ok: false, error: 'Akses ditolak' }
  const { error } = await supabase.from('products').delete().eq('id', id)
  if (error) return { ok: false, error: 'Gagal menghapus produk' }
  revalidateCatalog()
  return { ok: true, message: 'Produk berhasil dihapus' }
}
