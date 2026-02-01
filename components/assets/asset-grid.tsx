import { Asset } from '@/types'
import { AssetCard } from './asset-card'

interface AssetGridProps {
  assets: Asset[]
  onFavorite?: (assetId: string) => void
  favoritedIds?: string[]
}

export function AssetGrid({ assets, onFavorite, favoritedIds = [] }: AssetGridProps) {
  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-lg text-muted-foreground">No assets found</p>
        <p className="text-sm text-muted-foreground mt-2">Try adjusting your filters or search query</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {assets.map((asset) => (
        <AssetCard
          key={asset.id}
          asset={asset}
          onFavorite={onFavorite}
          isFavorited={favoritedIds.includes(asset.id)}
        />
      ))}
    </div>
  )
}
