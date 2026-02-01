import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function DownloadsPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const downloads = await prisma.download.findMany({
    where: { userId: session.user.id },
    include: {
      asset: {
        include: {
          category: true,
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Downloads</h1>
        <p className="text-muted-foreground">
          {downloads.length} total downloads
        </p>
      </div>

      {downloads.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t downloaded any assets yet.
            </p>
            <Link href="/browse" className="text-primary hover:underline">
              Browse assets
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6">
          {downloads.map((download) => (
            <Card key={download.id}>
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <Link href={`/asset/${download.asset.id}`} className="relative w-32 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-muted">
                    <Image
                      src={download.asset.imageUrl}
                      alt={download.asset.title}
                      fill
                      className="object-cover"
                    />
                  </Link>
                  <div className="flex-1">
                    <Link href={`/asset/${download.asset.id}`}>
                      <h3 className="font-semibold text-lg hover:underline">
                        {download.asset.title}
                      </h3>
                    </Link>
                    <p className="text-sm text-muted-foreground mt-1">
                      {download.asset.category?.name}
                    </p>
                    <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
                      <span>Downloaded on {formatDate(download.createdAt)}</span>
                      {download.credits > 0 && (
                        <span>• {download.credits} credits</span>
                      )}
                    </div>
                  </div>
                  <Link href={download.asset.fileUrl} target="_blank">
                    <button className="px-4 py-2 text-sm border rounded-md hover:bg-muted">
                      Download Again
                    </button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
