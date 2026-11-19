import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { UUID_RE } from '@/lib/queries'
import { OrderDetail } from '@/components/store/order-detail'
import { OrderStatusControl } from '@/components/admin/order-status-control'
import type { Order } from '@/lib/types'

export const metadata: Metadata = { title: 'Admin - Detail Pesanan' }

export default async function AdminOrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  if (!UUID_RE.test(id)) notFound()
  const supabase = await createClient()
  const { data } = await supabase
    .from('orders')
    .select('id, user_id, status, total, shipping_name, phone, address, notes, payment_method, created_at, order_items(id, product_id, product_name, price, quantity)')
    .eq('id', id)
    .maybeSingle()
  if (!data) notFound()
  const order = data as unknown as Order

  return (
    <div className="flex flex-col gap-2">
      <Link href="/admin/orders" className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" />
        Semua pesanan
      </Link>
      <OrderDetail order={order} actions={<OrderStatusControl orderId={order.id} status={order.status} />} />
    </div>
  )
}
