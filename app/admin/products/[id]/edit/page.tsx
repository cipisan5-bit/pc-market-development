import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getCategories, getProduct } from '@/lib/queries'
import { ProductForm } from '@/components/admin/product-form'

export const metadata: Metadata = { title: 'Admin - Edit Produk' }

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const [categories, product] = await Promise.all([getCategories(), getProduct(id)])
  if (!product) notFound()

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Edit Produk</h1>
      <ProductForm
        categories={categories}
        productId={product.id}
        initial={{
          name: product.name,
          brand: product.brand ?? '',
          description: product.description ?? '',
          categoryId: product.category_id,
          price: product.price,
          stock: product.stock,
          imageUrl: product.image_url ?? '',
          isActive: product.is_active,
        }}
      />
    </div>
  )
}
