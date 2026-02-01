import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Download, Heart, Coins, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session?.user?.id) {
    return null
  }

  const [user, downloads, favorites, recentDownloads] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
    }),
    prisma.download.count({
      where: { userId: session.user.id },
    }),
    prisma.favorite.count({
      where: { userId: session.user.id },
    }),
    prisma.download.findMany({
      where: { userId: session.user.id },
      include: {
        asset: {
          include: {
            category: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
    }),
  ])

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back, {user?.name || 'User'}!
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Credits</CardTitle>
            <Coins className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.credits || 0}</div>
            <Link href="/dashboard/credits">
              <Button variant="link" className="px-0 h-auto">
                Buy more credits
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Downloads</CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{downloads}</div>
            <Link href="/dashboard/downloads">
              <Button variant="link" className="px-0 h-auto">
                View all downloads
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorites</CardTitle>
            <Heart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favorites}</div>
            <Link href="/dashboard/favorites">
              <Button variant="link" className="px-0 h-auto">
                View favorites
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Account Type</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{user?.role || 'USER'}</div>
            <p className="text-xs text-muted-foreground mt-1">
              Member since {new Date(user?.createdAt || '').getFullYear()}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Downloads</CardTitle>
        </CardHeader>
        <CardContent>
          {recentDownloads.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No downloads yet. <Link href="/browse" className="text-primary hover:underline">Browse assets</Link>
            </p>
          ) : (
            <div className="space-y-4">
              {recentDownloads.map((download) => (
                <div key={download.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Link href={`/asset/${download.asset.id}`} className="font-medium hover:underline">
                      {download.asset.title}
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {download.asset.category?.name} • {new Date(download.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  {download.credits > 0 && (
                    <span className="text-sm text-muted-foreground">
                      {download.credits} credits
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
