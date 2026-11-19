import Image from 'next/image'
import Link from 'next/link'
import { formatRupiah } from '@/lib/format'
import type { Product } from '@/lib/types'

export function ProductImage({ src, alt, sizes, priority }: { src: string | null; alt: string; sizes: string; priority?: boolean }) {
  return (
    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
      {src ? (
        <Image src={src} alt={alt} fill sizes={sizes} priority={priority} className="object-contain p-4" />
      ) : (
        <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Tidak ada gambar</div>
      )}
    </div>
  )
}

export function ProductCard({ product }: { product: Product }) {
  const outOfStock = product.stock <= 0
  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col gap-3 rounded-xl border bg-card p-3 transition-colors hover:border-foreground/30"
    >
      <ProductImage src={product.image_url} alt={product.name} sizes="(min-width: 1024px) 25vw, (min-width: 640px) 33vw, 50vw" />
      <div className="flex flex-1 flex-col gap-1 px-1 pb-1">
        <span className="text-xs text-muted-foreground">{product.categories?.name}</span>
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-pretty group-hover:underline group-hover:underline-offset-4">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2">
          <span className="font-semibold tabular-nums">{formatRupiah(product.price)}</span>
          <span className={outOfStock ? 'text-xs text-destructive' : 'text-xs text-muted-foreground'}>
            {outOfStock ? 'Habis' : `Stok ${product.stock}`}
          </span>
        </div>
      </div>
    </Link>
  )
}

export function ProductGrid({ products }: { products: Product[] }) {
  return (
    <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:gap-4 lg:grid-cols-4">
      {products.map((p) => (
        <li key={p.id} className="flex">
          <div className="flex w-full">
            <ProductCard product={p} />
          </div>
        </li>
      ))}
    </ul>
  )
}
