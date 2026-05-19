# Devlynix | Code. Ship. Dominate.

Check it out: https://devlynix.xyz

## 🛠️ Tech Stack
- **Framework**: Next.js 15+ (App Router)
- **Auth**: Clerk Authentication
- **Styling**: Tailwind CSS V4
- **Icons**: Lucide React
- **Animations**: CSS Keyframes & Framer Motion

## 🚀 Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Environment Setup
Create a `.env.local` file in the root and add your Clerk credentials:
```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

## 📂 Modular Architecture
This project uses a modular structure for maximum scalability. Refer to `structure.md` for a full breakdown.
- **Marketing**: `src/app/(marketing)/` (Public pages)
- **Builder's Hub**: `src/app/(protected)/hub/` (Dashboard)
- **Components**: `src/components/sections/` (UI Blocks)

## 📦 Deployment & Version Control (GitHub)

When pushing your code to GitHub for Vercel deployment, follow these strict guidelines to ensure security and build success.

### ✅ DO PUSH (Required)
These files constitute the **Source Code** and **Configuration** needed for Vercel to build your app:
- `src/` - All pages, components, hooks, and logic.
- `public/` - All images, SVGs, and static assets.
- `package.json` & `package-lock.json` - Tells Vercel which dependencies to install.
- `next.config.ts` - Next.js configuration.
- `tsconfig.json` - TypeScript rules.
- `tailwind.config.ts` & `postcss.config.mjs` - Styling configurations.
- `structure.md` - Documentation for future reference.

### ❌ DO NOT PUSH (Security Risk)
These files are either auto-generated or contain **Sensitive Secrets**. They are already listed in `.gitignore`:
- `node_modules/` - (Auto-installed during build). Pushing this makes your repo massive and slow.
- `.next/` - (Local build cache). Vercel builds its own fresh version.
- `.env.local` - **CRITICAL SECURITY RISK.** Never push your Clerk Secret Keys to GitHub.
- `.DS_Store` - macOS system files.

---

## 🛠️ Vercel Deployment Setup

Since you are **NOT** pushing your `.env.local` file, you must add your Clerk keys manually in the Vercel Dashboard:

1.  Go to your project in [Vercel](https://vercel.com).
2.  Navigate to **Settings > Environment Variables**.
3.  Add the following keys exactly as they appear in your local file:
    *   `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
    *   `CLERK_SECRET_KEY`
    *   `NEXT_PUBLIC_CLERK_SIGN_IN_URL`
    *   `NEXT_PUBLIC_CLERK_SIGN_UP_URL`
4.  Redeploy your app for the changes to take effect.

---
*Built with passion by the Devlynix Community.*
