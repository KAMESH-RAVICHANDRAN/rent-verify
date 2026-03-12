<div align="center">
  <img width="260" alt="AJStudiozLogo" src="https://z-cdn-media.chatglm.cn/files/22e406bf-d9da-46b0-b116-686dd8628a3c.png?auth_key=1864866313-6644253785834aae9f36529c0b483d71-0-57ffec399a7d44d551df1343784df05f" />
</div>

<h1 align="center">RentVerify</h1>

<p align="center">
  <strong>Secure House Rental Verification Platform for India</strong><br>
  Rent with Confidence, Not Guesswork — Powered by AJ STUDIOZ
</p>

<p align="center">
  <a href="https://www.ajstudioz.co.in">
    <img src="https://img.shields.io/badge/Developed%20by-AJ%20STUDIOZ-blue?style=for-the-badge" alt="AJ STUDIOZ">
  </a>
  <a href="https://www.ajstudioz.co.in">
    <img src="https://img.shields.io/badge/Visit-ajstudioz.co.in-green?style=for-the-badge" alt="Website">
  </a>
  <img src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js" alt="Next.js 15">
  <img src="https://img.shields.io/badge/TypeScript-5.9-blue?style=for-the-badge&logo=typescript" alt="TypeScript">
</p>

---

## 🏠 About RentVerify

**RentVerify** is a full-stack rental marketplace that solves India's rental trust problem. Every landlord and tenant is verified through government-backed checks (PAN, EB bill), ensuring a transparent and secure rental experience. Documents are encrypted and auto-deleted after 30 days for privacy.

The platform bridges the gap between landlords and tenants with smart matching, geolocation-based property discovery, and real-time application tracking — all in one unified platform.

---

## ✨ Features

### For Tenants
- **🔍 Property Search:** Search by pincode or area with advanced filters (rent range, property type)
- **🗺️ Map View:** Geolocation-based nearby property discovery with Leaflet/Mapbox maps
- **📋 Applications:** Apply to verified properties and track application status in real time
- **🧑‍💼 Tenant Dashboard:** Manage profile, browse listings, and view application history

### For Landlords
- **🏡 List Property:** Add properties with images, rent, type (1–4 BHK, Studio, Penthouse, Villa), and facilities
- **✅ PAN Verification:** Government-backed PAN verification to build tenant trust
- **📊 Landlord Dashboard:** Track active listings, tenant requests, monthly revenue, and total tenants
- **📬 Tenant Requests:** Review, accept, or reject tenant applications with messaging

### Platform-Wide
- **🔐 Secure Auth:** OTP-based phone authentication + Google OAuth via Firebase
- **🤖 AI Integration:** Google Gemini AI for smart recommendations and interactions
- **🔒 Document Security:** Encrypted document storage with automatic 30-day expiry and deletion
- **🗑️ Auto Cleanup:** Scheduled cron job to purge expired documents from storage and database
- **📱 Fully Responsive:** Modern UI built with TailwindCSS optimised for all screen sizes

---

## 🚀 Run Locally

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- PostgreSQL database
- Firebase project (for Auth)

### Setup Instructions

1. **Clone the repository:**
```bash
git clone <repository-url>
cd land
```

2. **Install dependencies:**
```bash
npm install
```

3. **Set up environment variables:**

Copy `.env.example` to `.env.local` and fill in the values:
```bash
cp .env.example .env.local
```

Required variables:
```env
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/rentverify

# JWT
JWT_SECRET=your_jwt_secret_here

# Firebase
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=

# Google Gemini AI
GEMINI_API_KEY=your_gemini_api_key_here

# Cron Security
CRON_SECRET=your_cron_secret_here
```

4. **Set up the database:**
```bash
npx prisma migrate dev
npx prisma generate
```

5. **Run the development server:**
```bash
npm run dev
```

6. **Open your browser:**

Navigate to `http://localhost:3000`

7. **Build for production:**
```bash
npm run build
npm start
```

---

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 15 (App Router) |
| **Language** | TypeScript 5.9 |
| **UI Library** | React 19 |
| **Styling** | TailwindCSS 4 |
| **Animations** | Motion (Framer Motion) |
| **Icons** | Lucide React |
| **Forms** | React Hook Form + Zod |
| **Maps** | Leaflet / React Leaflet / Mapbox GL |
| **ORM** | Prisma 5 |
| **Database** | PostgreSQL |
| **Auth** | Firebase Auth (Google OAuth) + OTP (JWT) |
| **AI** | Google Gemini AI (`@google/genai`) |
| **JWT** | jose + jsonwebtoken |
| **Password** | bcryptjs |
| **Date Utils** | date-fns |

---

## 🗄️ Database Schema

Core models managed via Prisma + PostgreSQL:

| Model | Description |
|-------|-------------|
| `User` | Base user with phone, role (LANDLORD / TENANT / ADMIN), verification status |
| `LandlordProfile` | PAN number, verification status, address |
| `TenantProfile` | Occupation, family size, rent budget, preferred location & house types |
| `Property` | Listing with address, rent, type, EB bill, coordinates, images |
| `PropertyImage` | Multiple images per property |
| `Application` | Tenant applications with PENDING / REVIEWING / ACCEPTED / REJECTED status |
| `Document` | Encrypted documents with 30-day auto-expiry |
| `Message` | Direct landlord–tenant messaging |
| `VerificationLog` | Audit trail for all verification events |

---

## 🔌 API Routes

| Method | Route | Description |
|--------|-------|-------------|
| `POST` | `/api/auth/otp/send` | Send OTP to phone number |
| `POST` | `/api/auth/otp/verify` | Verify OTP, create session JWT |
| `GET` | `/api/properties` | List/search properties (pincode, type, rent, geolocation) |
| `POST` | `/api/properties` | Create new property (Landlord only) |
| `POST` | `/api/verify/pan` | Verify landlord PAN number |
| `POST` | `/api/cron/cleanup` | Delete expired documents (secured by `CRON_SECRET`) |

---

## 📁 Project Structure

```
app/
├── page.tsx                  # Landing page
├── about/                    # About RentVerify
├── features/                 # Platform features overview
├── how-it-works/             # Onboarding guide
├── list-property/            # Landlord listing info
├── verification/             # Verification process details
├── auth/                     # Login / Signup (OTP + OAuth)
├── search/                   # Property search with map
├── property/[id]/            # Property detail page
├── dashboard/
│   ├── landlord/             # Landlord dashboard + add property
│   └── tenant/               # Tenant dashboard
└── api/                      # Backend API routes
components/                   # Reusable UI components
lib/                          # Auth utils, Prisma client, helpers
prisma/schema.prisma          # Database schema
```

---

## <img src="https://z-cdn-media.chatglm.cn/files/22e406bf-d9da-46b0-b116-686dd8628a3c.png?auth_key=1864866313-6644253785834aae9f36529c0b483d71-0-57ffec399a7d44d551df1343784df05f" width="30" height="30" /> About AJ STUDIOZ

**AJ STUDIOZ** is a pioneering technology company specializing in AI-driven solutions and digital innovation. With a focus on creating impactful applications that solve real-world problems, AJ STUDIOZ combines cutting-edge artificial intelligence with user-centric design.

### Our Mission
To democratize technology and make advanced AI solutions accessible to individuals and organizations that need them most, fostering innovation and real-world impact.

### Connect With Us
- **Website:** [www.ajstudioz.co.in](https://www.ajstudioz.co.in)
- **Portfolio:** Explore our innovative projects and solutions
- **Services:** Custom AI development, Web applications, Mobile apps, and Digital transformation

---

## 📄 License

This project is developed and maintained by **AJ STUDIOZ**. All rights reserved.

---

## 🤝 Contributing

We welcome contributions! If you'd like to contribute to RentVerify or collaborate with AJ STUDIOZ, please visit our website or open an issue.

---

## 📞 Support

For technical support or inquiries:
- **Website:** [www.ajstudioz.co.in](https://www.ajstudioz.co.in)
- **Email:** Contact through website

---

<div align="center">
  <img src="https://z-cdn-media.chatglm.cn/files/22e406bf-d9da-46b0-b116-686dd8628a3c.png?auth_key=1864866313-6644253785834aae9f36529c0b483d71-0-57ffec399a7d44d551df1343784df05f" width="50" height="50" />
  <p><strong>Built with ❤️ by AJ STUDIOZ</strong></p>
  <p>Empowering Trust in India's Rental Market</p>
</div>
