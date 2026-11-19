import type { Metadata } from 'next'
import Link from 'next/link'
import { ShoppingCart } from 'lucide-react'
import { requireUser } from '@/lib/auth'
import { cartProblems, cartTotal, getCartItems } from '@/lib/cart'
import { formatRupiah } from '@/lib/format'
import { buttonVariants } from '@/components/ui/button'
import { CartItemRow } from '@/components/store/cart-item-row'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Keranjang' }

export default async function CartPage() {
  const { supabase, user } = await requireUser('/cart')
  const items = await getCartItems(supabase, user.id)
  const total = cartTotal(items)
  const blocked = cartProblems(items)
  const count = items.reduce((s, i) => s + i.quantity, 0)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">Keranjang Belanja</h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-xl border border-dashed p-12 text-center">
          <ShoppingCart aria-hidden className="size-10 text-muted-foreground" />
          <p className="font-medium">Keranjang Anda masih kosong</p>
          <Link href="/products" className={buttonVariants()}>
            Mulai belanja
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-[1fr_340px]">
          <ul className="flex flex-col divide-y rounded-xl border">
            {items.map((item) => (
              <li key={item.id}>
                <CartItemRow item={item} />
              </li>
            ))}
          </ul>
          <aside className="flex h-fit flex-col gap-4 rounded-xl border p-5 lg:sticky lg:top-20">
            <h2 className="font-semibold">Ringkasan</h2>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Total item</span>
              <span>{count}</span>
            </div>
            <div className="flex justify-between border-t pt-4">
              <span className="font-medium">Subtotal</span>
              <span className="font-semibold tabular-nums">{formatRupiah(total)}</span>
            </div>
            {blocked && (
              <p role="alert" className="text-sm text-destructive">
                Beberapa produk tidak tersedia atau melebihi stok. Sesuaikan keranjang sebelum checkout.
              </p>
            )}
            <Link
              href="/checkout"
              aria-disabled={blocked}
              className={cn(buttonVariants({ size: 'lg' }), 'w-full', blocked && 'pointer-events-none opacity-50')}
            >
              Lanjut ke Checkout
            </Link>
          </aside>
        </div>
      )}
    </div>
  )
}
