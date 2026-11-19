import Link from 'next/link'
import { ArrowRight, ShieldCheck, Truck, Wrench } from 'lucide-react'
import { buttonVariants } from '@/components/ui/button'
import { ProductGrid } from '@/components/store/product-card'
import { getCategories, getProducts } from '@/lib/queries'

export default async function HomePage() {
  const [categories, latest] = await Promise.all([getCategories(), getProducts({}, 8)])

  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-16 px-4 py-10 md:px-6 md:py-16">
      <section className="flex flex-col gap-6 border-b pb-12 md:pb-16">
        <span className="font-mono text-xs tracking-widest text-muted-foreground uppercase">Komponen PC & Perlengkapan</span>
        <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-balance md:text-6xl">
          Rakit PC impian Anda, satu komponen dalam satu tempat.
        </h1>
        <p className="max-w-xl text-base leading-relaxed text-muted-foreground text-pretty md:text-lg">
          Processor, VGA, RAM, SSD hingga monitor. Harga transparan, stok real-time, untuk pelajar, teknisi, dan gamer.
        </p>
        <div className="flex flex-wrap gap-3">
          <Link href="/products" className={buttonVariants({ size: 'lg' })}>
            Lihat Katalog
            <ArrowRight />
          </Link>
          <Link href="/products?category=vga-gpu" className={buttonVariants({ size: 'lg', variant: 'outline' })}>
            Belanja VGA
          </Link>
        </div>
        <ul className="mt-4 grid gap-4 text-sm sm:grid-cols-3">
          {[
            { icon: ShieldCheck, text: 'Produk original bergaransi' },
            { icon: Truck, text: 'Pengiriman ke seluruh Indonesia' },
            { icon: Wrench, text: 'Cocok untuk rakitan & upgrade' },
          ].map(({ icon: Icon, text }) => (
            <li key={text} className="flex items-center gap-2 text-muted-foreground">
              <Icon aria-hidden className="size-4 text-foreground" />
              {text}
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="kategori" className="flex flex-col gap-6">
        <h2 id="kategori" className="text-xl font-semibold tracking-tight">
          Kategori
        </h2>
        <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
          {categories.map((c, i) => (
            <li key={c.id}>
              <Link
                href={`/products?category=${c.slug}`}
                className="flex h-full items-center justify-between gap-2 rounded-lg border px-4 py-4 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                {c.name}
                <span className="font-mono text-xs opacity-50">{String(i + 1).padStart(2, '0')}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="terbaru" className="flex flex-col gap-6">
        <div className="flex items-end justify-between gap-4">
          <h2 id="terbaru" className="text-xl font-semibold tracking-tight">
            Produk Terbaru
          </h2>
          <Link href="/products" className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline">
            Lihat semua
          </Link>
        </div>
        {latest.length > 0 ? (
          <ProductGrid products={latest} />
        ) : (
          <p className="rounded-lg border border-dashed p-8 text-center text-sm text-muted-foreground">Belum ada produk.</p>
        )}
      </section>
    </div>
  )
}
