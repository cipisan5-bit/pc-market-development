import Link from 'next/link'
import { ChevronRight } from 'lucide-react'
import { StatusBadge } from './status-badge'
import { formatDate, formatRupiah, shortId } from '@/lib/format'
import type { Order } from '@/lib/types'

export function OrderList({ orders, hrefBase = '/orders' }: { orders: Order[]; hrefBase?: string }) {
  return (
    <ul className="flex flex-col divide-y rounded-xl border">
      {orders.map((o) => (
        <li key={o.id}>
          <Link href={`${hrefBase}/${o.id}`} className="flex items-center gap-4 p-4 transition-colors hover:bg-muted/50">
            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-mono text-sm font-medium">{shortId(o.id)}</span>
                <StatusBadge status={o.status} />
              </div>
              <span className="text-xs text-muted-foreground">
                {formatDate(o.created_at)}
                {o.order_items ? ` · ${o.order_items.reduce((s, i) => s + i.quantity, 0)} item` : ''}
              </span>
            </div>
            <span className="font-semibold tabular-nums">{formatRupiah(o.total)}</span>
            <ChevronRight aria-hidden className="size-4 text-muted-foreground" />
          </Link>
        </li>
      ))}
    </ul>
  )
}
