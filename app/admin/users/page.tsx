import { prisma } from '@/lib/prisma'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { formatDate } from '@/lib/utils'

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: any
}) {
  const page = parseInt(searchParams.page || '1')
  const limit = 20

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      include: {
        _count: {
          select: {
            downloads: true,
            favorites: true,
            transactions: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.user.count(),
  ])

  const totalPages = Math.ceil(total / limit)

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold mb-2">Manage Users</h1>
        <p className="text-muted-foreground">
          {total} total users
        </p>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="border-b bg-muted/50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium">User</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Role</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Credits</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Downloads</th>
                  <th className="px-6 py-3 text-left text-sm font-medium">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-muted/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={user.role === 'ADMIN' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-sm">{user.credits}</td>
                    <td className="px-6 py-4 text-sm">{user._count.downloads}</td>
                    <td className="px-6 py-4 text-sm">{formatDate(user.createdAt)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {page > 1 && (
            <a href={`?page=${page - 1}`} className="px-4 py-2 border rounded-md hover:bg-muted">
              Previous
            </a>
          )}
          <span className="flex items-center px-4 text-sm text-muted-foreground">
            Page {page} of {totalPages}
          </span>
          {page < totalPages && (
            <a href={`?page=${page + 1}`} className="px-4 py-2 border rounded-md hover:bg-muted">
              Next
            </a>
          )}
        </div>
      )}
    </div>
  )
}
