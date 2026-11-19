'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'
import type { ActionResult } from '@/lib/types'

export async function updateProfile(input: {
  fullName: string
  phone: string
  address: string
}): Promise<ActionResult> {
  const fullName = input.fullName?.trim() ?? ''
  const phone = input.phone?.trim() ?? ''
  const address = input.address?.trim() ?? ''
  if (fullName.length > 100) return { ok: false, error: 'Nama terlalu panjang' }
  if (phone && !/^[0-9+\-\s]{8,20}$/.test(phone)) return { ok: false, error: 'Nomor telepon tidak valid' }
  if (address.length > 500) return { ok: false, error: 'Alamat terlalu panjang' }

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  if (!user) return { ok: false, error: 'Silakan login terlebih dahulu' }

  const { error } = await supabase
    .from('profiles')
    .update({ full_name: fullName || null, phone: phone || null, address: address || null })
    .eq('id', user.id)
  if (error) return { ok: false, error: 'Gagal menyimpan profil' }
  revalidatePath('/', 'layout')
  return { ok: true, message: 'Profil berhasil disimpan' }
}
