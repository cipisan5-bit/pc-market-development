import { cache } from 'react'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import type { Profile } from '@/lib/types'

export const getSession = cache(async () => {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) return { supabase, user: null, profile: null }

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, full_name, phone, address, role')
    .eq('id', user.id)
    .maybeSingle<Profile>()

  return { supabase, user, profile }
})

export async function requireUser(next: string) {
  const session = await getSession()
  if (!session.user) redirect(`/auth/login?next=${encodeURIComponent(next)}`)
  return session as typeof session & { user: NonNullable<typeof session.user> }
}

export async function requireAdmin() {
  const session = await requireUser('/admin')
  if (session.profile?.role !== 'admin') redirect('/dashboard')
  return session
}
