'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Menu } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useLogout } from './use-logout'

export function MobileNav({ isLoggedIn, isAdmin }: { isLoggedIn: boolean; isAdmin: boolean }) {
  const [open, setOpen] = useState(false)
  const logout = useLogout()
  const close = () => setOpen(false)

  const links = [
    { href: '/', label: 'Beranda', show: true },
    { href: '/products', label: 'Katalog Produk', show: true },
    { href: '/cart', label: 'Keranjang', show: true },
    { href: '/dashboard', label: 'Dashboard', show: isLoggedIn },
    { href: '/orders', label: 'Riwayat Pesanan', show: isLoggedIn },
    { href: '/admin', label: 'Dashboard Admin', show: isAdmin },
    { href: '/auth/login', label: 'Masuk', show: !isLoggedIn },
    { href: '/auth/sign-up', label: 'Daftar', show: !isLoggedIn },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger render={<Button variant="ghost" size="icon-lg" className="md:hidden" aria-label="Buka menu" />}>
        <Menu className="size-5" />
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <SheetHeader>
          <SheetTitle>Menu</SheetTitle>
        </SheetHeader>
        <form action="/products" role="search" className="px-4" onSubmit={close}>
          <label htmlFor="mobile-search" className="sr-only">
            Cari produk
          </label>
          <input
            id="mobile-search"
            name="q"
            type="search"
            placeholder="Cari produk..."
            className="h-10 w-full rounded-lg border bg-muted/40 px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          />
        </form>
        <nav aria-label="Navigasi mobile" className="flex flex-col px-2">
          {links
            .filter((l) => l.show)
            .map((l) => (
              <Link key={l.href} href={l.href} onClick={close} className="rounded-md px-3 py-2.5 text-sm hover:bg-muted">
                {l.label}
              </Link>
            ))}
          {isLoggedIn && (
            <button
              type="button"
              onClick={() => {
                close()
                logout()
              }}
              className="rounded-md px-3 py-2.5 text-left text-sm hover:bg-muted"
            >
              Keluar
            </button>
          )}
        </nav>
      </SheetContent>
    </Sheet>
  )
}
