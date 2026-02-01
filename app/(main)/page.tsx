import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { prisma } from '@/lib/prisma'
import { AssetGrid } from '@/components/assets/asset-grid'
import { ArrowRight, Image as ImageIcon, Palette, Sparkles } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HomePage() {
  const [featuredAssets, categories] = await Promise.all([
    prisma.asset.findMany({
      take: 8,
      orderBy: { downloadCount: 'desc' },
      include: {
        category: true,
        tags: true,
      },
    }),
    prisma.category.findMany({
      take: 6,
    }),
  ])

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="container py-24 md:py-32">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Discover millions of creative assets
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Download high-quality photos, vectors, and icons for your projects
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/browse">
                <Button size="lg" variant="secondary" className="w-full sm:w-auto">
                  Start Browsing
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/register">
                <Button size="lg" variant="outline" className="w-full sm:w-auto bg-transparent text-white border-white hover:bg-white hover:text-blue-600">
                  Sign Up Free
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <h2 className="text-3xl font-bold mb-8">Browse by Category</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/categories/${category.slug}`}
                className="group"
              >
                <div className="bg-background border rounded-lg p-6 text-center transition-all hover:shadow-lg hover:scale-105">
                  <div className="mb-3 flex justify-center">
                    {category.slug === 'photos' && <ImageIcon className="h-8 w-8 text-blue-600" />}
                    {category.slug === 'vectors' && <Palette className="h-8 w-8 text-purple-600" />}
                    {category.slug === 'icons' && <Sparkles className="h-8 w-8 text-yellow-600" />}
                    {!['photos', 'vectors', 'icons'].includes(category.slug) && (
                      <ImageIcon className="h-8 w-8 text-gray-600" />
                    )}
                  </div>
                  <h3 className="font-semibold group-hover:text-primary">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Assets Section */}
      <section className="py-16">
        <div className="container">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Assets</h2>
            <Link href="/browse">
              <Button variant="ghost">
                View All
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
          <AssetGrid assets={featuredAssets} />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-muted/50">
        <div className="container">
          <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-12 text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to get started?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Sign up now and get 10 free credits to download premium assets
            </p>
            <Link href="/register">
              <Button size="lg" variant="secondary">
                Create Free Account
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
