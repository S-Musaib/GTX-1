import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_dummy', {
  apiVersion: '2023-10-16',
  typescript: true,
})

export const CREDIT_PACKAGES = [
  { credits: 10, price: 9.99 },
  { credits: 50, price: 39.99 },
  { credits: 100, price: 69.99 },
  { credits: 250, price: 149.99 },
]
