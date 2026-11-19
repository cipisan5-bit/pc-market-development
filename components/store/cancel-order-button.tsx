'use client'

import { useTransition } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { updateOrderStatus } from '@/app/actions/orders'

export function CancelOrderButton({ orderId }: { orderId: string }) {
  const [pending, startTransition] = useTransition()

  function cancel() {
    startTransition(async () => {
      const res = await updateOrderStatus(orderId, 'cancelled')
      if (res.ok) toast.success('Pesanan dibatalkan')
      else toast.error(res.error)
    })
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger render={<Button variant="outline" disabled={pending} />}>Batalkan Pesanan</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Batalkan pesanan ini?</AlertDialogTitle>
          <AlertDialogDescription>Stok produk akan dikembalikan. Tindakan ini tidak dapat dibatalkan.</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Kembali</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={cancel}>
            Ya, batalkan
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
