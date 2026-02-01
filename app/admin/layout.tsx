import { redirect } from 'next/navigation'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await getServerSession(authOptions)

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/')
  }

  return (
    <div className="min-h-screen bg-muted/50">
      <div className="border-b bg-background">
        <div className="container">
          <div className="flex h-16 items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
              <span className="font-bold">CreativeHub Admin</span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link href="/admin" className="transition-colors hover:text-foreground/80">
                Dashboard
              </Link>
              <Link href="/admin/assets" className="transition-colors hover:text-foreground/80">
                Assets
              </Link>
              <Link href="/admin/upload" className="transition-colors hover:text-foreground/80">
                Upload
              </Link>
              <Link href="/admin/users" className="transition-colors hover:text-foreground/80">
                Users
              </Link>
            </nav>
            <div className="ml-auto">
              <Link href="/">
                <Button variant="ghost" size="sm">
                  Back to Site
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
