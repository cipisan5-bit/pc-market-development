import type { SupabaseClient } from '@supabase/supabase-js'
import type { CartItem } from '@/lib/types'

export async function getCartItems(supabase: SupabaseClient, userId: string) {
  const { data } = await supabase
    .from('cart_items')
    .select('id, quantity, products(id, name, brand, price, stock, image_url, is_active)')
    .eq('user_id', userId)
    .order('created_at')
  return (data ?? []) as unknown as CartItem[]
}

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + (i.products?.price ?? 0) * i.quantity, 0)
}

export function cartProblems(items: CartItem[]) {
  return items.some((i) => !i.products || !i.products.is_active || i.quantity > i.products.stock)
}
