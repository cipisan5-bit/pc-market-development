import Link from 'next/link'
import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="PC MARKET, ke beranda"
      className={cn('inline-flex items-center gap-1.5 font-semibold tracking-tight', className)}
    >
      <span className="rounded-md bg-foreground px-1.5 py-0.5 font-mono text-sm font-bold text-background">PC</span>
      <span className="text-base tracking-[0.2em]">MARKET</span>
    </Link>
  )
}
