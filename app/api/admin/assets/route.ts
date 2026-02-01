import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id || session.user.role !== 'ADMIN') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { title, description, imageUrl, fileUrl, fileType, categoryId, tags, isPremium, creditCost } = await req.json()

    if (!title || !imageUrl || !fileUrl || !categoryId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Create or connect tags
    const tagRecords = await Promise.all(
      (tags || []).map(async (tagName: string) => {
        const tag = await prisma.tag.upsert({
          where: { name: tagName },
          update: {},
          create: { name: tagName },
        })
        return { id: tag.id }
      })
    )

    const asset = await prisma.asset.create({
      data: {
        title,
        description,
        imageUrl,
        fileUrl,
        fileType: fileType || 'image/jpeg',
        categoryId,
        isPremium: isPremium || false,
        creditCost: isPremium ? (creditCost || 1) : 0,
        tags: {
          connect: tagRecords,
        },
      },
      include: {
        category: true,
        tags: true,
      },
    })

    return NextResponse.json({ asset }, { status: 201 })
  } catch (error) {
    console.error('Asset creation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
