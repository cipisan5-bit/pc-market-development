import { Badge } from '@/components/ui/badge'
import { STATUS_LABEL } from '@/lib/format'
import type { OrderStatus } from '@/lib/types'

const VARIANT: Record<OrderStatus, 'default' | 'secondary' | 'outline' | 'destructive'> = {
  pending: 'outline',
  processing: 'secondary',
  shipped: 'secondary',
  completed: 'default',
  cancelled: 'destructive',
}

export function StatusBadge({ status }: { status: OrderStatus }) {
  return <Badge variant={VARIANT[status]}>{STATUS_LABEL[status]}</Badge>
}
