import Stripe from 'stripe'

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('STRIPE_SECRET_KEY is not defined in environment variables')
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const CREDIT_PACKAGES = [
  { credits: 10, price: 9.99 },
  { credits: 50, price: 39.99 },
  { credits: 100, price: 69.99 },
  { credits: 250, price: 149.99 },
]
