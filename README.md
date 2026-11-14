# StudyTrack — Smart Student Productivity & Study Tracker

> **Study smarter. Track your progress. Reach your goals.**

**StudyTrack** is a production-ready, full-stack student productivity and study tracking web platform built with **Next.js 14**, **React**, **TypeScript**, **Tailwind CSS**, **Prisma ORM**, **PostgreSQL**, and **NextAuth.js**.

Designed with a clean, modern **Pink + White** visual identity (`#EC4899`, `#DB2777`, `#FCE7F3`, `#FFF7FB`, `#FFFFFF`), StudyTrack empowers students to maintain focus, build study streaks, manage syllabi, and conquer their exams through spaced repetition and real-time analytics.

---

## 🌟 Key Features

1. **High-Precision Study Timer & Pomodoro**
   - Timestamp-based elapsed duration calculation (accurate across background tab navigation).
   - Normal Stopwatch mode and Pomodoro mode (25/5 min, 50/10 min, and custom intervals).
   - Harmonic audio chime upon interval and session completion.
   - Session completion modal to record: What you studied, What you learned, What you understood, Doubts/doubts to revise, difficulty level, and personal notes.

2. **Interactive Monthly Study Calendar**
   - Monthly study calendar (with November 2026 default).
   - Heatmap visual indicator in pink intensity (None, Low, Medium, Goal Reached).
   - Interactive date inspector side-panel displaying total study time, session logs, subjects studied, tasks completed, and notes taken.

3. **Curriculum & Subject Architecture**
   - Create, edit, and delete subjects with custom color tags, icons, target hours, and descriptions.
   - Comprehensive subject progress tracking with syllabus completion percentages.

4. **Topic Mastery & Understanding Tracker**
   - Detailed topic tracking per subject with understanding slider (0% to 100%).
   - Automatic detection of **Weak Topics** (< 50% understanding) that need urgent revision.

5. **Spaced Repetition & Revision System**
   - Timed spaced intervals: Tomorrow (1 day), 3 days, 1 week (7 days), 15 days, 30 days, or custom dates.
   - Visual badges for "Due Today" and "Overdue" revisions.

6. **Student Task Manager**
   - Manage assignments, problem sets, and revision tasks.
   - High, Medium, and Low priority sorting with due dates and subject links.

7. **Markdown Study Notes System**
   - Formatted notes editor with support for headings, bold/italic, lists, and code blocks.
   - Instant multi-field search across titles, note content, and tags.

8. **Study Analytics & Performance**
   - Interactive Recharts visualization:
     - Daily study hours with target goal lines.
     - Subject distribution donut / pie chart with percentage breakdown.
     - 7-day, 30-day, and 3-month timeline filters.

9. **Study Streaks & Daily Goals**
   - Real streak calculation engine based on consecutive active study days meeting daily targets.
   - Celebratory visual feedback and progress bars when daily study targets are reached.

10. **Academic Badges & Achievements**
    - Automatically unlocks achievements (First Session, 7-Day Streak, 30-Day Streak, 10h, 50h, 100h Studied, Century of Sessions, etc.) based on real database records.

11. **Data Export**
    - One-click `.CSV` export of complete study history for reporting or backups.

---

## 🛠️ Tech Stack

- **Framework:** [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components)
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) (Pink + White signature design tokens)
- **Database:** [PostgreSQL](https://www.postgresql.org/) (Compatible with [Neon PostgreSQL](https://neon.tech/))
- **ORM:** [Prisma](https://www.prisma.io/)
- **Authentication:** [NextAuth.js](https://next-auth.js.org/) with secure bcrypt password hashing and JWT sessions
- **Charts:** [Recharts](https://recharts.org/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Validation:** [Zod](https://zod.dev/)
- **Audio & Animations:** Web Audio API & `canvas-confetti`

---

## 🚀 Quick Start & Installation

### 1. Prerequisites
- **Node.js:** v18+ (v20+ recommended)
- **npm:** v9+
- A PostgreSQL database (e.g. free [Neon PostgreSQL](https://neon.tech/) instance or local PostgreSQL)

### 2. Clone and Install Dependencies
```bash
cd "D:\Web development\PROJECT\SSC Platfrom"
npm install
```

### 3. Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update your `.env` with your PostgreSQL database URL and NextAuth secret:
```env
DATABASE_URL="postgresql://username:password@ep-cool-db.us-east-2.aws.neon.tech/studytrack?sslmode=require"
NEXTAUTH_SECRET="your_secure_random_string_here"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Setup & Migrations
Generate Prisma client and push the schema to PostgreSQL:
```bash
npx prisma generate
npx prisma db push
```

### 5. Seed Database (Optional Demo Data)
To populate the database with realistic sample subjects (JavaScript, React, Mathematics, DBMS), topics, past sessions, notes, and tasks:
```bash
npm run db:seed
```
**Default Demo Credentials:**
- **Email:** `demo@example.com`
- **Password:** `password123`

### 6. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Production Build & Vercel Deployment

### Build Locally
```bash
npm run build
```

### Deploying to Vercel with Neon PostgreSQL (Free Tier)
1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial StudyTrack commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/studytrack.git
   git push -u origin main
   ```
2. **Create a Free PostgreSQL Database on Neon:**
   - Sign up at [neon.tech](https://neon.tech).
   - Create a project (e.g. `studytrack-db`).
   - Copy the connection string.
3. **Import Project to Vercel:**
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Select your GitHub repository.
   - In **Environment Variables**, add:
     - `DATABASE_URL`: Your Neon PostgreSQL connection string.
     - `NEXTAUTH_SECRET`: A secure 32+ character random string.
     - `NEXTAUTH_URL`: `https://your-app.vercel.app`
4. **Deploy:**
   - Click **Deploy**. Vercel will build and deploy the Next.js application.
   - Run `npx prisma db push` (or run a migration) from your local terminal pointing to your Neon database URL.

---

## 📁 Project Architecture

```
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   ├── register/page.tsx
│   │   └── forgot-password/page.tsx
│   ├── (dashboard)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── timer/page.tsx
│   │   ├── calendar/page.tsx
│   │   ├── subjects/
│   │   │   ├── page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── topics/page.tsx
│   │   ├── notes/page.tsx
│   │   ├── tasks/page.tsx
│   │   ├── analytics/page.tsx
│   │   ├── timeline/page.tsx
│   │   ├── revisions/page.tsx
│   │   ├── achievements/page.tsx
│   │   ├── profile/page.tsx
│   │   └── settings/page.tsx
│   ├── api/
│   │   ├── auth/
│   │   ├── dashboard/
│   │   ├── subjects/
│   │   ├── topics/
│   │   ├── study-sessions/
│   │   ├── tasks/
│   │   ├── notes/
│   │   ├── calendar/
│   │   ├── analytics/
│   │   ├── timeline/
│   │   ├── revisions/
│   │   ├── achievements/
│   │   ├── profile/
│   │   └── export/
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx            # Landing page
├── components/
│   ├── ui/                 # Reusable UI primitives (Button, Card, Modal, Input, Progress, Badge)
│   ├── navigation/         # Sidebar, Navbar, MobileNav
│   ├── timer/              # StudyTimer, SessionCompleteModal
│   ├── calendar/           # StudyCalendar
│   ├── timeline/           # StudyTimeline
│   ├── analytics/          # AnalyticsCharts
│   ├── dashboard/          # DailyGoalCard, StatCards, RecentSessions, WeakTopicsCard, QuickActions
│   └── common/             # EmptyState
├── lib/
│   ├── prisma.ts           # Singleton Prisma client
│   ├── auth.ts             # NextAuth configuration & Credentials provider
│   ├── session.ts          # Server auth helpers
│   ├── validations.ts      # Zod validation schemas
│   ├── achievements.ts     # Real achievement evaluation logic
│   └── utils.ts            # Time, streak, and date helpers
├── prisma/
│   ├── schema.prisma       # Complete relational database models
│   └── seed.ts             # Development seed script
└── types/
    └── next-auth.d.ts      # TypeScript NextAuth session augmentations
```

---

## 🔒 Security Best Practices
- **Password Hashing:** Passwords are never stored in plain text; they are hashed with `bcryptjs`.
- **Server Identity Protection:** Authenticated user identity (`userId`) is always derived from server session tokens (`getServerSession`), preventing spoofing.
- **SQL Injection Safety:** All database queries utilize Prisma ORM with parameterized execution.
- **Input Sanitization:** All payload mutations pass through strict `zod` schemas.

---

## 📄 License
Open source and released under the [MIT License](LICENSE).
