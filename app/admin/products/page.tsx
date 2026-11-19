import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { Pencil, Plus } from 'lucide-react'
import { createClient } from '@/lib/supabase/server'
import { PRODUCT_COLUMNS } from '@/lib/queries'
import { formatRupiah } from '@/lib/format'
import { buttonVariants } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { DeleteProductButton } from '@/components/admin/delete-product-button'
import type { Product } from '@/lib/types'

export const metadata: Metadata = { title: 'Admin - Produk' }

export default async function AdminProductsPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { q } = await searchParams
  const supabase = await createClient()
  let query = supabase.from('products').select(PRODUCT_COLUMNS).order('created_at', { ascending: false })
  const term = typeof q === 'string' ? q.replace(/[%,()*\\]/g, ' ').trim().slice(0, 80) : ''
  if (term) query = query.or(`name.ilike.%${term}%,brand.ilike.%${term}%`)
  const { data } = await query
  const products = (data ?? []) as unknown as Product[]

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Produk</h1>
        <div className="flex gap-2">
          <form action="/admin/products" className="flex-1 sm:w-64">
            <label htmlFor="admin-q" className="sr-only">
              Cari produk
            </label>
            <Input id="admin-q" name="q" type="search" placeholder="Cari produk..." defaultValue={term} />
          </form>
          <Link href="/admin/products/new" className={buttonVariants()}>
            <Plus />
            Tambah
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <p className="rounded-xl border border-dashed p-12 text-center text-sm text-muted-foreground">Tidak ada produk.</p>
      ) : (
        <ul className="flex flex-col divide-y rounded-xl border">
          {products.map((p) => (
            <li key={p.id} className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md bg-muted">
                {p.image_url && <Image src={p.image_url} alt="" fill sizes="56px" className="object-contain p-1" />}
              </div>
              <div className="flex min-w-0 flex-1 flex-col gap-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="line-clamp-1 text-sm font-medium">{p.name}</span>
                  {!p.is_active && <Badge variant="outline">Nonaktif</Badge>}
                </div>
                <span className="text-xs text-muted-foreground">
                  {p.categories?.name} · <span className="tabular-nums">{formatRupiah(p.price)}</span> ·{' '}
                  <span className={p.stock === 0 ? 'text-destructive' : ''}>Stok {p.stock}</span>
                </span>
              </div>
              <div className="flex shrink-0 gap-1">
                <Link
                  href={`/admin/products/${p.id}/edit`}
                  aria-label={`Edit ${p.name}`}
                  className={buttonVariants({ variant: 'ghost', size: 'icon' })}
                >
                  <Pencil />
                </Link>
                <DeleteProductButton id={p.id} name={p.name} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
