'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, ShoppingCart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { QuantityStepper } from './quantity-stepper'
import { addToCart } from '@/app/actions/cart'

export function AddToCart({ productId, stock, isLoggedIn }: { productId: string; stock: number; isLoggedIn: boolean }) {
  const router = useRouter()
  const [qty, setQty] = useState(1)
  const [pending, startTransition] = useTransition()
  const max = Math.min(stock, 99)

  function submit(buyNow: boolean) {
    if (!isLoggedIn) {
      toast.error('Silakan masuk terlebih dahulu')
      router.push(`/auth/login?next=/products/${productId}`)
      return
    }
    startTransition(async () => {
      const res = await addToCart(productId, qty)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success(res.message ?? 'Ditambahkan ke keranjang')
      if (buyNow) router.push('/cart')
    })
  }

  if (stock <= 0) {
    return (
      <Button size="lg" disabled className="w-full">
        Stok habis
      </Button>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm text-muted-foreground">Jumlah</span>
        <QuantityStepper value={qty} min={1} max={max} onChange={setQty} disabled={pending} />
      </div>
      <div className="flex flex-col gap-2 sm:flex-row">
        <Button size="lg" variant="outline" className="flex-1" disabled={pending} onClick={() => submit(false)}>
          {pending ? <Loader2 className="animate-spin" /> : <ShoppingCart />}
          Tambah ke Keranjang
        </Button>
        <Button size="lg" className="flex-1" disabled={pending} onClick={() => submit(true)}>
          Beli Sekarang
        </Button>
      </div>
    </div>
  )
}
