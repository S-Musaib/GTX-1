'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Heart } from 'lucide-react'
import { Asset } from '@/types'

export default function FavoritesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [favorites, setFavorites] = useState<Array<{ id: string; asset: Asset }>>([])
  const [loading, setLoading] = useState(true)

  const fetchFavorites = useCallback(async () => {
    try {
      const res = await fetch('/api/favorites')
      if (!res.ok) throw new Error()
      const data = await res.json()
      setFavorites(data.favorites)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load favorites',
        variant: 'destructive',
      })
    } finally {
      setLoading(false)
    }
  }, [toast])

  useEffect(() => {
    fetchFavorites()
  }, [fetchFavorites])

  const removeFavorite = async (assetId: string) => {
    try {
      const res = await fetch('/api/favorites', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ assetId }),
      })

      if (!res.ok) throw new Error()

      setFavorites(favorites.filter(f => f.asset.id !== assetId))
      toast({
        title: 'Removed from favorites',
      })
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to remove favorite',
        variant: 'destructive',
      })
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">My Favorites</h1>
        <p className="text-muted-foreground">
          {favorites.length} saved assets
        </p>
      </div>

      {favorites.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground mb-4">
              You haven&apos;t favorited any assets yet.
            </p>
            <Link href="/browse" className="text-primary hover:underline">
              Browse assets
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {favorites.map((favorite) => (
            <Card key={favorite.id} className="group overflow-hidden">
              <Link href={`/asset/${favorite.asset.id}`}>
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                  <Image
                    src={favorite.asset.imageUrl}
                    alt={favorite.asset.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              </Link>
              <CardContent className="p-4">
                <Link href={`/asset/${favorite.asset.id}`}>
                  <h3 className="font-semibold line-clamp-1 mb-2 hover:underline">
                    {favorite.asset.title}
                  </h3>
                </Link>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {favorite.asset.category?.name}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => removeFavorite(favorite.asset.id)}
                  >
                    <Heart className="h-4 w-4 fill-red-500 text-red-500" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
