'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { placeOrder } from '@/app/actions/orders'
import { PAYMENT_LABEL } from '@/lib/format'
import type { PaymentMethod } from '@/lib/types'
import { cn } from '@/lib/utils'

const METHODS: PaymentMethod[] = ['transfer', 'ewallet', 'cod']

export function CheckoutForm({ defaults }: { defaults: { shippingName: string; phone: string; address: string } }) {
  const router = useRouter()
  const [idempotencyKey] = useState(() => crypto.randomUUID())
  const [form, setForm] = useState({ ...defaults, notes: '' })
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('transfer')
  const [error, setError] = useState<string | null>(null)
  const [pending, startTransition] = useTransition()

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    startTransition(async () => {
      const res = await placeOrder({ ...form, paymentMethod, idempotencyKey })
      if (!res.ok) {
        setError(res.error)
        toast.error(res.error)
        return
      }
      toast.success('Pesanan berhasil dibuat')
      router.push(`/orders/${res.data?.orderId}`)
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-6 rounded-xl border p-5">
      <fieldset className="flex flex-col gap-4">
        <legend className="mb-4 font-semibold">Data Pengiriman</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="shippingName">Nama penerima</Label>
            <Input id="shippingName" required maxLength={100} autoComplete="name" value={form.shippingName} onChange={set('shippingName')} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="phone">No. telepon</Label>
            <Input id="phone" required type="tel" autoComplete="tel" pattern="[0-9+\-\s]{8,20}" value={form.phone} onChange={set('phone')} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="address">Alamat lengkap</Label>
          <Textarea id="address" required maxLength={500} rows={3} autoComplete="street-address" value={form.address} onChange={set('address')} />
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="notes">Catatan (opsional)</Label>
          <Textarea id="notes" maxLength={500} rows={2} value={form.notes} onChange={set('notes')} />
        </div>
      </fieldset>

      <fieldset className="flex flex-col gap-3">
        <legend className="mb-3 font-semibold">Metode Pembayaran</legend>
        <div className="grid gap-2 sm:grid-cols-3">
          {METHODS.map((m) => (
            <label
              key={m}
              className={cn(
                'flex cursor-pointer items-center gap-2 rounded-lg border p-3 text-sm transition-colors has-focus-visible:ring-2 has-focus-visible:ring-ring/50',
                paymentMethod === m ? 'border-foreground bg-muted' : 'hover:bg-muted/50',
              )}
            >
              <input
                type="radio"
                name="payment"
                value={m}
                checked={paymentMethod === m}
                onChange={() => setPaymentMethod(m)}
                className="size-4 accent-foreground"
              />
              {PAYMENT_LABEL[m]}
            </label>
          ))}
        </div>
      </fieldset>

      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      )}
      <Button type="submit" size="lg" disabled={pending}>
        {pending && <Loader2 className="animate-spin" />}
        Buat Pesanan
      </Button>
    </form>
  )
}
