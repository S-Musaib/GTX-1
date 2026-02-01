import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const CREDIT_PACKS = [
  { credits: 10, price: 2, priceId: 'price_10credits' },
  { credits: 50, price: 8, priceId: 'price_50credits' },
  { credits: 100, price: 15, priceId: 'price_100credits' },
  { credits: 500, price: 60, priceId: 'price_500credits' },
]
