import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('Starting seed...')

  // Create admin user
  const adminPassword = await bcrypt.hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: adminPassword,
      name: 'Admin User',
      credits: 1000,
      role: 'ADMIN',
    },
  })

  console.log('Admin user created:', admin.email)

  // Create regular users
  const userPassword = await bcrypt.hash('user123', 12)
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: userPassword,
      name: 'Test User',
      credits: 50,
      role: 'USER',
    },
  })

  console.log('Test user created:', user.email)

  // Create categories
  const categories = [
    { name: 'Vectors', slug: 'vectors', icon: '📐' },
    { name: 'Icons', slug: 'icons', icon: '🎨' },
    { name: 'Photos', slug: 'photos', icon: '📷' },
    { name: 'Templates', slug: 'templates', icon: '📄' },
    { name: 'Mockups', slug: 'mockups', icon: '🖼️' },
    { name: 'Illustrations', slug: 'illustrations', icon: '✨' },
  ]

  for (const category of categories) {
    await prisma.category.upsert({
      where: { slug: category.slug },
      update: {},
      create: category,
    })
  }

  console.log('Categories created')

  // Create tags
  const tagNames = [
    'abstract', 'business', 'design', 'creative', 'modern', 
    'minimal', 'colorful', 'technology', 'nature', 'art',
    'professional', 'elegant', 'vintage', 'gradient', 'geometric',
    'flat', 'corporate', 'social media', 'marketing', 'branding'
  ]

  for (const tagName of tagNames) {
    await prisma.tag.upsert({
      where: { name: tagName },
      update: {},
      create: { name: tagName },
    })
  }

  console.log('Tags created')

  // Get categories and tags for assets
  const vectorCategory = await prisma.category.findUnique({ where: { slug: 'vectors' } })
  const iconCategory = await prisma.category.findUnique({ where: { slug: 'icons' } })
  const photoCategory = await prisma.category.findUnique({ where: { slug: 'photos' } })
  const templateCategory = await prisma.category.findUnique({ where: { slug: 'templates' } })
  const mockupCategory = await prisma.category.findUnique({ where: { slug: 'mockups' } })
  const illustrationCategory = await prisma.category.findUnique({ where: { slug: 'illustrations' } })

  const allTags = await prisma.tag.findMany()

  // Sample assets
  const sampleAssets = [
    // Vectors (Free and Premium)
    {
      title: 'Abstract Wave Background',
      description: 'Modern abstract wave background perfect for web design',
      imageUrl: 'https://images.unsplash.com/photo-1557672172-298e090bd0f1?w=800',
      fileUrl: '/downloads/abstract-wave.svg',
      fileType: 'SVG',
      categoryId: vectorCategory!.id,
      isPremium: false,
      creditCost: 0,
      tags: { connect: [{ name: 'abstract' }, { name: 'modern' }] },
    },
    {
      title: 'Business Infographic Set',
      description: 'Complete set of business infographic elements',
      imageUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800',
      fileUrl: '/downloads/business-infographic.svg',
      fileType: 'SVG',
      categoryId: vectorCategory!.id,
      isPremium: true,
      creditCost: 3,
      tags: { connect: [{ name: 'business' }, { name: 'professional' }] },
    },
    {
      title: 'Geometric Pattern Pack',
      description: 'Collection of geometric patterns',
      imageUrl: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=800',
      fileUrl: '/downloads/geometric-patterns.svg',
      fileType: 'SVG',
      categoryId: vectorCategory!.id,
      isPremium: true,
      creditCost: 2,
      tags: { connect: [{ name: 'geometric' }, { name: 'colorful' }] },
    },
    // Icons
    {
      title: 'Social Media Icons',
      description: 'Modern social media icon set',
      imageUrl: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?w=800',
      fileUrl: '/downloads/social-icons.svg',
      fileType: 'SVG',
      categoryId: iconCategory!.id,
      isPremium: false,
      creditCost: 0,
      tags: { connect: [{ name: 'social media' }, { name: 'flat' }] },
    },
    {
      title: 'Business & Office Icons',
      description: 'Professional business icon collection',
      imageUrl: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=800',
      fileUrl: '/downloads/business-icons.svg',
      fileType: 'SVG',
      categoryId: iconCategory!.id,
      isPremium: true,
      creditCost: 2,
      tags: { connect: [{ name: 'business' }, { name: 'corporate' }] },
    },
    // Photos
    {
      title: 'Mountain Landscape',
      description: 'Beautiful mountain landscape photography',
      imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800',
      fileUrl: '/downloads/mountain-landscape.jpg',
      fileType: 'JPG',
      categoryId: photoCategory!.id,
      isPremium: false,
      creditCost: 0,
      tags: { connect: [{ name: 'nature' }, { name: 'art' }] },
    },
    {
      title: 'Modern Office Space',
      description: 'Professional modern office interior',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800',
      fileUrl: '/downloads/office-space.jpg',
      fileType: 'JPG',
      categoryId: photoCategory!.id,
      isPremium: true,
      creditCost: 3,
      tags: { connect: [{ name: 'business' }, { name: 'professional' }] },
    },
    {
      title: 'Creative Workspace',
      description: 'Inspiring creative workspace setup',
      imageUrl: 'https://images.unsplash.com/photo-1484480974693-6ca0a78fb36b?w=800',
      fileUrl: '/downloads/creative-workspace.jpg',
      fileType: 'JPG',
      categoryId: photoCategory!.id,
      isPremium: true,
      creditCost: 2,
      tags: { connect: [{ name: 'creative' }, { name: 'design' }] },
    },
    // Templates
    {
      title: 'Business Card Template',
      description: 'Modern business card design template',
      imageUrl: 'https://images.unsplash.com/photo-1589330273594-fade1ee91647?w=800',
      fileUrl: '/downloads/business-card.psd',
      fileType: 'PSD',
      categoryId: templateCategory!.id,
      isPremium: true,
      creditCost: 5,
      tags: { connect: [{ name: 'business' }, { name: 'branding' }] },
    },
    {
      title: 'Social Media Post Templates',
      description: 'Instagram and Facebook post templates',
      imageUrl: 'https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?w=800',
      fileUrl: '/downloads/social-templates.psd',
      fileType: 'PSD',
      categoryId: templateCategory!.id,
      isPremium: true,
      creditCost: 4,
      tags: { connect: [{ name: 'social media' }, { name: 'marketing' }] },
    },
    // Mockups
    {
      title: 'iPhone Mockup',
      description: 'High-quality iPhone mockup',
      imageUrl: 'https://images.unsplash.com/photo-1592286927505-f4576c1e0809?w=800',
      fileUrl: '/downloads/iphone-mockup.psd',
      fileType: 'PSD',
      categoryId: mockupCategory!.id,
      isPremium: true,
      creditCost: 5,
      tags: { connect: [{ name: 'technology' }, { name: 'modern' }] },
    },
    {
      title: 'Laptop Mockup',
      description: 'Professional laptop screen mockup',
      imageUrl: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800',
      fileUrl: '/downloads/laptop-mockup.psd',
      fileType: 'PSD',
      categoryId: mockupCategory!.id,
      isPremium: false,
      creditCost: 0,
      tags: { connect: [{ name: 'technology' }, { name: 'professional' }] },
    },
    // Illustrations
    {
      title: 'Character Illustration Set',
      description: 'Diverse character illustrations',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      fileUrl: '/downloads/characters.ai',
      fileType: 'AI',
      categoryId: illustrationCategory!.id,
      isPremium: true,
      creditCost: 4,
      tags: { connect: [{ name: 'creative' }, { name: 'colorful' }] },
    },
    {
      title: 'Minimalist Landscape',
      description: 'Minimalist landscape illustration',
      imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800',
      fileUrl: '/downloads/minimalist-landscape.ai',
      fileType: 'AI',
      categoryId: illustrationCategory!.id,
      isPremium: false,
      creditCost: 0,
      tags: { connect: [{ name: 'minimal' }, { name: 'nature' }] },
    },
  ]

  for (const asset of sampleAssets) {
    await prisma.asset.create({
      data: asset,
    })
  }

  console.log('Sample assets created')
  console.log('Seed completed!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
