export interface Asset {
  id: string
  title: string
  description?: string | null
  imageUrl: string
  fileUrl: string
  fileType: string
  categoryId: string
  isPremium: boolean
  creditCost: number
  downloadCount: number
  createdAt: Date
  updatedAt: Date
  category?: Category
  tags?: Tag[]
}

export interface Category {
  id: string
  name: string
  slug: string
  icon?: string | null
}

export interface Tag {
  id: string
  name: string
}

export interface User {
  id: string
  name?: string | null
  email: string
  credits: number
  role: 'USER' | 'ADMIN'
  image?: string | null
}

export interface Transaction {
  id: string
  type: 'PURCHASE' | 'SPEND' | 'BONUS'
  credits: number
  amount?: number | null
  stripeId?: string | null
  createdAt: Date
}

export interface Download {
  id: string
  userId: string
  assetId: string
  credits: number
  createdAt: Date
  asset?: Asset
}

export interface Favorite {
  id: string
  userId: string
  assetId: string
  createdAt: Date
  asset?: Asset
}
