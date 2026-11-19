import type { Metadata } from 'next'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatRupiah, STATUS_LABEL, ORDER_STATUSES } from '@/lib/format'
import { StatCard } from '@/components/store/stat-card'
import { OrderList } from '@/components/store/order-list'
import { SalesChart } from '@/components/admin/sales-chart'
import type { Order } from '@/lib/types'

export const metadata: Metadata = { title: 'Admin - Statistik' }

const DAYS = 14

export default async function AdminHomePage() {
  const supabase = await createClient()
  const since = new Date()
  since.setHours(0, 0, 0, 0)
  since.setDate(since.getDate() - (DAYS - 1))

  const [ordersRes, recentRes, productsRes, lowStockRes, itemsRes, usersRes] = await Promise.all([
    supabase.from('orders').select('id, status, total, created_at'),
    supabase
      .from('orders')
      .select('id, user_id, status, total, shipping_name, phone, address, notes, payment_method, created_at')
      .order('created_at', { ascending: false })
      .limit(5),
    supabase.from('products').select('id', { count: 'exact', head: true }),
    supabase.from('products').select('id, name, stock').lte('stock', 5).order('stock').limit(6),
    supabase.from('order_items').select('product_name, quantity, orders!inner(status)').neq('orders.status', 'cancelled'),
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
  ])

  const orders = (ordersRes.data ?? []) as Pick<Order, 'id' | 'status' | 'total' | 'created_at'>[]
  const valid = orders.filter((o) => o.status !== 'cancelled')
  const revenue = valid.reduce((s, o) => s + o.total, 0)
  const pending = orders.filter((o) => o.status === 'pending').length

  const byDay = new Map<string, number>()
  for (let i = 0; i < DAYS; i++) {
    const d = new Date(since)
    d.setDate(since.getDate() + i)
    byDay.set(d.toISOString().slice(0, 10), 0)
  }
  for (const o of valid) {
    const key = new Date(o.created_at).toISOString().slice(0, 10)
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + o.total)
  }
  const chartData = [...byDay.entries()].map(([date, total]) => ({
    date: new Date(date).toLocaleDateString('id-ID', { day: 'numeric', month: 'short' }),
    total,
  }))

  const statusCounts = ORDER_STATUSES.map((s) => ({ status: s, count: orders.filter((o) => o.status === s).length }))

  const bestMap = new Map<string, number>()
  for (const i of (itemsRes.data ?? []) as { product_name: string; quantity: number }[]) {
    bestMap.set(i.product_name, (bestMap.get(i.product_name) ?? 0) + i.quantity)
  }
  const best = [...bestMap.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Statistik Penjualan</h1>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        <StatCard label="Total pendapatan" value={formatRupiah(revenue)} hint="Tidak termasuk pesanan batal" />
        <StatCard label="Total pesanan" value={String(orders.length)} hint={`${pending} menunggu diproses`} />
        <StatCard label="Produk" value={String(productsRes.count ?? 0)} />
        <StatCard label="Pengguna" value={String(usersRes.count ?? 0)} />
      </div>

      <section aria-labelledby="chart" className="flex flex-col gap-4 rounded-xl border p-5">
        <h2 id="chart" className="font-semibold">
          Pendapatan {DAYS} hari terakhir
        </h2>
        <SalesChart data={chartData} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        <section aria-labelledby="status" className="flex flex-col gap-3 rounded-xl border p-5">
          <h2 id="status" className="font-semibold">
            Status pesanan
          </h2>
          <ul className="flex flex-col gap-2 text-sm">
            {statusCounts.map(({ status, count }) => (
              <li key={status} className="flex items-center justify-between">
                <Link href={`/admin/orders?status=${status}`} className="text-muted-foreground hover:text-foreground hover:underline">
                  {STATUS_LABEL[status]}
                </Link>
                <span className="font-medium tabular-nums">{count}</span>
              </li>
            ))}
          </ul>
        </section>
        <section aria-labelledby="best" className="flex flex-col gap-3 rounded-xl border p-5">
          <h2 id="best" className="font-semibold">
            Produk terlaris
          </h2>
          {best.length ? (
            <ol className="flex flex-col gap-2 text-sm">
              {best.map(([name, qty], i) => (
                <li key={name} className="flex items-center gap-3">
                  <span className="font-mono text-xs text-muted-foreground">{i + 1}</span>
                  <span className="line-clamp-1 flex-1">{name}</span>
                  <span className="font-medium tabular-nums">{qty}</span>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted-foreground">Belum ada penjualan.</p>
          )}
        </section>
        <section aria-labelledby="low" className="flex flex-col gap-3 rounded-xl border p-5">
          <h2 id="low" className="font-semibold">
            Stok menipis
          </h2>
          {lowStockRes.data?.length ? (
            <ul className="flex flex-col gap-2 text-sm">
              {lowStockRes.data.map((p) => (
                <li key={p.id} className="flex items-center justify-between gap-3">
                  <Link href={`/admin/products/${p.id}/edit`} className="line-clamp-1 hover:underline">
                    {p.name}
                  </Link>
                  <span className={p.stock === 0 ? 'font-medium text-destructive' : 'font-medium'}>{p.stock}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">Semua stok aman.</p>
          )}
        </section>
      </div>

      <section aria-labelledby="recent" className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 id="recent" className="font-semibold">
            Pesanan terbaru
          </h2>
          <Link href="/admin/orders" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
            Kelola pesanan
          </Link>
        </div>
        {recentRes.data?.length ? (
          <OrderList orders={recentRes.data as Order[]} hrefBase="/admin/orders" />
        ) : (
          <p className="rounded-xl border border-dashed p-8 text-center text-sm text-muted-foreground">Belum ada pesanan.</p>
        )}
      </section>
    </div>
  )
}
