import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '12')
    const skip = (page - 1) * limit

    const [assets, total] = await Promise.all([
      prisma.asset.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            {
              tags: {
                some: {
                  name: { contains: query, mode: 'insensitive' },
                },
              },
            },
          ],
        },
        include: {
          category: true,
          tags: true,
        },
        orderBy: { downloadCount: 'desc' },
        skip,
        take: limit,
      }),
      prisma.asset.count({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { description: { contains: query, mode: 'insensitive' } },
            {
              tags: {
                some: {
                  name: { contains: query, mode: 'insensitive' },
                },
              },
            },
          ],
        },
      }),
    ])

    return NextResponse.json({
      assets,
      query,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    })
  } catch (error) {
    console.error('Search error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
