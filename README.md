# CreativeHub - Creative Assets Platform

A full-featured creative assets marketplace platform similar to Freepik, built with Next.js 14, TypeScript, Prisma, and Stripe.

## 🚀 Features

### User Features
- **Browse & Search**: Explore thousands of creative assets with advanced filtering
- **Asset Categories**: Photos, Vectors, Icons, and more
- **Free & Premium**: Download free assets or use credits for premium content
- **Favorites**: Save assets to your favorites for quick access
- **Download History**: Track all your downloads in one place
- **Credit System**: Purchase credits with Stripe to download premium assets
- **User Dashboard**: Manage your account, credits, and downloads

### Admin Features
- **Asset Management**: Upload and manage assets
- **User Management**: View and manage platform users
- **Statistics Dashboard**: Monitor platform usage and downloads
- **Category Management**: Organize assets into categories

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with JWT
- **Payment**: Stripe for credit purchases
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + shadcn/ui
- **Icons**: Lucide React

## 📋 Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Stripe account (for payments)

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd GTX-1
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/creative_assets?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
```

4. **Set up the database**

```bash
# Push the database schema
npm run db:push

# Seed the database with sample data
npm run db:seed
```

5. **Run the development server**

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📁 Project Structure

```
.
├── app/
│   ├── (auth)/              # Authentication pages (login, register)
│   ├── (main)/              # Public pages (home, browse, search)
│   ├── admin/               # Admin dashboard and management
│   ├── api/                 # API routes
│   └── dashboard/           # User dashboard
├── components/
│   ├── assets/              # Asset-related components
│   ├── layout/              # Layout components (header, footer)
│   └── ui/                  # Reusable UI components
├── lib/
│   ├── auth.ts             # NextAuth configuration
│   ├── prisma.ts           # Prisma client
│   ├── stripe.ts           # Stripe configuration
│   └── utils.ts            # Utility functions
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.ts             # Database seed script
└── types/
    └── index.ts            # TypeScript type definitions
```

## 🔐 Authentication

The platform uses NextAuth.js with credentials provider:

- **User Registration**: Email and password with bcrypt hashing
- **Login**: JWT-based authentication
- **Protected Routes**: Server-side session checks
- **Role-Based Access**: USER and ADMIN roles

### Default Admin Account (from seed)
- Email: `admin@example.com`
- Password: `admin123`

## 💳 Credit System

### How It Works

1. **Free Assets**: Download without credits
2. **Premium Assets**: Require credits (1-10 credits per asset)
3. **Purchase Credits**: Via Stripe checkout

### Credit Packages

| Credits | Price  | Per Credit |
|---------|--------|------------|
| 10      | $9.99  | $0.99      |
| 50      | $39.99 | $0.80      |
| 100     | $69.99 | $0.70      |
| 250     | $149.99| $0.60      |

### Download Flow

1. User clicks "Download" on an asset
2. System checks if asset is premium
3. If premium, checks user's credit balance
4. Deducts credits and records transaction
5. Allows file download

## 🎨 Key Components

### Asset Components

- **AssetCard**: Displays asset thumbnail, title, and metadata
- **AssetGrid**: Responsive grid layout for assets
- **AssetFilters**: Filter assets by category, type, and price
- **AssetDetailClient**: Full asset detail view with download

### Layout Components

- **Header**: Navigation, search bar, credits display, user menu
- **Footer**: Links and category navigation

## 📡 API Routes

### Public Routes
- `GET /api/assets` - List assets with filters
- `GET /api/search` - Search assets

### Authenticated Routes
- `POST /api/download` - Download asset
- `GET /api/favorites` - List user favorites
- `POST /api/favorites` - Toggle favorite
- `GET /api/credits` - Get user credits
- `POST /api/credits` - Purchase credits
- `PATCH /api/user/update` - Update profile

### Admin Routes
- `POST /api/admin/assets` - Create asset
- `GET /api/admin/categories` - List categories

### Webhooks
- `POST /api/stripe/webhook` - Handle Stripe events

## 🔄 Stripe Integration

### Setup Webhook

1. Go to Stripe Dashboard > Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/stripe/webhook`
3. Select event: `checkout.session.completed`
4. Copy webhook secret to `.env`

### Test Mode

Use Stripe test cards:
- Success: `4242 4242 4242 4242`
- Any future expiry date
- Any 3-digit CVC

## 🗄️ Database Schema

### Main Models

- **User**: User accounts with credits and role
- **Asset**: Digital assets with category and tags
- **Category**: Asset categories
- **Tag**: Asset tags
- **Download**: Download history
- **Favorite**: User favorites
- **Transaction**: Credit transactions

## 🚀 Deployment

### Build

```bash
npm run build
```

### Environment Variables

Ensure all environment variables are set in production:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXTAUTH_SECRET`: Random secret for JWT
- `NEXTAUTH_URL`: Production URL
- `STRIPE_SECRET_KEY`: Live Stripe key
- `STRIPE_WEBHOOK_SECRET`: Webhook signing secret

### Database Migration

```bash
npx prisma migrate deploy
```

## 📝 Development Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run db:push      # Push schema to database
npm run db:seed      # Seed database
npm run db:studio    # Open Prisma Studio
```

## 🎯 User Flows

### New User Journey

1. Register account (gets 10 free credits)
2. Browse assets
3. Download free assets
4. Purchase more credits for premium assets

### Premium Asset Download

1. Browse/search for asset
2. View asset details
3. Click "Download" button
4. System checks credits
5. Deducts credits if sufficient
6. Downloads file

### Admin Workflow

1. Login with admin account
2. Access admin panel
3. Upload new assets
4. Manage existing assets
5. View user statistics

## 🔒 Security Features

- Password hashing with bcrypt
- JWT-based authentication
- CSRF protection with NextAuth
- Role-based authorization
- Stripe webhook signature verification
- SQL injection protection via Prisma

## 🐛 Troubleshooting

### Database Connection Issues
- Verify `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Check firewall settings

### Stripe Webhook Not Working
- Verify webhook secret is correct
- Check webhook URL is accessible
- Review Stripe dashboard logs

### Build Errors
- Clear `.next` folder
- Delete `node_modules` and reinstall
- Check TypeScript errors

## 📄 License

[Add your license here]

## 🤝 Contributing

[Add contribution guidelines here]

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and TypeScript
