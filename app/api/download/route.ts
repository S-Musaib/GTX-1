import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { assetId } = await req.json()

    if (!assetId) {
      return NextResponse.json(
        { error: 'Asset ID is required' },
        { status: 400 }
      )
    }

    const asset = await prisma.asset.findUnique({
      where: { id: assetId },
    })

    if (!asset) {
      return NextResponse.json(
        { error: 'Asset not found' },
        { status: 404 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      )
    }

    // Check if already downloaded
    const existingDownload = await prisma.download.findFirst({
      where: {
        userId: session.user.id,
        assetId: asset.id,
      },
    })

    if (existingDownload) {
      return NextResponse.json({
        success: true,
        fileUrl: asset.fileUrl,
        message: 'Already downloaded',
      })
    }

    // Check if user has enough credits for premium assets
    if (asset.isPremium && user.credits < asset.creditCost) {
      return NextResponse.json(
        { error: 'Insufficient credits' },
        { status: 402 }
      )
    }

    // Create download record and update credits in a transaction
    const [download] = await prisma.$transaction([
      prisma.download.create({
        data: {
          userId: session.user.id,
          assetId: asset.id,
          credits: asset.isPremium ? asset.creditCost : 0,
        },
      }),
      prisma.asset.update({
        where: { id: asset.id },
        data: { downloadCount: { increment: 1 } },
      }),
      ...(asset.isPremium
        ? [
            prisma.user.update({
              where: { id: session.user.id },
              data: { credits: { decrement: asset.creditCost } },
            }),
            prisma.transaction.create({
              data: {
                userId: session.user.id,
                type: 'SPEND',
                credits: -asset.creditCost,
              },
            }),
          ]
        : []),
    ])

    return NextResponse.json({
      success: true,
      fileUrl: asset.fileUrl,
      creditsSpent: asset.isPremium ? asset.creditCost : 0,
      remainingCredits: asset.isPremium ? user.credits - asset.creditCost : user.credits,
    })
  } catch (error) {
    console.error('Download error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
