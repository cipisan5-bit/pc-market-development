'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { updateProfile } from '@/app/actions/profile'

export function ProfileForm({ defaults }: { defaults: { fullName: string; phone: string; address: string } }) {
  const [form, setForm] = useState(defaults)
  const [pending, startTransition] = useTransition()

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = await updateProfile(form)
      if (res.ok) toast.success('Profil berhasil disimpan')
      else toast.error(res.error)
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 rounded-xl border p-5">
      <div className="flex flex-col gap-2">
        <Label htmlFor="p-name">Nama lengkap</Label>
        <Input id="p-name" maxLength={100} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="p-phone">No. telepon</Label>
        <Input id="p-phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
      </div>
      <div className="flex flex-col gap-2">
        <Label htmlFor="p-address">Alamat</Label>
        <Textarea id="p-address" rows={3} maxLength={500} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
      </div>
      <Button type="submit" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        Simpan Profil
      </Button>
    </form>
  )
}
