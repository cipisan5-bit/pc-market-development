'use client'

import { Minus, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function QuantityStepper({
  value,
  min,
  max,
  onChange,
  disabled,
}: {
  value: number
  min: number
  max: number
  onChange: (v: number) => void
  disabled?: boolean
}) {
  return (
    <div className="inline-flex items-center rounded-lg border" role="group" aria-label="Jumlah">
      <Button
        variant="ghost"
        size="icon"
        aria-label="Kurangi"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
      >
        <Minus />
      </Button>
      <span aria-live="polite" className="w-10 text-center text-sm font-medium tabular-nums">
        {value}
      </span>
      <Button
        variant="ghost"
        size="icon"
        aria-label="Tambah"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
      >
        <Plus />
      </Button>
    </div>
  )
}
