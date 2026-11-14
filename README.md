# StudyTrack — Smart Student Productivity & Study Tracker

<div align="center">
  <img src="public/icon.png" alt="StudyTrack Logo" width="100" height="100" />
  
  # StudyTrack Platform
  **Study smarter. Track your progress. Authenticate your achievements.**

  [![Next.js](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
  [![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
  [![Neon PostgreSQL](https://img.shields.io/badge/Neon-PostgreSQL-00E599?style=for-the-badge&logo=postgresql)](https://neon.tech/)
  [![Vercel](https://img.shields.io/badge/Vercel-Deployed-000000?style=for-the-badge&logo=vercel)](https://study-track-drab.vercel.app)
  [![License: MIT](https://img.shields.io/badge/License-MIT-pink.svg?style=for-the-badge)](LICENSE)

  <p align="center">
    <a href="https://study-track-drab.vercel.app"><strong>🌐 Live Web App</strong></a> •
    <a href="https://study-track-drab.vercel.app/verify"><strong>🛡️ Public Verification Portal</strong></a> •
    <a href="https://study-track-drab.vercel.app/verify?id=ST-REC-20261114-CHAN-FM71"><strong>📜 Sample Certificate</strong></a> •
    <a href="https://github.com/chandan966/study-track-"><strong>📦 GitHub Repository</strong></a>
  </p>
</div>

---

## 📖 Overview

**StudyTrack** is a modern full-stack academic productivity platform designed for students preparing for competitive examinations (such as SSC CGL, UPSC, GATE, and Tech Aspirants) as well as university degrees.

Designed with a clean, high-contrast **Pink & White** visual identity (`#EC4899`, `#DB2777`, `#FCE7F3`, `#FFF7FB`, `#FFFFFF`), StudyTrack pairs a precision study timer and spaced repetition engine with an **Official Academic Report Card & Verification System**. Students can log validated study sessions, track goal completion rates, and generate cryptographically hashed report cards that parents, teachers, and mentors can verify online.

---

## 🌟 Key Features

### 1. 📜 Official Single-Page Academic Report Card & Certificate
- **Single-Page A4 Guarantee:** Proportioned strictly for standard A4 (`210mm × 297mm`) format with proportional auto-scaling so it never overflows or breaks across pages.
- **Ultra-Crisp PDF Export:** Client-side 300 DPI high-resolution vector/raster PDF download via `jsPDF` and `html2canvas` with device-independent desktop rendering locks.
- **Authentic Diploma Styling:** Classical academic double-frame borders (`#EC4899` / `#FBCFE8`), official circular **STUDYTRACK VERIFIED** seal, candidate profile details, and grade badges.
- **Executive Handwritten CEO Signature:** Features the authentic cursive digital signature of **Chandan Ghanghav (`CEO, StudyTrack`)**.
- **Cryptographic Record HASH:** Every certificate includes an immutable, unique ledger ID (e.g. `ST-REC-20261114-CHAN-FM71`).

### 2. 🛡️ Public Parent & Institutional Verification Portal (`/verify`)
- **Direct Online Verification:** Parents, guardians, and mentors can enter any student's Certificate ID/HASH to authenticate real study logs directly from the cloud database.
- **100% Authentic Status:** Instantly validates total study time, completion percentages, letter grades (`A+`, `A`, `B`), session breakdowns, and subject distribution.
- **Instant PDF & Print:** Mentors can directly print or download the verified certificate from the public portal without logging in.

### 3. ⏱️ Precision Study Timer & Pomodoro Engine
- **Accurate Elapsed Time Tracking:** Real timestamp-based interval calculations that never lag or desynchronize when navigating between browser tabs.
- **Dual Modes:** Continuous Stopwatch mode or customizable Pomodoro sessions (25/5 min, 50/10 min, or custom intervals).
- **Post-Session Reflection Modal:** Capture subject, topic, difficulty level, key learnings, understood concepts, and revision notes immediately upon completion.
- **Audio Chimes & Confetti:** Web Audio API sound alerts and confetti celebratory feedback on goal completion.

### 4. 📅 Interactive Monthly Study Calendar & Heatmap
- **Visual Intensity Heatmap:** Pink color-scaled days indicating study volume (`None`, `Low`, `Medium`, `Goal Reached`).
- **Interactive Day Inspector:** Click any calendar date to view the exact subjects studied, session intervals, and tasks completed on that day.

### 5. 📚 Curriculum, Subject & Topic Architecture
- **Syllabus Management:** Organize subjects with custom hex color codes, target study hours, and icon badges.
- **Topic Understanding Sliders:** Track topic mastery from 0% to 100%.
- **Weak Topics Detector:** Automatically surfaces topics with < 50% understanding for focused revision.

### 6. 🔁 Spaced Repetition & Revision System
- Automated revision intervals: **Tomorrow (1 Day)**, **3 Days**, **1 Week (7 Days)**, **15 Days**, and **30 Days**.
- Visual indicators for *"Due Today"* and *"Overdue"* topics.

### 7. 📝 Markdown Study Notes & Task Management
- Full-featured Markdown notes editor with headings, bold/italics, bulleted lists, and code blocks.
- Priority-ranked student task manager with due dates and subject links.

### 8. 📊 Study Analytics & Performance Charts
- Interactive data visualizations powered by **Recharts**:
  - Daily study hours vs. target goal lines.
  - Subject distribution donut charts with percentage share.
  - 7-day, 30-day, and 90-day timeline filters.

### 9. 🏆 Academic Streaks & Automated Achievements
- Automatic streak counter based on consecutive active study days meeting daily goals.
- Unlocks badges: *First Session*, *7-Day Streak*, *30-Day Streak*, *Century of Sessions*, *50 Hours Master*, and more.

---

## 🛠️ Tech Stack & Architecture

| Layer | Technologies |
|---|---|
| **Frontend Framework** | [Next.js 14](https://nextjs.org/) (App Router, Server & Client Components) |
| **Language** | [TypeScript 5.6](https://www.typescriptlang.org/) |
| **Styling** | [Tailwind CSS 3.4](https://tailwindcss.com/) (Pink & White Design System) |
| **Database** | [Neon PostgreSQL](https://neon.tech/) (Serverless Cloud Database) |
| **ORM** | [Prisma ORM 5.22](https://www.prisma.io/) |
| **Authentication** | [NextAuth.js 4](https://next-auth.js.org/) (Credentials Provider, JWT, bcryptjs) |
| **Charts** | [Recharts 2.13](https://recharts.org/) |
| **PDF & Canvas** | [jsPDF 4.2](https://github.com/parallax/jsPDF) & [html2canvas 1.4](https://html2canvas.hertzen.com/) |
| **Icons & UI** | [Lucide React](https://lucide.dev/) & [canvas-confetti](https://www.npmjs.com/package/canvas-confetti) |
| **Hosting & CI/CD** | [Vercel](https://vercel.com/) |

---

## 📁 Directory Structure

```
study-track/
├── app/
│   ├── (auth)/                    # Authentication routes (login, register, forgot-password)
│   ├── (dashboard)/               # Protected student workspace
│   │   ├── layout.tsx             # Shared dashboard shell with Sidebar, Navbar & Footer
│   │   ├── dashboard/page.tsx     # Student home with metrics & quick actions
│   │   ├── timer/page.tsx         # Stopwatch & Pomodoro study timer
│   │   ├── report-card/page.tsx   # Report card viewer & certificate generator
│   │   ├── calendar/page.tsx      # Heatmap study calendar & day inspector
│   │   ├── subjects/              # Subjects & syllabus management
│   │   ├── tasks/page.tsx         # Task manager with priorities & deadlines
│   │   ├── notes/page.tsx         # Markdown study notes
│   │   ├── analytics/page.tsx     # Recharts study time & distribution analytics
│   │   ├── revisions/page.tsx     # Spaced repetition revision tracker
│   │   ├── achievements/page.tsx  # Unlocked trophies & streak badges
│   │   ├── profile/page.tsx       # Student profile & academic targets
│   │   └── settings/page.tsx      # User settings & preferences
│   ├── api/                       # RESTful backend API endpoints
│   │   ├── auth/                  # NextAuth handler & registration
│   │   ├── report-card/           # Report card data aggregation API
│   │   ├── verify/                # Public certificate verification API
│   │   ├── study-sessions/        # Study session logging & history
│   │   ├── subjects/              # Subject CRUD APIs
│   │   ├── tasks/                 # Task management APIs
│   │   └── notes/                 # Notes APIs
│   ├── verify/page.tsx            # Public parent & mentor certificate verification portal
│   ├── globals.css                # Global CSS & dedicated A4 @media print styles
│   ├── layout.tsx                 # Root layout with metadata & favicon links
│   └── page.tsx                   # Public landing page with feature showcase & footer
├── components/
│   ├── report-card/
│   │   ├── ReportCardDocument.tsx # Pixel-perfect single-page A4 certificate & PDF engine
│   │   └── ReportCardModal.tsx    # Modal wrapper for quick report card previews
│   ├── navigation/                # Sidebar, Topbar, and Mobile Navigation
│   ├── timer/                     # StudyTimer component & session reflection modal
│   ├── calendar/                  # StudyCalendar heatmap component
│   └── ui/                        # Reusable buttons, cards, modals, and badges
├── lib/
│   ├── prisma.ts                  # Prisma client singleton
│   ├── auth.ts                    # NextAuth credentials & session configuration
│   ├── signature.ts               # Embedded Base64 CEO handwritten signature
│   └── utils.ts                   # Formatting, date, and calculation helpers
├── prisma/
│   ├── schema.prisma              # Relational models (User, Subject, Topic, Session, Certificate)
│   ├── seed.ts                    # Demo database seeder
│   └── seedCertificates.ts        # Verified certificates seeder
└── public/
    ├── favicon.ico                # Multi-resolution StudyTrack Verified seal
    ├── icon.png                   # 512x512 app icon
    └── apple-touch-icon.png       # iOS apple touch icon
```

---

## 🚀 Getting Started

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher (v20+ recommended)
- **npm:** v9.0.0 or higher
- A PostgreSQL database (e.g. free cloud database from [Neon](https://neon.tech/))

### 2. Clone the Repository
```bash
git clone https://github.com/chandan966/study-track-.git
cd study-track-
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
# Neon PostgreSQL Connection String
DATABASE_URL="postgresql://username:password@ep-your-db.us-east-2.aws.neon.tech/neondb?sslmode=require"

# NextAuth Authentication Secrets
NEXTAUTH_SECRET="your-ultra-secure-32-character-random-secret"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Setup Database Schema & Seed Data
```bash
# Push schema to PostgreSQL database
npx prisma db push

# (Optional) Seed demo user, subjects, sessions, and sample verified certificate
npm run db:seed
npx tsx prisma/seedCertificates.ts
```

**Default Demo Credentials:**
- **Email:** `demo@example.com`
- **Password:** `password123`
- **Sample Certificate ID:** `ST-REC-20261114-CHAN-FM71`

### 6. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🚢 Deployment to Vercel & Neon PostgreSQL

### 1. Push Code to GitHub
```bash
git add .
git commit -m "Deploy StudyTrack"
git push origin main
```

### 2. Connect to Vercel
1. Log in to [Vercel](https://vercel.com) and click **"Add New Project"**.
2. Select your repository `study-track-`.
3. In **Environment Variables**, add:
   - `DATABASE_URL`: Your Neon PostgreSQL pooled connection string.
   - `NEXTAUTH_SECRET`: A generated random secret.
   - `NEXTAUTH_URL`: `https://study-track-drab.vercel.app` (or your custom domain).
4. Click **Deploy**. Vercel will build and launch your production application.

---

## 🛡️ Security & Integrity

- **Server-Side Authorization:** All protected endpoints strictly verify JWT sessions via `getServerSession(authOptions)`.
- **Password Protection:** Cryptographic password hashing powered by `bcryptjs`.
- **SQL Injection Prevention:** Parameterized database interactions through Prisma ORM.
- **Type Safety & Validation:** Comprehensive input parsing using `Zod` schemas.
- **Canvas Tainting Protection:** Inline Base64 Data URL embedding prevents CORS issues during client-side PDF downloads.

---

## 👨‍💻 Creator & Credits

- **Founder & CEO:** Chandan Ghanghav
- **Instagram:** [@trigger_toofan](https://www.instagram.com/trigger_toofan) (`webdevchandna`)
- **GitHub:** [@chandan966](https://github.com/chandan966)
- **Platform:** [StudyTrack](https://study-track-drab.vercel.app)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
Feel free to use, modify, and distribute this platform for your educational projects.
