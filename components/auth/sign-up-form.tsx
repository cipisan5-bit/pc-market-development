'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function signUpErrorMessage(code: string | undefined, status: number | undefined) {
  if (code === 'weak_password') return 'Password terlalu lemah. Gunakan minimal 6 karakter.'
  if (code === 'email_address_invalid') return 'Alamat email tidak valid'
  if (code === 'over_email_send_rate_limit' || code === 'over_request_rate_limit' || status === 429)
    return 'Terlalu banyak percobaan. Coba lagi nanti.'
  if (code === 'signup_disabled') return 'Pendaftaran sedang ditutup'
  return 'Pendaftaran gagal, coba lagi'
}

export function SignUpForm() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    if (password.length < 6) return setError('Password minimal 6 karakter')
    if (password !== confirm) return setError('Konfirmasi password tidak cocok')

    setLoading(true)
    const { data, error } = await createClient().auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ?? `${window.location.origin}/auth/callback`,
        data: { full_name: fullName.trim() },
      },
    })
    setLoading(false)

    if (error) {
      const message = signUpErrorMessage(error.code, error.status)
      setError(message)
      toast.error(message)
      return
    }

    if (data.session) {
      toast.success('Akun berhasil dibuat')
      router.push('/dashboard')
      router.refresh()
    } else {
      toast.success('Pendaftaran berhasil, cek email untuk konfirmasi')
      router.push('/auth/sign-up-success')
    }
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="fullName">Nama lengkap</Label>
        <Input id="fullName" autoComplete="name" required maxLength={100} value={fullName} onChange={(e) => setFullName(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" autoComplete="new-password" required value={password} onChange={(e) => setPassword(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="confirm">Konfirmasi password</Label>
        <Input id="confirm" type="password" autoComplete="new-password" required value={confirm} onChange={(e) => setConfirm(e.target.value)} />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading && <Loader2 className="animate-spin" />}
        Daftar
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Sudah punya akun?{' '}
        <Link href="/auth/login" className="font-medium text-foreground underline underline-offset-4">
          Masuk
        </Link>
      </p>
    </form>
  )
}
