import { StatusBadge } from './status-badge'
import { PAYMENT_LABEL, formatDate, formatRupiah, shortId } from '@/lib/format'
import type { Order } from '@/lib/types'

export function OrderDetail({ order, actions }: { order: Order; actions?: React.ReactNode }) {
  const items = order.order_items ?? []
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <h1 className="font-mono text-2xl font-semibold tracking-tight">{shortId(order.id)}</h1>
            <StatusBadge status={order.status} />
          </div>
          <p className="text-sm text-muted-foreground">Dibuat {formatDate(order.created_at)}</p>
        </div>
        {actions}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <section className="flex flex-col gap-2 rounded-xl border p-5 text-sm">
          <h2 className="font-semibold">Pengiriman</h2>
          <p className="font-medium">{order.shipping_name}</p>
          <p className="text-muted-foreground">{order.phone}</p>
          <p className="whitespace-pre-line text-muted-foreground">{order.address}</p>
          {order.notes && <p className="border-t pt-2 text-muted-foreground">Catatan: {order.notes}</p>}
        </section>
        <section className="flex flex-col gap-2 rounded-xl border p-5 text-sm">
          <h2 className="font-semibold">Pembayaran</h2>
          <p className="text-muted-foreground">{PAYMENT_LABEL[order.payment_method]}</p>
          <p className="mt-auto flex justify-between border-t pt-2">
            <span>Total</span>
            <span className="text-base font-semibold tabular-nums">{formatRupiah(order.total)}</span>
          </p>
        </section>
      </div>

      <section className="rounded-xl border">
        <h2 className="border-b p-4 text-sm font-semibold">Produk</h2>
        <ul className="divide-y">
          {items.map((i) => (
            <li key={i.id} className="flex items-center justify-between gap-4 p-4 text-sm">
              <div className="min-w-0">
                <p className="font-medium">{i.product_name}</p>
                <p className="text-muted-foreground tabular-nums">
                  {i.quantity} x {formatRupiah(i.price)}
                </p>
              </div>
              <span className="font-medium tabular-nums">{formatRupiah(i.price * i.quantity)}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  )
}
