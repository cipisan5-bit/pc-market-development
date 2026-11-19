import Link from 'next/link'
import { AuthShell } from '@/components/auth/auth-shell'
import { buttonVariants } from '@/components/ui/button'

export default function AuthErrorPage() {
  return (
    <AuthShell title="Autentikasi gagal" description="Tautan tidak valid atau sudah kedaluwarsa.">
      <Link href="/auth/login" className={buttonVariants({ className: 'w-full', size: 'lg' })}>
        Coba masuk lagi
      </Link>
    </AuthShell>
  )
}
