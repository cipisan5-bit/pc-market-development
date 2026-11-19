'use client'

import { useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { toast } from 'sonner'
import { Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuantityStepper } from './quantity-stepper'
import { removeCartItem, updateCartQuantity } from '@/app/actions/cart'
import { formatRupiah } from '@/lib/format'
import type { CartItem } from '@/lib/types'

export function CartItemRow({ item }: { item: CartItem }) {
  const [pending, startTransition] = useTransition()
  const p = item.products
  const unavailable = !p || !p.is_active || p.stock <= 0
  const overStock = !!p && item.quantity > p.stock

  function setQty(q: number) {
    startTransition(async () => {
      const res = await updateCartQuantity(item.id, q)
      if (!res.ok) toast.error(res.error)
    })
  }

  function remove() {
    startTransition(async () => {
      const res = await removeCartItem(item.id)
      if (res.ok) toast.success('Produk dihapus dari keranjang')
      else toast.error(res.error)
    })
  }

  return (
    <div className="flex gap-4 p-4" aria-busy={pending}>
      <div className="relative size-20 shrink-0 overflow-hidden rounded-lg bg-muted sm:size-24">
        {p?.image_url && <Image src={p.image_url} alt={p.name} fill sizes="96px" className="object-contain p-2" />}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            {p ? (
              <Link href={`/products/${p.id}`} className="line-clamp-2 text-sm font-medium hover:underline">
                {p.name}
              </Link>
            ) : (
              <span className="text-sm text-muted-foreground">Produk telah dihapus</span>
            )}
            {p && <p className="text-sm text-muted-foreground tabular-nums">{formatRupiah(p.price)}</p>}
          </div>
          <Button variant="ghost" size="icon" aria-label="Hapus dari keranjang" disabled={pending} onClick={remove}>
            <Trash2 />
          </Button>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-2">
          {p && !unavailable ? (
            <QuantityStepper value={item.quantity} min={1} max={Math.min(99, Math.max(p.stock, 1))} onChange={setQty} disabled={pending} />
          ) : (
            <span className="text-xs text-destructive">Tidak tersedia</span>
          )}
          {p && <span className="font-semibold tabular-nums">{formatRupiah(p.price * item.quantity)}</span>}
        </div>
        {overStock && !unavailable && <p className="text-xs text-destructive">Stok tersisa {p.stock}. Kurangi jumlah.</p>}
      </div>
    </div>
  )
}
