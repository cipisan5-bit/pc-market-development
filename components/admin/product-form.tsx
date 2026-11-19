'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Loader2, Upload } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { NativeSelect } from '@/components/store/native-select'
import { createClient } from '@/lib/supabase/client'
import { createProduct, updateProduct, type ProductInput } from '@/app/actions/products'
import type { Category } from '@/lib/types'

const MAX_IMAGE_BYTES = 2 * 1024 * 1024

export function ProductForm({
  categories,
  productId,
  initial,
}: {
  categories: Category[]
  productId?: string
  initial?: ProductInput
}) {
  const router = useRouter()
  const [form, setForm] = useState<ProductInput>(
    initial ?? {
      name: '',
      brand: '',
      description: '',
      categoryId: categories[0]?.id ?? '',
      price: 0,
      stock: 0,
      imageUrl: '',
      isActive: true,
    },
  )
  const [uploading, setUploading] = useState(false)
  const [pending, startTransition] = useTransition()

  const set = <K extends keyof ProductInput>(key: K, value: ProductInput[K]) => setForm((f) => ({ ...f, [key]: value }))

  async function onUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (!file) return
    if (!file.type.startsWith('image/')) return toast.error('File harus berupa gambar')
    if (file.size > MAX_IMAGE_BYTES) return toast.error('Ukuran gambar maksimal 2MB')
    setUploading(true)
    const supabase = createClient()
    const ext = file.name.split('.').pop()?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'png'
    const path = `${crypto.randomUUID()}.${ext}`
    const { error } = await supabase.storage.from('product-images').upload(path, file, { contentType: file.type })
    setUploading(false)
    if (error) return toast.error('Gagal mengunggah gambar')
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    set('imageUrl', data.publicUrl)
    toast.success('Gambar berhasil diunggah')
  }

  function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      const res = productId ? await updateProduct(productId, form) : await createProduct(form)
      if (!res.ok) {
        toast.error(res.error)
        return
      }
      toast.success(res.message ?? 'Tersimpan')
      router.push('/admin/products')
      router.refresh()
    })
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <div className="flex flex-col gap-4 rounded-xl border p-5">
        <div className="flex flex-col gap-2">
          <Label htmlFor="name">Nama produk</Label>
          <Input id="name" required minLength={2} maxLength={200} value={form.name} onChange={(e) => set('name', e.target.value)} />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="brand">Merek</Label>
            <Input id="brand" maxLength={100} value={form.brand} onChange={(e) => set('brand', e.target.value)} />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="category">Kategori</Label>
            <NativeSelect id="category" required value={form.categoryId} onChange={(e) => set('categoryId', e.target.value)}>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </NativeSelect>
          </div>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-2">
            <Label htmlFor="price">Harga (Rp)</Label>
            <Input
              id="price"
              type="number"
              required
              min={0}
              step={1}
              inputMode="numeric"
              value={form.price}
              onChange={(e) => set('price', Math.max(0, Math.floor(Number(e.target.value) || 0)))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <Label htmlFor="stock">Stok</Label>
            <Input
              id="stock"
              type="number"
              required
              min={0}
              step={1}
              inputMode="numeric"
              value={form.stock}
              onChange={(e) => set('stock', Math.max(0, Math.floor(Number(e.target.value) || 0)))}
            />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Label htmlFor="description">Deskripsi</Label>
          <Textarea id="description" rows={6} maxLength={5000} value={form.description} onChange={(e) => set('description', e.target.value)} />
        </div>
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(e) => set('isActive', e.target.checked)}
            className="size-4 accent-foreground"
          />
          Tampilkan di katalog (aktif)
        </label>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 rounded-xl border p-5">
          <span className="text-sm font-medium">Gambar produk</span>
          <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
            {form.imageUrl ? (
              <Image src={form.imageUrl} alt="Pratinjau gambar produk" fill sizes="320px" className="object-contain p-3" />
            ) : (
              <div className="flex h-full items-center justify-center text-xs text-muted-foreground">Belum ada gambar</div>
            )}
          </div>
          <label className={buttonVariants({ variant: 'outline', className: 'cursor-pointer' })}>
            {uploading ? <Loader2 className="animate-spin" /> : <Upload />}
            {uploading ? 'Mengunggah...' : 'Unggah gambar'}
            <input type="file" accept="image/*" className="sr-only" onChange={onUpload} disabled={uploading} />
          </label>
          <div className="flex flex-col gap-2">
            <Label htmlFor="imageUrl" className="text-xs text-muted-foreground">
              atau URL gambar
            </Label>
            <Input id="imageUrl" value={form.imageUrl} placeholder="https://..." onChange={(e) => set('imageUrl', e.target.value)} />
          </div>
        </div>
        <div className="flex gap-2">
          <Link href="/admin/products" className={buttonVariants({ variant: 'outline', className: 'flex-1' })}>
            Batal
          </Link>
          <Button type="submit" className="flex-1" disabled={pending || uploading}>
            {pending && <Loader2 className="animate-spin" />}
            {productId ? 'Simpan' : 'Tambah Produk'}
          </Button>
        </div>
      </div>
    </form>
  )
}
