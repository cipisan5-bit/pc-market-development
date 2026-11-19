import Link from 'next/link'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { NativeSelect } from '@/components/store/native-select'
import type { ProductFilters } from '@/lib/queries'

export function ProductFiltersForm({ filters }: { filters: ProductFilters }) {
  return (
    <form action="/products" className="flex flex-col gap-3 rounded-xl border bg-card p-4 md:flex-row md:flex-wrap md:items-end">
      {filters.category && <input type="hidden" name="category" value={filters.category} />}
      <div className="flex flex-1 flex-col gap-1.5 md:min-w-56">
        <label htmlFor="f-q" className="text-xs font-medium text-muted-foreground">
          Kata kunci
        </label>
        <Input id="f-q" name="q" type="search" defaultValue={filters.q} placeholder="Nama, merek..." />
      </div>
      <div className="grid grid-cols-2 gap-3 md:flex">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-min" className="text-xs font-medium text-muted-foreground">
            Harga min
          </label>
          <Input id="f-min" name="min" type="number" min={0} inputMode="numeric" defaultValue={filters.min} placeholder="0" className="md:w-32" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="f-max" className="text-xs font-medium text-muted-foreground">
            Harga maks
          </label>
          <Input id="f-max" name="max" type="number" min={0} inputMode="numeric" defaultValue={filters.max} placeholder="Tanpa batas" className="md:w-32" />
        </div>
      </div>
      <div className="flex flex-col gap-1.5">
        <label htmlFor="f-sort" className="text-xs font-medium text-muted-foreground">
          Urutkan
        </label>
        <NativeSelect id="f-sort" name="sort" defaultValue={filters.sort ?? ''} className="md:w-44">
          <option value="">Terbaru</option>
          <option value="price-asc">Harga terendah</option>
          <option value="price-desc">Harga tertinggi</option>
          <option value="name">Nama A-Z</option>
        </NativeSelect>
      </div>
      <label className="flex h-9 items-center gap-2 text-sm">
        <input type="checkbox" name="inStock" value="1" defaultChecked={filters.inStock === '1'} className="size-4 accent-foreground" />
        Hanya yang tersedia
      </label>
      <div className="flex gap-2">
        <Button type="submit">Terapkan</Button>
        <Link href={filters.category ? `/products?category=${filters.category}` : '/products'} className={buttonVariants({ variant: 'ghost' })}>
          Reset
        </Link>
      </div>
    </form>
  )
}
