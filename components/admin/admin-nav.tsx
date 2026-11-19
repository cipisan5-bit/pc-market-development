'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

const LINKS = [
  { href: '/admin', label: 'Statistik' },
  { href: '/admin/products', label: 'Produk' },
  { href: '/admin/orders', label: 'Pesanan' },
]

export function AdminNav() {
  const pathname = usePathname()
  return (
    <nav aria-label="Menu admin">
      <ul className="flex gap-1 rounded-lg border p-1">
        {LINKS.map((l) => {
          const active = l.href === '/admin' ? pathname === '/admin' : pathname.startsWith(l.href)
          return (
            <li key={l.href}>
              <Link
                href={l.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'inline-flex rounded-md px-3 py-1.5 text-sm transition-colors',
                  active ? 'bg-foreground text-background' : 'text-muted-foreground hover:text-foreground',
                )}
              >
                {l.label}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
