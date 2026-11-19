import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { ProductImage } from '@/components/store/product-card'
import { AddToCart } from '@/components/store/add-to-cart'
import { getProduct } from '@/lib/queries'
import { getSession } from '@/lib/auth'
import { formatRupiah } from '@/lib/format'

type Params = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const product = await getProduct((await params).id)
  return { title: product?.name ?? 'Produk', description: product?.description ?? undefined }
}

export default async function ProductDetailPage({ params }: Params) {
  const { id } = await params
  const [product, { user }] = await Promise.all([getProduct(id), getSession()])
  if (!product) notFound()

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-10">
      <Link href="/products" className="mb-6 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ChevronLeft className="size-4" />
        Kembali ke katalog
      </Link>
      <div className="grid gap-8 md:grid-cols-2 md:gap-12">
        <div className="rounded-xl border p-2">
          <ProductImage src={product.image_url} alt={product.name} sizes="(min-width: 768px) 50vw, 100vw" priority />
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <Link
              href={`/products?category=${product.categories?.slug ?? ''}`}
              className="text-xs tracking-wide text-muted-foreground uppercase hover:text-foreground"
            >
              {product.categories?.name}
            </Link>
            <h1 className="text-2xl font-semibold tracking-tight text-balance md:text-3xl">{product.name}</h1>
            {product.brand && <p className="text-sm text-muted-foreground">Merek: {product.brand}</p>}
          </div>
          <p className="text-3xl font-semibold tabular-nums">{formatRupiah(product.price)}</p>
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border bg-border text-sm">
            <div className="flex flex-col gap-0.5 bg-card p-3">
              <dt className="text-xs text-muted-foreground">Stok</dt>
              <dd className="font-medium">{product.stock > 0 ? `${product.stock} unit` : 'Habis'}</dd>
            </div>
            <div className="flex flex-col gap-0.5 bg-card p-3">
              <dt className="text-xs text-muted-foreground">Kategori</dt>
              <dd className="font-medium">{product.categories?.name}</dd>
            </div>
          </dl>
          {product.is_active ? (
            <AddToCart productId={product.id} stock={product.stock} isLoggedIn={!!user} />
          ) : (
            <p className="rounded-lg border p-3 text-sm text-muted-foreground">Produk ini sedang tidak dijual.</p>
          )}
          {product.description && (
            <section aria-labelledby="deskripsi" className="flex flex-col gap-2 border-t pt-5">
              <h2 id="deskripsi" className="text-sm font-semibold">
                Deskripsi
              </h2>
              <p className="text-sm leading-relaxed whitespace-pre-line text-muted-foreground">{product.description}</p>
            </section>
          )}
        </div>
      </div>
    </div>
  )
}
