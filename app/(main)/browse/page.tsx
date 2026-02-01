import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { AssetGrid } from '@/components/assets/asset-grid'
import { AssetFilters } from '@/components/assets/asset-filters'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function BrowseContent({ searchParams }: { searchParams: any }) {
  const category = searchParams.category || 'all'
  const type = searchParams.type || 'all'
  const price = searchParams.price || 'all'
  const page = parseInt(searchParams.page || '1')
  const limit = 12

  const where: any = {}

  if (category !== 'all') {
    const categoryData = await prisma.category.findUnique({
      where: { slug: category },
    })
    if (categoryData) {
      where.categoryId = categoryData.id
    }
  }

  if (type !== 'all') {
    where.fileType = type
  }

  if (price === 'free') {
    where.isPremium = false
  } else if (price === 'premium') {
    where.isPremium = true
  }

  const [assets, total, categories] = await Promise.all([
    prisma.asset.findMany({
      where,
      include: {
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.asset.count({ where }),
    prisma.category.findMany(),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-8">Browse Assets</h1>
      
      <div className="mb-8">
        <AssetFilters categories={categories} />
      </div>

      <div className="mb-8">
        <p className="text-muted-foreground">
          Showing {assets.length} of {total} assets
        </p>
      </div>

      <AssetGrid assets={assets} />

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link href={`?${new URLSearchParams({ ...searchParams, page: String(page - 1) }).toString()}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`?${new URLSearchParams({ ...searchParams, page: String(page + 1) }).toString()}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function BrowsePage({ searchParams }: { searchParams: any }) {
  return (
    <Suspense fallback={<div className="container py-8">Loading...</div>}>
      <BrowseContent searchParams={searchParams} />
    </Suspense>
  )
}
