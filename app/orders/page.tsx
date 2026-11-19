import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { buttonVariants } from '@/components/ui/button'
import { OrderList } from '@/components/store/order-list'
import type { Order } from '@/lib/types'

export const metadata: Metadata = { title: 'Riwayat Pesanan' }

export default async function OrdersPage() {
  const { supabase, user } = await requireUser('/orders')
  const { data } = await supabase
    .from('orders')
    .select('id, user_id, status, total, shipping_name, phone, address, notes, payment_method, created_at, order_items(id, quantity)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  const orders = (data ?? []) as unknown as Order[]

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 md:px-6 md:py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">Riwayat Pesanan</h1>
      {orders.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
          <p className="font-medium">Belum ada pesanan</p>
          <Link href="/products" className={buttonVariants()}>
            Mulai belanja
          </Link>
        </div>
      ) : (
        <OrderList orders={orders} />
      )}
    </div>
  )
}
