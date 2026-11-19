import type { Metadata } from 'next'
import Link from 'next/link'
import { requireUser } from '@/lib/auth'
import { formatRupiah } from '@/lib/format'
import { StatCard } from '@/components/store/stat-card'
import { OrderList } from '@/components/store/order-list'
import { ProfileForm } from '@/components/store/profile-form'
import { buttonVariants } from '@/components/ui/button'
import type { Order } from '@/lib/types'

export const metadata: Metadata = { title: 'Dashboard' }

export default async function DashboardPage() {
  const { supabase, user, profile } = await requireUser('/dashboard')
  const { data } = await supabase
    .from('orders')
    .select('id, user_id, status, total, shipping_name, phone, address, notes, payment_method, created_at')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
  const orders = (data ?? []) as Order[]
  const active = orders.filter((o) => ['pending', 'processing', 'shipped'].includes(o.status)).length
  const spent = orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.total, 0)

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Halo, {profile?.full_name || 'Pelanggan'}</h1>
        <p className="text-sm text-muted-foreground">{user.email}</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <StatCard label="Total pesanan" value={String(orders.length)} />
        <StatCard label="Pesanan aktif" value={String(active)} />
        <StatCard label="Total belanja" value={formatRupiah(spent)} />
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <section aria-labelledby="recent" className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 id="recent" className="font-semibold">
              Pesanan terbaru
            </h2>
            <Link href="/orders" className="text-sm text-muted-foreground hover:text-foreground hover:underline">
              Lihat semua
            </Link>
          </div>
          {orders.length ? (
            <OrderList orders={orders.slice(0, 5)} />
          ) : (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center text-sm">
              <p className="text-muted-foreground">Belum ada pesanan.</p>
              <Link href="/products" className={buttonVariants({ size: 'sm' })}>
                Belanja sekarang
              </Link>
            </div>
          )}
        </section>
        <section aria-labelledby="profil" className="flex flex-col gap-4">
          <h2 id="profil" className="font-semibold">
            Profil & alamat
          </h2>
          <ProfileForm
            defaults={{ fullName: profile?.full_name ?? '', phone: profile?.phone ?? '', address: profile?.address ?? '' }}
          />
        </section>
      </div>
    </div>
  )
}
