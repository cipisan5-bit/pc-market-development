import Link from 'next/link'
import { Search, ShoppingCart } from 'lucide-react'
import { getSession } from '@/lib/auth'
import { buttonVariants } from '@/components/ui/button'
import { Logo } from './logo'
import { UserMenu } from './user-menu'
import { MobileNav } from './mobile-nav'

async function getCartCount(userId: string) {
  const { supabase } = await getSession()
  const { data } = await supabase.from('cart_items').select('quantity').eq('user_id', userId)
  return (data ?? []).reduce((sum, row) => sum + row.quantity, 0)
}

export async function SiteHeader() {
  const { user, profile } = await getSession()
  const cartCount = user ? await getCartCount(user.id) : 0
  const isAdmin = profile?.role === 'admin'
  const displayName = profile?.full_name || user?.email || ''

  return (
    <header className="sticky top-0 z-40 border-b bg-background/90 backdrop-blur supports-backdrop-filter:bg-background/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 md:px-6">
        <MobileNav isLoggedIn={!!user} isAdmin={isAdmin} />
        <Logo />

        <nav aria-label="Navigasi utama" className="ml-4 hidden items-center gap-1 text-sm md:flex">
          <Link href="/products" className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">
            Katalog
          </Link>
          {user && (
            <Link href="/orders" className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">
              Pesanan
            </Link>
          )}
          {isAdmin && (
            <Link href="/admin" className="rounded-md px-3 py-2 text-muted-foreground transition-colors hover:text-foreground">
              Admin
            </Link>
          )}
        </nav>

        <form action="/products" role="search" className="ml-auto hidden max-w-sm flex-1 lg:block">
          <label htmlFor="header-search" className="sr-only">
            Cari produk
          </label>
          <div className="relative">
            <Search aria-hidden className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <input
              id="header-search"
              name="q"
              type="search"
              placeholder="Cari processor, VGA, SSD..."
              className="h-9 w-full rounded-lg border bg-muted/40 pr-3 pl-9 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-ring/50"
            />
          </div>
        </form>

        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          <Link
            href="/cart"
            aria-label={`Keranjang, ${cartCount} item`}
            className={buttonVariants({ variant: 'ghost', size: 'icon-lg', className: 'relative' })}
          >
            <ShoppingCart className="size-5" />
            {cartCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 flex min-w-5 items-center justify-center rounded-full bg-foreground px-1 text-[10px] font-semibold text-background">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            )}
          </Link>

          {user ? (
            <UserMenu name={displayName} email={user.email ?? ''} isAdmin={isAdmin} />
          ) : (
            <div className="hidden items-center gap-1 sm:flex">
              <Link href="/auth/login" className={buttonVariants({ variant: 'ghost' })}>
                Masuk
              </Link>
              <Link href="/auth/sign-up" className={buttonVariants({ variant: 'default' })}>
                Daftar
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
