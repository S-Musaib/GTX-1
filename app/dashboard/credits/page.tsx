'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { Coins, Check } from 'lucide-react'
import { useSession } from 'next-auth/react'
import { CREDIT_PACKAGES } from '@/lib/stripe'

export default function CreditsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [loading, setLoading] = useState<number | null>(null)

  const handlePurchase = async (credits: number) => {
    setLoading(credits)

    try {
      const res = await fetch('/api/credits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credits }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error)
      }

      if (data.url) {
        window.location.href = data.url
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to initiate purchase',
        variant: 'destructive',
      })
      setLoading(null)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Buy Credits</h1>
        <p className="text-muted-foreground">
          Current Balance: <span className="font-semibold">{session?.user?.credits || 0} Credits</span>
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {CREDIT_PACKAGES.map((pkg, index) => {
          const isPopular = index === 1 // Make the second package (50 credits) popular
          return (
            <Card
              key={pkg.credits}
              className={`relative ${isPopular ? 'border-primary shadow-lg' : ''}`}
            >
              {isPopular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                    Most Popular
                  </span>
                </div>
              )}
              <CardHeader className="text-center">
                <div className="flex justify-center mb-4">
                  <div className="p-4 bg-primary/10 rounded-full">
                    <Coins className="h-8 w-8 text-primary" />
                  </div>
                </div>
                <CardTitle>{pkg.credits} Credits</CardTitle>
                <CardDescription>
                  <span className="text-3xl font-bold text-foreground">
                    ${pkg.price}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  variant={isPopular ? 'default' : 'outline'}
                  onClick={() => handlePurchase(pkg.credits)}
                  disabled={loading !== null}
                >
                  {loading === pkg.credits ? 'Processing...' : 'Purchase'}
                </Button>
                <div className="mt-4 space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>${(pkg.price / pkg.credits).toFixed(2)} per credit</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    <span>Never expires</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>How Credits Work</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold mb-2">Download Premium Assets</h3>
            <p className="text-muted-foreground">
              Use credits to download premium assets. Each premium asset costs between 1-10 credits.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">Free Assets</h3>
            <p className="text-muted-foreground">
              Free assets don&apos;t require any credits and can be downloaded unlimited times.
            </p>
          </div>
          <div>
            <h3 className="font-semibold mb-2">No Expiration</h3>
            <p className="text-muted-foreground">
              Your credits never expire and can be used anytime.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
