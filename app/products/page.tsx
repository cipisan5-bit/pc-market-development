import type { Metadata } from 'next'
import Link from 'next/link'
import { ProductGrid } from '@/components/store/product-card'
import { ProductFiltersForm } from '@/components/store/product-filters'
import { getCategories, getProducts, type ProductFilters } from '@/lib/queries'
import { cn } from '@/lib/utils'

export const metadata: Metadata = { title: 'Katalog Produk' }

function buildHref(current: ProductFilters, patch: Partial<ProductFilters>) {
  const params = new URLSearchParams()
  const merged = { ...current, ...patch }
  for (const [k, v] of Object.entries(merged)) if (v) params.set(k, v)
  const qs = params.toString()
  return qs ? `/products?${qs}` : '/products'
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<ProductFilters> }) {
  const raw = await searchParams
  const filters: ProductFilters = {
    q: typeof raw.q === 'string' ? raw.q : undefined,
    category: typeof raw.category === 'string' ? raw.category : undefined,
    sort: typeof raw.sort === 'string' ? raw.sort : undefined,
    min: typeof raw.min === 'string' ? raw.min : undefined,
    max: typeof raw.max === 'string' ? raw.max : undefined,
    inStock: typeof raw.inStock === 'string' ? raw.inStock : undefined,
  }
  const [categories, products] = await Promise.all([getCategories(), getProducts(filters)])
  const activeCategory = categories.find((c) => c.slug === filters.category)

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">{activeCategory?.name ?? 'Semua Produk'}</h1>
        <p className="text-sm text-muted-foreground">
          {products.length} produk{filters.q ? ` untuk "${filters.q}"` : ''}
        </p>
      </div>

      <nav aria-label="Filter kategori" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
        <ul className="flex w-max gap-2">
          <li>
            <Link
              href={buildHref(filters, { category: undefined })}
              aria-current={!filters.category ? 'page' : undefined}
              className={cn(
                'inline-flex rounded-full border px-3.5 py-1.5 text-sm transition-colors',
                !filters.category ? 'border-foreground bg-foreground text-background' : 'hover:bg-muted',
              )}
            >
              Semua
            </Link>
          </li>
          {categories.map((c) => {
            const active = c.slug === filters.category
            return (
              <li key={c.id}>
                <Link
                  href={buildHref(filters, { category: c.slug })}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'inline-flex rounded-full border px-3.5 py-1.5 text-sm whitespace-nowrap transition-colors',
                    active ? 'border-foreground bg-foreground text-background' : 'hover:bg-muted',
                  )}
                >
                  {c.name}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      <ProductFiltersForm filters={filters} />

      {products.length > 0 ? (
        <ProductGrid products={products} />
      ) : (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-12 text-center">
          <p className="font-medium">Produk tidak ditemukan</p>
          <p className="text-sm text-muted-foreground">Coba ubah kata kunci atau filter.</p>
          <Link href="/products" className="text-sm underline underline-offset-4">
            Reset filter
          </Link>
        </div>
      )}
    </div>
  )
}
