import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { AssetGrid } from '@/components/assets/asset-grid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<any>
}) {
  const { slug } = await params
  const searchParamsResolved = await searchParams
  
  const category = await prisma.category.findUnique({
    where: { slug },
  })

  if (!category) {
    notFound()
  }

  const page = parseInt(searchParamsResolved.page || '1')
  const limit = 12

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where: { categoryId: category.id },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.asset.count({
      where: { categoryId: category.id },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{category.name}</h1>
        <p className="text-muted-foreground">
          Showing {assets.length} of {total} assets
        </p>
      </div>

      <AssetGrid assets={assets} />

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link href={`?page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`?page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}
