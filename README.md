# Zabug - Next.js E-commerce Template SaaS Landing Page

A complete SaaS landing page for selling Next.js e-commerce templates with Paystack payment integration, coupon system, waitlist management, and affiliate tracking capabilities.

## 🚀 Features

### ✅ Implemented

- **🎨 Modern Landing Page**
  - Responsive hero section with clear value proposition
  - Feature grid showcasing template benefits
  - Pricing section with original/discounted pricing display
  - FAQ section for common questions
  - CTA sections throughout the page
  - Clean, professional UI with Tailwind CSS

- **💳 Paystack Payment Integration**
  - Custom payment form with plan selection
  - Phone number capture for Nigerian market (WhatsApp)
  - Payment initialization and verification
  - Success/failure page flows
  - Shortened payment references for easy tracking
  - Lead storage (JSON + MongoDB dual strategy)

- **🎟️ Advanced Coupon System**
  - Percentage and fixed-amount discounts
  - Usage limits and expiration dates
  - Per-email usage tracking
  - Coupon validation API
  - Automatic usage increment on successful payment
  - Visual price breakdown (original → discount → final)

- **📋 Waitlist Management**
  - Affiliate program waitlist signup
  - Full contact capture (name, email, phone)
  - Email notifications for new signups
  - MongoDB + JSON storage

- **📊 Dashboard Foundation**
  - Referral stats component (prepared for future use)
  - Dashboard shell layout
  - Analytics structure in place

- **📧 Email Notifications**
  - Zeptomail integration (HTTP API)
  - Payment confirmation emails
  - Waitlist confirmation emails
  - Admin notifications

- **💾 Dual Storage Strategy**
  - JSON files for quick development
  - MongoDB for production scalability
  - Automatic dual-write on all operations

### 🔄 Coming Soon (Referral System)

- Referral link generation and tracking
- Commission calculations (20% default)
- Promoter dashboard with earnings
- Payout management system
- Referral analytics and reporting

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4 with App Router & Turbopack
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Payment:** Paystack API
- **Database:** MongoDB + JSON files
- **Email:** Zeptomail HTTP API
- **Deployment:** Ready for AWS Amplify or EC2

## 📦 Project Structure

```
├── src/
│   ├── app/
│   │   ├── (marketing)/        # Landing page
│   │   ├── (dashboard)/        # Dashboard (referral system)
│   │   ├── payment/            # Payment pages
│   │   ├── waitlist/           # Waitlist signup
│   │   ├── demo/               # Demo showcase
│   │   └── api/                # API routes
│   ├── components/
│   │   ├── marketing/          # Landing page components
│   │   ├── analytics/          # Referral stats
│   │   └── layouts/            # Dashboard shell
│   ├── lib/
│   │   ├── paystack.ts         # Payment integration
│   │   ├── coupons.ts          # Coupon logic
│   │   ├── email.ts            # Email sending
│   │   ├── storage.ts          # Data types
│   │   ├── mongodb.ts          # MongoDB client
│   │   └── referrals.ts        # Referral system (WIP)
│   └── types/                  # TypeScript definitions
├── data/
│   ├── coupons.json            # Active coupons
│   ├── leads.json              # Customer leads (gitignored)
│   └── waitlist.json           # Waitlist signups (gitignored)
└── ...config files
```

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- Paystack account
- Zeptomail account (optional)

### Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd nextjs-saas-landing
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   ```bash
   cp .env.example .env.local
   ```

   Update `.env.local` with your credentials:
   ```env
   # Paystack
   PAYSTACK_SECRET_KEY=sk_test_your_key_here
   NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY=pk_test_your_key_here
   
   # MongoDB
   MONGODB_URI=mongodb://localhost:27017/ecommerce_landing
   
   # Email (Zeptomail)
   ZEPTOMAIL_API_TOKEN=your_token
   SMTP_FROM_EMAIL=support@zabug.com
   ADMIN_EMAIL=admin@zabug.com
   
   # App Config
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   NEXT_PUBLIC_REFERRAL_COMMISSION_RATE=0.2
   ```

4. **Run development server:**
   ```bash
   npm run dev
   ```

5. **Open browser:**
   Visit [http://localhost:3000](http://localhost:3000)

## 🎟️ Coupon System Usage

### Sample Coupons (in `data/coupons.json`):
- **TOP5** - 30% off (10 uses max, expires Nov 1, 2025)
- **EARLYBIRD15** - 15% off (5 uses max, expires Oct 31, 2025)

### Coupon Structure:
```json
{
  "code": "LAUNCH50",
  "type": "percentage",
  "value": 50,
  "maxUses": 10,
  "currentUses": 0,
  "expiresAt": "2025-11-30T23:59:59Z",
  "active": true,
  "appliesTo": ["template", "template-setup"],
  "description": "50% launch discount",
  "usedBy": []
}
```

### How It Works:
1. User enters coupon code on payment page
2. System validates code (active, not expired, usage limit, email check)
3. Discount applied to current price (not original)
4. On successful payment, `currentUses` auto-increments
5. Coupon tracks user emails in `usedBy` array

## 💳 Pricing

- **Template Only:**
  - Original: ₦180,000
  - Current: **₦120,000** (displayed with strikethrough)
  - Includes: Source code, documentation, updates

- **Template + Full Setup:**
  - Original: ₦350,000
  - Current: **₦200,000** (featured plan)
  - Includes: Everything + deployment, domain, training, support

## 📧 Email Setup

See [`EMAIL_SETUP.md`](EMAIL_SETUP.md) for detailed Zeptomail configuration.

**Note:** Email notifications currently pending Zeptomail account approval. Error code `TM_3601 AE_101` (Account Blocked) is temporary.

## 💾 MongoDB Setup

See [`MONGODB_SETUP.md`](MONGODB_SETUP.md) for local and Atlas configuration.

**Collections:**
- `leads` - Customer payment records
- `waitlist` - Affiliate program signups
- `referrals` - Future: Referral tracking data

## 🚀 Deployment (AWS)

### Option 1: AWS Amplify (Recommended)
1. Push code to GitHub
2. Connect repo in AWS Amplify console
3. Add environment variables
4. Connect custom domain (zabug.com)
5. Auto-deploy on git push

### Option 2: EC2
1. Launch Ubuntu instance
2. Install Node.js, PM2, Nginx
3. Clone repo and build
4. Configure reverse proxy
5. Set up SSL with Certbot

*See conversation history for detailed deployment steps.*

## 📝 Development Notes

### Cleaned Up (Removed Unused Files):
- ❌ `NotificationPopover.tsx` - WebSocket notifications (not implemented)
- ❌ `useRealtimeNotifications.ts` - Realtime hook (not used)
- ❌ `websocket.ts` - WebSocket client (future feature)
- ❌ `notificationsHub.ts` - Notification server (not integrated)
- ❌ `LaunchTimeline.tsx` - Unused marketing component
- ❌ `TestimonialSection.tsx` - Unused marketing component
- ❌ `src/app/api/paystack/route.ts` - Redundant route

### Active & In Use:
- ✅ All marketing components (Hero, Features, Pricing, FAQ, CTA)
- ✅ Payment flow (initialize, verify, success, failed)
- ✅ Coupon validation system
- ✅ Waitlist signup
- ✅ Lead storage (dual MongoDB + JSON)
- ✅ Email notifications via Zeptomail
- ✅ Referral system foundation (for future use)

### Test Data (Gitignored):
- `data/leads.json` - Contains test payment from development
- `data/waitlist.json` - Contains test waitlist signups
- `.env.local` - Your secret keys and credentials

## 🔐 Security Notes

- All payment keys use test mode by default
- Sensitive data files in `.gitignore`
- MongoDB credentials in environment variables
- Paystack webhook signature verification (TODO)
- Admin routes protected by `ADMIN_KEY`

## 📞 Support

- **Email:** support@zabug.com
- **Demo:** [Coming Soon]
- **Documentation:** See `EMAIL_SETUP.md` and `MONGODB_SETUP.md`

## 📄 License

Proprietary - All rights reserved

---

**Built with ❤️ for Nigerian entrepreneurs** 🇳🇬
