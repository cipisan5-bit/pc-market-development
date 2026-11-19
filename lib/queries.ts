import { createClient } from '@/lib/supabase/server'
import type { Category, Product } from '@/lib/types'

export const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export const PRODUCT_COLUMNS =
  'id, category_id, name, brand, description, price, stock, image_url, is_active, created_at, categories(name, slug)'

export async function getCategories() {
  const supabase = await createClient()
  const { data } = await supabase.from('categories').select('id, name, slug, sort_order').order('sort_order')
  return (data ?? []) as Category[]
}

export type ProductFilters = {
  q?: string
  category?: string
  sort?: string
  min?: string
  max?: string
  inStock?: string
}

export async function getProducts(filters: ProductFilters, limit = 60) {
  const supabase = await createClient()
  let query = supabase.from('products').select(PRODUCT_COLUMNS).eq('is_active', true)

  const q = filters.q?.replace(/[%,()*\\]/g, ' ').trim().slice(0, 80)
  if (q) query = query.or(`name.ilike.%${q}%,brand.ilike.%${q}%,description.ilike.%${q}%`)

  if (filters.category) {
    const { data: cat } = await supabase.from('categories').select('id').eq('slug', filters.category).maybeSingle()
    if (!cat) return []
    query = query.eq('category_id', cat.id)
  }

  const min = Number(filters.min)
  const max = Number(filters.max)
  if (filters.min && Number.isFinite(min) && min >= 0) query = query.gte('price', Math.floor(min))
  if (filters.max && Number.isFinite(max) && max > 0) query = query.lte('price', Math.floor(max))
  if (filters.inStock === '1') query = query.gt('stock', 0)

  switch (filters.sort) {
    case 'price-asc':
      query = query.order('price', { ascending: true })
      break
    case 'price-desc':
      query = query.order('price', { ascending: false })
      break
    case 'name':
      query = query.order('name', { ascending: true })
      break
    default:
      query = query.order('created_at', { ascending: false })
  }

  const { data } = await query.limit(limit)
  return (data ?? []) as unknown as Product[]
}

export async function getProduct(id: string) {
  if (!UUID_RE.test(id)) return null
  const supabase = await createClient()
  const { data } = await supabase.from('products').select(PRODUCT_COLUMNS).eq('id', id).maybeSingle()
  return data as unknown as Product | null
}
