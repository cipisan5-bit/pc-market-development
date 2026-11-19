export function AuthShell({
  title,
  description,
  children,
}: {
  title: string
  description: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[calc(100svh-4rem)] items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col gap-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight text-balance">{title}</h1>
          <p className="text-sm text-muted-foreground text-pretty">{description}</p>
        </div>
        <div className="rounded-xl border bg-card p-6">{children}</div>
      </div>
    </div>
  )
}
