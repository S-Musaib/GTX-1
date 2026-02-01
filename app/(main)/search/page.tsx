import { Suspense } from 'react'
import { prisma } from '@/lib/prisma'
import { AssetGrid } from '@/components/assets/asset-grid'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const dynamic = 'force-dynamic'

async function SearchContent({ searchParams }: { searchParams: any }) {
  const query = searchParams.q || ''
  const page = parseInt(searchParams.page || '1')
  const limit = 12

  if (!query) {
    return (
      <div className="container py-16 text-center">
        <h1 className="text-3xl font-bold mb-4">Search Assets</h1>
        <p className="text-muted-foreground">Enter a search query to find assets</p>
      </div>
    )
  }

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          {
            tags: {
              some: {
                name: { contains: query, mode: 'insensitive' },
              },
            },
          },
        ],
      },
      include: {
        category: true,
        tags: true,
      },
      orderBy: { downloadCount: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.asset.count({
      where: {
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          {
            tags: {
              some: {
                name: { contains: query, mode: 'insensitive' },
              },
            },
          },
        ],
      },
    }),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="container py-8">
      <h1 className="text-4xl font-bold mb-2">Search Results</h1>
      <p className="text-muted-foreground mb-8">
        Found {total} results for &quot;{query}&quot;
      </p>

      <AssetGrid assets={assets} />

      {totalPages > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {page > 1 && (
            <Link href={`?q=${encodeURIComponent(query)}&page=${page - 1}`}>
              <Button variant="outline">Previous</Button>
            </Link>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <Link href={`?q=${encodeURIComponent(query)}&page=${page + 1}`}>
              <Button variant="outline">Next</Button>
            </Link>
          )}
        </div>
      )}
    </div>
  )
}

export default function SearchPage({ searchParams }: { searchParams: any }) {
  return (
    <Suspense fallback={<div className="container py-8">Loading...</div>}>
      <SearchContent searchParams={searchParams} />
    </Suspense>
  )
}
