import type { Metadata } from 'next'
import { AuthShell } from '@/components/auth/auth-shell'
import { SignUpForm } from '@/components/auth/sign-up-form'

export const metadata: Metadata = { title: 'Daftar' }

export default function SignUpPage() {
  return (
    <AuthShell title="Buat akun baru" description="Daftar untuk mulai belanja komponen PC.">
      <SignUpForm />
    </AuthShell>
  )
}
