import type { Metadata } from 'next'
import { getCategories } from '@/lib/queries'
import { ProductForm } from '@/components/admin/product-form'

export const metadata: Metadata = { title: 'Admin - Tambah Produk' }

export default async function NewProductPage() {
  const categories = await getCategories()
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Tambah Produk</h1>
      <ProductForm categories={categories} />
    </div>
  )
}
