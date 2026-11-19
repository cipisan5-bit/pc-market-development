import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { requireUser } from '@/lib/auth'
import { UUID_RE } from '@/lib/queries'
import { OrderDetail } from '@/components/store/order-detail'
import { CancelOrderButton } from '@/components/store/cancel-order-button'
import type { Order } from '@/lib/types'

export const metadata: Metadata = { title: 'Detail Pesanan' }

export default async function OrderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const { supabase, user } = await requireUser(`/orders/${id}`)
  if (!UUID_RE.test(id)) notFound()

  const { data } = await supabase
    .from('orders')
    .select('id, user_id, status, total, shipping_name, phone, address, notes, payment_method, created_at, order_items(id, product_id, product_name, price, quantity)')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()
  if (!data) notFound()
  const order = data as unknown as Order

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-10">
      <Link href="/orders" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" />
        Riwayat pesanan
      </Link>
      <OrderDetail order={order} actions={order.status === 'pending' ? <CancelOrderButton orderId={order.id} /> : null} />
    </div>
  )
}
