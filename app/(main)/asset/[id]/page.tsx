import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AssetDetailClient from '@/components/assets/asset-detail-client'

export default async function AssetDetailPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const asset = await prisma.asset.findUnique({
    where: { id },
    include: {
      category: true,
      tags: true,
    },
  })

  if (!asset) {
    notFound()
  }

  return <AssetDetailClient asset={asset} />
}
