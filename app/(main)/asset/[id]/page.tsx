import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import AssetDetailClient from '@/components/assets/asset-detail-client'

export default async function AssetDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const asset = await prisma.asset.findUnique({
    where: { id: params.id },
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
