export type Role = 'user' | 'admin'

export type Profile = {
  id: string
  full_name: string | null
  phone: string | null
  address: string | null
  role: Role
}

export type Category = {
  id: string
  name: string
  slug: string
  sort_order: number
}

export type Product = {
  id: string
  category_id: string
  name: string
  brand: string | null
  description: string | null
  price: number
  stock: number
  image_url: string | null
  is_active: boolean
  created_at: string
  categories: { name: string; slug: string } | null
}

export type OrderStatus = 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
export type PaymentMethod = 'transfer' | 'cod' | 'ewallet'

export type OrderItem = {
  id: string
  product_id: string | null
  product_name: string
  price: number
  quantity: number
}

export type Order = {
  id: string
  user_id: string
  status: OrderStatus
  total: number
  shipping_name: string
  phone: string
  address: string
  notes: string | null
  payment_method: PaymentMethod
  created_at: string
  order_items?: OrderItem[]
}

export type CartItem = {
  id: string
  quantity: number
  products: Pick<Product, 'id' | 'name' | 'brand' | 'price' | 'stock' | 'image_url' | 'is_active'> | null
}

export type ActionResult<T = undefined> = { ok: true; data?: T; message?: string } | { ok: false; error: string }
