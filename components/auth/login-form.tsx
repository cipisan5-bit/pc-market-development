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

function loginErrorMessage(code: string | undefined, status: number | undefined) {
  if (code === 'email_not_confirmed') return 'Email belum dikonfirmasi. Cek kotak masuk Anda.'
  if (code === 'over_request_rate_limit' || status === 429) return 'Terlalu banyak percobaan. Coba lagi nanti.'
  if (code === 'invalid_credentials' || status === 400) return 'Email atau password salah'
  return 'Terjadi kesalahan, coba lagi'
}

export function LoginForm({ next }: { next: string }) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { error } = await createClient().auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      const message = loginErrorMessage(error.code, error.status)
      setError(message)
      toast.error(message)
      return
    }
    toast.success('Berhasil masuk')
    router.push(next)
    router.refresh()
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <div className="flex flex-col gap-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={loading} className="w-full">
        {loading && <Loader2 className="animate-spin" />}
        Masuk
      </Button>
      <p className="text-center text-sm text-muted-foreground">
        Belum punya akun?{' '}
        <Link href="/auth/sign-up" className="font-medium text-foreground underline underline-offset-4">
          Daftar
        </Link>
      </p>
    </form>
  )
}
