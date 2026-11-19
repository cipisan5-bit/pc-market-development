import Link from 'next/link'
import { MailCheck } from 'lucide-react'
import { AuthShell } from '@/components/auth/auth-shell'
import { buttonVariants } from '@/components/ui/button'

export default function SignUpSuccessPage() {
  return (
    <AuthShell title="Cek email Anda" description="Kami telah mengirim tautan konfirmasi ke email Anda.">
      <div className="flex flex-col items-center gap-4 text-center">
        <MailCheck aria-hidden className="size-10 text-muted-foreground" />
        <p className="text-sm text-muted-foreground text-pretty">
          Klik tautan di email untuk mengaktifkan akun, lalu masuk untuk mulai belanja.
        </p>
        <Link href="/auth/login" className={buttonVariants({ className: 'w-full', size: 'lg' })}>
          Ke halaman masuk
        </Link>
      </div>
    </AuthShell>
  )
}
