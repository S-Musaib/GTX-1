'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useToast } from '@/components/ui/use-toast'
import { Download, Heart, Coins, Calendar, Tag as TagIcon } from 'lucide-react'
import { Asset } from '@/types'
import { formatDate } from '@/lib/utils'

export default function AssetDetailClient({ asset }: { asset: Asset }) {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isDownloading, setIsDownloading] = useState(false)
  const [isFavorited, setIsFavorited] = useState(false)

  const handleDownload = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    setIsDownloading(true)

    try {
      const res = await fetch('/api/download', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: asset.id }),
      })

      const data = await res.json()

      if (!res.ok) {
        if (res.status === 402) {
          toast({
            title: 'Insufficient Credits',
            description: 'You need more credits to download this asset.',
            variant: 'destructive',
          })
          router.push('/dashboard/credits')
          return
        }
        throw new Error(data.error)
      }

      // Trigger download
      window.location.href = data.fileUrl

      toast({
        title: 'Success',
        description: `Asset downloaded${data.creditsSpent > 0 ? ` for ${data.creditsSpent} credits` : ' for free'}!`,
      })

      router.refresh()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to download asset',
        variant: 'destructive',
      })
    } finally {
      setIsDownloading(false)
    }
  }

  const handleFavorite = async () => {
    if (!session) {
      router.push('/login')
      return
    }

    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId: asset.id }),
      })

      if (!res.ok) throw new Error()

      const data = await res.json()
      setIsFavorited(data.favorited)

      toast({
        title: data.favorited ? 'Added to favorites' : 'Removed from favorites',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to update favorites',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="container py-8">
      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative aspect-[4/3] rounded-lg overflow-hidden bg-muted">
          <Image
            src={asset.imageUrl}
            alt={asset.title}
            fill
            className="object-cover"
            priority
          />
        </div>

        <div className="space-y-6">
          <div>
            <div className="flex items-start justify-between mb-2">
              <h1 className="text-3xl font-bold">{asset.title}</h1>
              {asset.isPremium && (
                <Badge className="bg-yellow-500 text-black">Premium</Badge>
              )}
            </div>
            {asset.description && (
              <p className="text-muted-foreground">{asset.description}</p>
            )}
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm">
              <TagIcon className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Category:</span>
              <Link
                href={`/categories/${asset.category?.slug}`}
                className="text-primary hover:underline"
              >
                {asset.category?.name}
              </Link>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Added:</span>
              <span>{formatDate(asset.createdAt)}</span>
            </div>

            <div className="flex items-center gap-2 text-sm">
              <Download className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Downloads:</span>
              <span>{asset.downloadCount}</span>
            </div>

            {asset.isPremium && (
              <div className="flex items-center gap-2 text-sm">
                <Coins className="h-4 w-4 text-yellow-600" />
                <span className="font-medium">Cost:</span>
                <span className="text-yellow-600">{asset.creditCost} Credits</span>
              </div>
            )}
          </div>

          {asset.tags && asset.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {asset.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary">
                  {tag.name}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button
              size="lg"
              className="flex-1"
              onClick={handleDownload}
              disabled={isDownloading}
            >
              <Download className="mr-2 h-5 w-5" />
              {isDownloading
                ? 'Downloading...'
                : asset.isPremium
                ? `Download (${asset.creditCost} Credits)`
                : 'Download Free'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleFavorite}
            >
              <Heart
                className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
