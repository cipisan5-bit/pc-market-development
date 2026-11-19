import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { LoginForm } from '@/components/auth/login-form'

export const metadata: Metadata = { title: 'Masuk' }

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  const { next } = await searchParams
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/'
  return (
    <AuthShell title="Masuk ke PC MARKET" description="Masukkan email dan password akun Anda.">
      <LoginForm next={safeNext} />
    </AuthShell>
  )
}
