import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { requireUser } from '@/lib/auth'
import { cartProblems, cartTotal, getCartItems } from '@/lib/cart'
import { formatRupiah } from '@/lib/format'
import { CheckoutForm } from '@/components/store/checkout-form'

export const metadata: Metadata = { title: 'Checkout' }

export default async function CheckoutPage() {
  const { supabase, user, profile } = await requireUser('/checkout')
  const items = await getCartItems(supabase, user.id)
  if (items.length === 0 || cartProblems(items)) redirect('/cart')
  const total = cartTotal(items)

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <h1 className="mb-6 text-2xl font-semibold tracking-tight md:text-3xl">Checkout</h1>
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <CheckoutForm
          defaults={{
            shippingName: profile?.full_name ?? '',
            phone: profile?.phone ?? '',
            address: profile?.address ?? '',
          }}
        />
        <aside className="flex h-fit flex-col gap-4 rounded-xl border p-5 lg:sticky lg:top-20">
          <h2 className="font-semibold">Pesanan Anda</h2>
          <ul className="flex flex-col gap-3 text-sm">
            {items.map((i) => (
              <li key={i.id} className="flex justify-between gap-3">
                <span className="min-w-0 text-muted-foreground">
                  <span className="line-clamp-1">{i.products?.name}</span>
                  <span className="text-xs">x{i.quantity}</span>
                </span>
                <span className="shrink-0 tabular-nums">{formatRupiah((i.products?.price ?? 0) * i.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="flex justify-between border-t pt-4 text-sm">
            <span className="text-muted-foreground">Ongkos kirim</span>
            <span>Gratis</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium">Total</span>
            <span className="text-lg font-semibold tabular-nums">{formatRupiah(total)}</span>
          </div>
        </aside>
      </div>
    </div>
  )
}
