# DBMS Lab Assignment: Full-Stack Registration & Authentication System

A production-grade, secure **Full-Stack Student Registration & Authentication Web Application** featuring real-time **PostgreSQL 16** database connectivity, **Prisma ORM**, custom **JWT session management via httpOnly cookies**, **bcrypt password hashing**, **Zod validation**, and a dual-engine animation system using **Framer Motion** and **GSAP**.

Built for university DBMS laboratory examinations, viva presentations, and relational database coursework.

---

## 🌟 Key Highlights & Architectural Features

| Feature | Implementation | Description & Security Rationale |
| :--- | :--- | :--- |
| **Framework** | Next.js 14+ (App Router, TypeScript) | Server & Client Components, Route Handlers, Edge Middleware |
| **Database** | PostgreSQL 16 (via Docker Compose) | Relational ACID-compliant DBMS running on port `5432` |
| **ORM** | Prisma 6 | Type-safe migrations, auto-generated client, parameterized SQL |
| **Session** | Custom JWT + `httpOnly` Cookie | Edge-compatible `jose` token signing; immune to client-side XSS |
| **Password Security**| `bcryptjs` (12 Salt Rounds) | Salted one-way cryptographic hashing; resistant to rainbow tables |
| **Validation** | Zod (Dual Client + Server) | Strict type validation on both client UX and server Route Handlers |
| **UI Styling** | Tailwind CSS & Glassmorphism | Dark theme, responsive grid, translucent blurred cards, vibrant gradients |
| **Animations** | Framer Motion + GSAP | Framer Motion for micro-interactions & shakes; GSAP for hero & counter rollups |
| **Viva Inspector** | Built-in Query Inspector Modal | Live display of raw PostgreSQL queries and corresponding ORM calls |

---

## 🗄️ Database Schema & Normalization

The system incorporates a normalized multi-table database architecture satisfying the university requirement for an independent sample table alongside the user authentication table.

### 1. `User` Model (Authentication & Student Profiles)
- **`id`** (`UUID`): Primary Key generated automatically via `gen_random_uuid()`
- **`fullName`** (`VARCHAR(100)`): Student's full name (minimum 3 characters constraint)
- **`email`** (`VARCHAR(255)`): Unique constraint (`UQ_User_email`) with B-Tree lookup index
- **`passwordHash`** (`VARCHAR(255)`): Stored bcrypt hash with 12 salt rounds (never returned in responses)
- **`phone`** (`VARCHAR(20)`): Validated phone number
- **`gender`** (`ENUM('MALE', 'FEMALE', 'OTHER')`): Enumerated data type
- **`createdAt`** & **`updatedAt`** (`TIMESTAMP`): Auditing timestamps with automated update triggers

### 2. `Course` Model (Independent Sample Catalog Table)
- **`id`** (`UUID`): Primary Key
- **`title`** (`VARCHAR(150)`): Course title
- **`code`** (`VARCHAR(20)`): Unique course code (`CSE311`, `CSE311L`, `CSE327`, etc.)
- **`credits`** (`INTEGER`): Academic credit hours (`CHECK (credits > 0 AND credits <= 6)`)
- **`description`** (`TEXT`): Detailed syllabus overview

### Relational Schema Files Provided:
1. **`prisma/schema.prisma`**: ORM schema for automated migrations and type generation.
2. **`prisma/schema.sql`**: **Handwritten, pure PostgreSQL DDL script** containing `CREATE TABLE`, `CREATE TYPE`, `CHECK`, `UNIQUE`, `PRIMARY KEY`, B-Tree indexes, and triggers ready for formal report submission.
3. **`prisma/seed.ts`**: Populates the `Course` table with 6 university computer science courses.

---

## 🚀 Quickstart & Setup Guide

### Prerequisites
- **Node.js**: v18.17+ or v20+ (tested on Node v22)
- **Docker & Docker Compose** (or a local PostgreSQL server)

---

### Step 1: Clone & Install Dependencies
```bash
git clone <repository-url>
cd mid-assinment
npm install
```

---

### Step 2: Start PostgreSQL Database
A complete `docker-compose.yml` is provided. Spin up the isolated PostgreSQL container in one command:
```bash
docker compose up -d
```
*To verify that the database container is running:*
```bash
docker ps
```
*(Default credentials in `.env`: `user:password`, port `5432`, database `dbms_lab`)*

---

### Step 3: Run Database Migrations
Create the tables in PostgreSQL using Prisma:
```bash
npx prisma migrate dev --name init
```
This generates the migration SQL file under `prisma/migrations/` and syncs the database.

---

### Step 4: Seed Sample Course Data
Populate the sample `Course` table with 6 initial records:
```bash
npx prisma db seed
```

---

### Step 5: Start the Next.js Development Server
```bash
npm run dev
```
Open your browser and navigate to **[http://localhost:3000](http://localhost:3000)**.

---

## 🧭 Application Walkthrough & User Flow

### 1. Landing Page (`/`)
- Demonstrates a **GSAP timeline hero reveal** animating the assignment badge, headline, and feature cards.
- Provides architectural breakdown and quick links to registration and sign-in.

### 2. Registration (`/register`)
- Form fields: Full Name, Email, Password, Confirm Password, Phone Number, Gender.
- **Zod Validation**: Real-time feedback with green checks and red error text.
- **Password Strength Meter**: Animated with **Framer Motion**, evaluating length, uppercase, numbers, and special symbols.
- **Duplicate Email Prevention**: Server returns `409 Conflict` if email already exists, triggering an error shake animation.
- **Submission**: On success, redirects to `/login` with an animated toast notification.

### 3. Login (`/login`)
- Authenticates credentials against the bcrypt password hash in PostgreSQL.
- Invalid attempts trigger a **Framer Motion card shake** and generic error message to prevent user enumeration.
- Optional **"Remember this device"** checkbox extends session cookie validity from 2 hours to 7 days.
- Issues a signed **JWT** stored in a secure, `httpOnly`, `sameSite=lax` cookie named `auth_token`.

### 4. Session Protection (`middleware.ts`)
- Accessing `/dashboard` directly without logging in automatically redirects to `/login?from=/dashboard`.
- Visiting `/login` or `/register` while already logged in automatically redirects to `/dashboard`.
- Logging out clears the `auth_token` cookie and blocks access to `/dashboard` immediately.

### 5. Dashboard (`/dashboard`)
Proves live database connectivity via 4 distinct live queries:
1. **Logged-in Student Profile**: Fetched live via `SELECT * FROM "User" WHERE id = ?`.
2. **Total Registered Users**: Aggregate live query `SELECT COUNT(*) FROM "User";` rolled up using an animated **GSAP counter**.
3. **Sample Courses**: Live query `SELECT COUNT(*) FROM "Course";` with GSAP counter.
4. **Registered Users Directory**: Formatted table querying all students (`ORDER BY createdAt DESC`) with search filter and gender badges.
5. **Course Catalog Section**: Displays the independent `Course` sample table with course codes, credits, and syllabus descriptions.
6. **DBMS Query Inspector**: Click the floating button at bottom-right to open an interactive modal displaying the exact raw SQL queries and Prisma ORM calls for your viva examination.

---

## 🔒 Security Architecture (Viva Defense)

1. **SQL Injection Mitigation**:
   - Prisma ORM converts all queries into prepared statements with parameterized placeholders (`$1`, `$2`). Raw string concatenation is never used.
2. **Password Cryptography**:
   - Plaintext passwords are never stored or logged. Bcrypt with 12 salt rounds applies 4,096 hashing rounds with unique cryptographic salts.
3. **Session & Cookie Security**:
   - The session token is stored inside an `httpOnly` cookie. This makes it impossible for malicious scripts to read the token via `document.cookie` (XSS immune).
   - `SameSite=Lax` prevents Cross-Site Request Forgery (CSRF).
4. **Information Disclosure Prevention**:
   - Login failure returns `"Invalid email or password"` rather than distinguishing whether the email exists, defeating account enumeration attacks.
   - `passwordHash` is explicitly excluded from all database select projections.

---

## 🎓 University Viva Questions & Answers

**Q1: Why use UUID over auto-incrementing integer IDs?**
> *Answer:* Auto-incrementing IDs (1, 2, 3) are sequential and predictable, making user enumeration trivial. UUIDv4 (128-bit) provides global uniqueness and security against enumeration.

**Q2: What is normalization and how does this schema comply?**
> *Answer:* The schema is in Third Normal Form (3NF). Each column contains atomic values (1NF), all non-key attributes are fully dependent on the primary key (2NF), and there are no transitive functional dependencies (3NF). The `Course` table is kept independent to prove multiple table queries.

**Q3: How does the backend verify authenticated requests?**
> *Answer:* Next.js `middleware.ts` intercepts requests at the Edge. It extracts the `auth_token` httpOnly cookie and uses `jose` to cryptographically verify the digital signature using `JWT_SECRET`.

---

## 📁 Repository Structure

```
├── app
│   ├── api
│   │   ├── auth
│   │   │   ├── login/route.ts      # POST: Authenticate & set httpOnly JWT cookie
│   │   │   ├── logout/route.ts     # POST: Clear cookie
│   │   │   ├── register/route.ts   # POST: Zod validate, duplicate check, bcrypt hash, insert User
│   │   │   └── session/route.ts    # GET: Verify token & return safe user profile
│   │   └── dashboard
│   │       ├── courses/route.ts    # GET: Live query of Course sample table
│   │       ├── stats/route.ts      # GET: Live COUNT(*) aggregate queries
│   │       └── users/route.ts      # GET: SELECT all users ORDER BY createdAt DESC
│   ├── dashboard/page.tsx          # Protected live dashboard with live queries
│   ├── globals.css                 # Dark theme, glassmorphism utilities & gradients
│   ├── layout.tsx                  # Root layout with Geist font & ToastProvider
│   ├── login/page.tsx              # Sign-in page with Remember Me & shake animation
│   ├── page.tsx                    # Landing page with GSAP hero intro timeline
│   └── register/page.tsx           # Registration page with animated glass card
├── components
│   ├── dashboard
│   │   ├── CourseTable.tsx         # Sample table catalog cards with credit badges
│   │   ├── DashboardHeader.tsx     # Topbar with user initials & logout flow
│   │   ├── QueryInspector.tsx      # Viva modal displaying raw SQL and ORM queries
│   │   └── UserTable.tsx           # Registered students directory with search & filter
│   ├── forms
│   │   ├── LoginForm.tsx           # Login form with error handling & redirect
│   │   ├── PasswordStrength.tsx    # Framer Motion animated password strength bar
│   │   └── RegisterForm.tsx        # Registration form with staggered field animations
│   └── ui
│       ├── AmbientBackground.tsx   # GSAP floating gradient orbs & dot grid overlay
│       ├── StatCounter.tsx         # GSAP timeline numeric rollup counter
│       └── Toast.tsx               # Framer Motion toast notification provider & hook
├── docker-compose.yml              # PostgreSQL 16 container definition
├── lib
│   ├── auth.ts                     # Bcrypt hashing & jose JWT signing/verification
│   ├── db.ts                       # Prisma Client singleton
│   └── validation.ts               # Zod validation schemas
├── middleware.ts                   # Edge route protection for /dashboard
├── prisma
│   ├── schema.prisma               # Prisma models and connection config
│   ├── schema.sql                  # Handwritten pure PostgreSQL DDL submission script
│   └── seed.ts                     # Seeder script populating 6 sample courses
├── .env                            # Database connection string and JWT secret
└── README.md                       # Complete documentation & viva prep guide
```
