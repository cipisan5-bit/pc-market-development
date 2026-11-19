import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { ORDER_STATUSES, STATUS_LABEL } from '@/lib/format'
import { OrderList } from '@/components/store/order-list'
import type { Order, OrderStatus } from '@/lib/types'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Admin - Pesanan' }

export default async function AdminOrdersPage({ searchParams }: { searchParams: Promise<{ status?: string }> }) {
  const { status } = await searchParams
  const active = ORDER_STATUSES.includes(status as OrderStatus) ? (status as OrderStatus) : undefined
  const supabase = await createClient()
  let query = supabase
    .from('orders')
    .select('id, user_id, status, total, shipping_name, phone, address, notes, payment_method, created_at, order_items(id, quantity)')
    .order('created_at', { ascending: false })
  if (active) query = query.eq('status', active)
  const { data } = await query
  const orders = (data ?? []) as unknown as Order[]

  const tabs: { key?: OrderStatus; label: string }[] = [{ label: 'Semua' }, ...ORDER_STATUSES.map((s) => ({ key: s, label: STATUS_LABEL[s] }))]

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Pesanan</h1>
      <nav aria-label="Filter status" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <ul className="flex w-max gap-2">
          {tabs.map((t) => {
            const isActive = t.key === active
            return (
              <li key={t.label}>
                <Link
                  href={t.key ? `/admin/orders?status=${t.key}` : '/admin/orders'}
                  aria-current={isActive ? 'page' : undefined}
                  className={cn(
                    'inline-flex rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors',
                    isActive ? 'border-foreground bg-foreground text-background' : 'hover:bg-muted',
                  )}
                >
                  {t.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
      {orders.length ? (
        <OrderList orders={orders} hrefBase="/admin/orders" />
      ) : (
        <p className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">Tidak ada pesanan.</p>
      )}
    </div>
  )
}
