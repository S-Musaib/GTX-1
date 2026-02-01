import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'

export default async function AdminAssetsPage({
  searchParams,
}: {
  searchParams: any
}) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20

  const [assets, total] = await Promise.all([
    prisma.asset.findMany({
      include: {
        category: true,
        _count: {
          select: {
            downloads: true,
            favorites: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.asset.count(),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold mb-2">Manage Assets</h1>
          <p className="text-muted-foreground">
            {total} total assets
          </p>
        </div>
        <Link href="/admin/upload">
          <Button>Upload New Asset</Button>
        </Link>
      </div>

      <div className="grid gap-6">
        {assets.map((asset) => (
          <Card key={asset.id}>
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={asset.imageUrl}
                    alt={asset.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">{asset.title}</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    {asset.category?.name} • {formatDate(asset.createdAt)}
                  </p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{asset._count.downloads} downloads</span>
                    <span>{asset._count.favorites} favorites</span>
                    {asset.isPremium && (
                      <span className="text-yellow-600">{asset.creditCost} credits</span>
                    )}
                  </div>
                </div>
                <div className="flex flex-col gap-2">
                  <Link href={`/asset/${asset.id}`} target="_blank">
                    <Button variant="outline" size="sm">View</Button>
                  </Link>
                  <Button variant="outline" size="sm">Edit</Button>
                  <Button variant="destructive" size="sm">Delete</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
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
