'use client'

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart'
import { formatRupiah } from '@/lib/format'

const config = {
  total: { label: 'Pendapatan', color: 'var(--foreground)' },
} satisfies ChartConfig

function compact(v: number) {
  return new Intl.NumberFormat('id-ID', { notation: 'compact', maximumFractionDigits: 1 }).format(v)
}

export function SalesChart({ data }: { data: { date: string; total: number }[] }) {
  return (
    <ChartContainer config={config} className="aspect-auto h-64 w-full">
      <BarChart data={data} margin={{ left: 0, right: 0 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="date" tickLine={false} axisLine={false} tickMargin={8} minTickGap={16} />
        <YAxis tickLine={false} axisLine={false} width={48} tickFormatter={compact} />
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent formatter={(value) => formatRupiah(Number(value))} />}
        />
        <Bar dataKey="total" fill="var(--color-total)" radius={4} />
      </BarChart>
    </ChartContainer>
  )
}
