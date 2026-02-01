import Link from 'next/link'
import Image from 'next/image'
import { Download, Heart, Coins } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Asset } from '@/types'

interface AssetCardProps {
  asset: Asset
  onFavorite?: (assetId: string) => void
  isFavorited?: boolean
}

export function AssetCard({ asset, onFavorite, isFavorited }: AssetCardProps) {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg">
      <Link href={`/asset/${asset.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <Image
            src={asset.imageUrl}
            alt={asset.title}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
          {asset.isPremium && (
            <Badge className="absolute top-2 right-2 bg-yellow-500 text-black">
              Premium
            </Badge>
          )}
        </div>
      </Link>
      <CardContent className="p-4">
        <Link href={`/asset/${asset.id}`}>
          <h3 className="font-semibold line-clamp-1 mb-2 hover:underline">
            {asset.title}
          </h3>
        </Link>
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <Download className="h-4 w-4" />
              {asset.downloadCount}
            </span>
            {asset.isPremium && (
              <span className="flex items-center gap-1 text-yellow-600">
                <Coins className="h-4 w-4" />
                {asset.creditCost}
              </span>
            )}
          </div>
          {onFavorite && (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.preventDefault()
                onFavorite(asset.id)
              }}
            >
              <Heart
                className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
              />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
