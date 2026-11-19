import Link from 'next/link'
import { Logo } from './logo'

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 md:flex-row md:items-start md:justify-between md:px-6">
        <div className="flex max-w-sm flex-col gap-3">
          <Logo />
          <p className="text-sm leading-relaxed text-muted-foreground">
            Toko online komponen dan perlengkapan PC untuk pelajar, teknisi, gamer, dan semua orang.
          </p>
        </div>
        <nav aria-label="Tautan footer" className="flex gap-10 text-sm">
          <div className="flex flex-col gap-2">
            <span className="font-medium">Belanja</span>
            <Link href="/products" className="text-muted-foreground hover:text-foreground">Katalog</Link>
            <Link href="/cart" className="text-muted-foreground hover:text-foreground">Keranjang</Link>
          </div>
          <div className="flex flex-col gap-2">
            <span className="font-medium">Akun</span>
            <Link href="/dashboard" className="text-muted-foreground hover:text-foreground">Dashboard</Link>
            <Link href="/orders" className="text-muted-foreground hover:text-foreground">Pesanan</Link>
          </div>
        </nav>
      </div>
      <div className="border-t">
        <p className="mx-auto max-w-7xl px-4 py-4 text-xs text-muted-foreground md:px-6">
          {`© ${new Date().getFullYear()} PC MARKET. Semua hak dilindungi.`}
        </p>
      </div>
    </footer>
  )
}
