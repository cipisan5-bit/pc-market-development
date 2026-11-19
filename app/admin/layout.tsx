import { requireAdmin } from '@/lib/auth'
import { AdminNav } from '@/components/admin/admin-nav'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin()
  return (
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-6 md:py-10">
      <div className="flex flex-col gap-4 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-2">
          <span className="rounded bg-foreground px-1.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-background uppercase">
            Admin
          </span>
          <span className="text-sm text-muted-foreground">Panel pengelolaan toko</span>
        </div>
        <AdminNav />
      </div>
      {children}
    </div>
  )
}
