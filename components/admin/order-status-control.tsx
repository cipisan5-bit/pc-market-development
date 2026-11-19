'use client'

import { useState, useTransition } from 'react'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { NativeSelect } from '@/components/store/native-select'
import { updateOrderStatus } from '@/app/actions/orders'
import { ORDER_STATUSES, STATUS_LABEL } from '@/lib/format'
import type { OrderStatus } from '@/lib/types'

export function OrderStatusControl({ orderId, status }: { orderId: string; status: OrderStatus }) {
  const [value, setValue] = useState<OrderStatus>(status)
  const [pending, startTransition] = useTransition()
  const locked = status === 'cancelled'

  function save() {
    if (value === 'cancelled' && !confirm('Batalkan pesanan ini? Stok akan dikembalikan.')) return
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, value)
      if (res.ok) toast.success(`Status diubah menjadi ${STATUS_LABEL[value]}`)
      else {
        toast.error(res.error)
        setValue(status)
      }
    })
  }

  return (
    <div className="flex items-end gap-2">
      <div className="flex flex-col gap-1.5">
        <label htmlFor="order-status" className="text-xs text-muted-foreground">
          Ubah status
        </label>
        <NativeSelect
          id="order-status"
          className="w-44"
          value={value}
          disabled={locked || pending}
          onChange={(e) => setValue(e.target.value as OrderStatus)}
        >
          {ORDER_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABEL[s]}
            </option>
          ))}
        </NativeSelect>
      </div>
      <Button onClick={save} disabled={locked || pending || value === status}>
        {pending && <Loader2 className="animate-spin" />}
        Simpan
      </Button>
    </div>
  )
}
