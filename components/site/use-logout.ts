'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

export function useLogout() {
  const router = useRouter()

  return async function logout() {
    const { error } = await createClient().auth.signOut()
    if (error) {
      toast.error('Gagal keluar, coba lagi')
      return
    }
    toast.success('Berhasil keluar')
    router.push('/')
    router.refresh()
  }
}
