import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { stripe, CREDIT_PACKAGES } from '@/lib/stripe'

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { credits: true },
    })

    return NextResponse.json({ credits: user?.credits || 0 })
  } catch (error) {
    console.error('Credits fetch error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { credits } = await req.json()

    // Find matching package
    const packageData = CREDIT_PACKAGES.find(pkg => pkg.credits === credits)

    if (!packageData) {
      return NextResponse.json(
        { error: 'Invalid credit package' },
        { status: 400 }
      )
    }

    // Create Stripe checkout session
    const stripeSession = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: `${credits} Credits`,
              description: 'CreativeHub Credits',
            },
            unit_amount: Math.round(packageData.price * 100),
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard/credits?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/dashboard/credits?canceled=true`,
      metadata: {
        userId: session.user.id,
        credits: credits.toString(),
      },
    })

    return NextResponse.json({ url: stripeSession.url })
  } catch (error) {
    console.error('Credits purchase error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
