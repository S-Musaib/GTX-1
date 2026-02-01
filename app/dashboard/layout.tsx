import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="border-b bg-background">
        <div className="container">
          <div className="flex h-16 items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">CreativeHub</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/dashboard" className="transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
              <Link href="/dashboard/downloads" className="transition-colors hover:text-foreground/80">
                Downloads
              </Link>
              <Link href="/dashboard/favorites" className="transition-colors hover:text-foreground/80">
                Favorites
              </Link>
              <Link href="/dashboard/credits" className="transition-colors hover:text-foreground/80">
                Credits
              </Link>
              <Link href="/dashboard/settings" className="transition-colors hover:text-foreground/80">
                Settings
              </Link>
            </nav>
            <div className="ml-auto">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Back to Home
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="container py-8">
        {children}
      </div>
    </div>
  )
}
