# Collaborative Drag & Drop Form Builder

A full-stack drag-and-drop form builder with real-time collaboration support.

Built with **Next.js 14** (App Router), **Express**, **Socket.io**, and **MongoDB** — all running in a single Node.js process via a custom server.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router), React 18, TypeScript 5.5 |
| Styling | Tailwind CSS 3.4 |
| State | Zustand 4.5 |
| Drag & Drop | @dnd-kit (core + sortable) |
| Backend | Node.js + Express 4.19 |
| Realtime | Socket.io 4.7 |
| Database | MongoDB + Mongoose 8.5 |
| Auth | JWT in httpOnly cookies, bcrypt |
| Validation | Zod 3.23 (shared client/server) |
| Testing | Jest 30 + React Testing Library |

## Requirements

- **Node.js 18.18+** (20 LTS recommended)
- **MongoDB** — local (`mongod`), Docker, or a free Atlas cluster
  - If no local MongoDB is found, the app auto-falls back to an in-memory database (data lost on restart)

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# then edit .env — set MONGODB_URI and a real JWT_SECRET

# 3. Run in development
npm run dev
```

The app will be available at **http://localhost:3000** — this single URL serves the React frontend, the `/api/*` REST endpoints, and the Socket.io real-time layer.

Quick sanity check: open `http://localhost:3000/api/health` — you should see `{"ok": true}`.

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server (hot-reload via `tsx watch`) |
| `npm run build` | Build Next.js frontend + compile server TypeScript |
| `npm start` | Run production server from `dist/` |
| `npm run lint` | Run ESLint |
| `npm run type-check` | TypeScript type checking (no emit) |
| `npm run db:users` | List all registered users in MongoDB |
| `npm test` | Run Jest test suite |
| `npm run test:watch` | Run tests in watch mode |

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `3000` | Server port |
| `NODE_ENV` | `development` | Environment mode |
| `MONGODB_URI` | `mongodb://localhost:27017/form-builder` | MongoDB connection string |
| `JWT_SECRET` | — | Secret key for JWT signing (set a strong random string) |
| `JWT_EXPIRES_IN` | `7d` | JWT token expiry |
| `COOKIE_NAME` | `fb_token` | Name of the auth cookie |
| `CLIENT_ORIGIN` | `http://localhost:3000` | Origin for CORS and Socket.io |

## Project Structure

```
form-builder/
├── server/                        # Backend (Express + Socket.io + MongoDB)
│   ├── index.ts                   # Custom server entry: HTTP + Express + Next.js
│   ├── app.ts                     # Express app setup (middleware, routes)
│   ├── socket.ts                  # Socket.io (rooms, presence, field sync)
│   ├── controllers/
│   │   ├── auth.controller.ts     # Register, login, logout, profile, avatar, delete
│   │   └── forms.controller.ts    # Form CRUD + public form + responses
│   ├── db/
│   │   ├── connect.ts             # MongoDB connection (with in-memory fallback)
│   │   └── models/
│   │       ├── User.ts            # User model
│   │       ├── Form.ts            # Form model (with embedded FormField subdocs)
│   │       └── Response.ts        # Form submission responses
│   ├── middleware/
│   │   ├── auth.middleware.ts     # JWT auth (requireAuth, attachUserIfPresent)
│   │   └── error.middleware.ts   # Error handling (asyncHandler, ApiError)
│   └── routes/
│       ├── auth.routes.ts         # Auth API routes
│       ├── forms.routes.ts        # Forms API routes
│       └── constants.ts           # Centralized route path constants
│
├── src/                           # Frontend (Next.js App Router)
│   ├── app/
│   │   ├── page.tsx               # Landing page
│   │   ├── layout.tsx             # Root layout
│   │   ├── globals.css            # Global styles (Tailwind + custom)
│   │   ├── constants.tsx          # Landing page content
│   │   ├── dashboard/
│   │   │   └── page.tsx           # Dashboard (list/create/delete forms)
│   │   ├── builder/
│   │   │   └── [formId]/
│   │   │       └── page.tsx       # Drag-and-drop form builder
│   │   ├── forms/
│   │   │   └── [formId]/
│   │   │       └── fill/
│   │   │           └── page.tsx   # Public form filling (TODO)
│   │   └── settings/
│   │       └── profile/
│   │           └── page.tsx       # Profile settings
│   │
│   ├── components/
│   │   ├── auth/                  # AuthModal, SignInForm, SignUpForm, UserAvatar
│   │   ├── builder/               # BuilderCanvas, BuilderHeader, FieldPalette,
│   │   │                          # PropertyPanel, CreateFormDialog
│   │   ├── fields/                # FieldRenderer (all field types)
│   │   ├── layout/                # Header, Sidebar, Footer, MainLayout, PublicLayout
│   │   ├── settings/              # ProfileSettings
│   │   └── ui/                    # Button, Modal, FeatureCard
│   │
│   ├── hooks/
│   │   ├── useFormBuilder.ts      # Builder page logic (load, CRUD, auto-save)
│   │   └── useSocket.ts           # Socket.io client (rooms, presence, field sync)
│   │
│   ├── lib/
│   │   ├── api.ts                 # HTTP API client (fetch wrapper)
│   │   ├── avatarImage.ts         # Avatar resize/compress utility
│   │   └── routes.ts             # Frontend route constants
│   │
│   └── store/
│       ├── useAuthStore.ts        # Auth state + API calls (Zustand)
│       └── useFormStore.ts        # Form builder + dashboard state (Zustand)
│
├── shared/
│   └── types.ts                   # Zod schemas + TypeScript types (shared)
│
├── scripts/
│   └── count-users.ts            # CLI: list registered users
│
├── dist/                          # Compiled server output (production)
├── .env.example                   # Environment variable template
├── jest.config.js                 # Jest configuration
├── tailwind.config.js             # Tailwind CSS config (colors, fonts, animations)
├── tsconfig.json                  # Frontend TypeScript config
├── tsconfig.server.json           # Server TypeScript config
└── next.config.js                 # Next.js configuration
```

## Frontend Routes

| Path | Page | Description |
|------|------|-------------|
| `/` | Landing | Marketing page with feature overview |
| `/dashboard` | Dashboard | List, create, and delete forms |
| `/builder/[formId]` | Builder | Drag-and-drop form editor |
| `/forms/[formId]/fill` | Form Fill | Public form submission (TODO) |
| `/settings/profile` | Settings | Profile management |

## API Endpoints

### Auth (`/api/auth/`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/auth/register` | No | Create account |
| POST | `/api/auth/login` | No | Sign in |
| POST | `/api/auth/logout` | No | Sign out (clear cookie) |
| GET | `/api/auth/me` | Yes | Get current user |
| PATCH | `/api/auth/me` | Yes | Update profile (name, nickname) |
| PATCH | `/api/auth/password` | Yes | Change password |
| PATCH | `/api/auth/avatar` | Yes | Update avatar (base64 image) |
| DELETE | `/api/auth/me` | Yes | Delete account + all forms |

### Forms (`/api/forms/`)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/forms/` | Yes | List user's forms |
| POST | `/api/forms/` | Yes | Create new form |
| GET | `/api/forms/:id` | Yes | Get form by ID |
| PATCH | `/api/forms/:id` | Yes | Update form (fields, title, settings) |
| DELETE | `/api/forms/:id` | Yes | Delete form (owner only) |
| GET | `/api/forms/:id/public` | No | Get published form for filling |
| POST | `/api/forms/:id/responses` | No | Submit a form response |
| GET | `/api/forms/:id/responses` | Yes | List responses (owner/collaborator) |

### Other

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/health` | No | Health check (`{"ok": true}`) |

## Supported Field Types

| Type | Description |
|------|-------------|
| `text` | Single-line text input |
| `email` | Email input |
| `number` | Numeric input |
| `textarea` | Multi-line text input |
| `dropdown` | Select dropdown (custom options) |
| `radio` | Radio button group (custom options) |
| `checkbox` | Checkbox group (custom options) |
| `date` | Date picker |
| `file` | File upload area |
| `rating` | Star rating (configurable max) |
| `section` | Content block (decorative, customizable appearance) |

## Real-time Collaboration

The app uses Socket.io for real-time collaboration in the form builder:

1. When a user opens `/builder/[formId]`, they join a Socket.io room keyed by the form ID
2. Field changes (add, update, reorder, delete) are broadcast to all users in the room
3. Presence tracking shows who is currently editing the form
4. Conflict resolution uses a last-write-wins strategy per field

## Database

- **MongoDB** via Mongoose 8.5
- Default database: `form-builder` on `localhost:27017`
- Auto-falls back to **mongodb-memory-server** if local MongoDB is unavailable (dev only)
- Three collections: `users`, `forms`, `responses`

## Testing

```bash
npm test              # Run all tests
npm run test:watch    # Watch mode
```

Current test coverage:
- `Header` — rendering, auth state, modal triggers
- `SignInForm` — rendering, validation, login flow, error display
- `SignUpForm` — rendering, validation, registration flow, error display

## Production Build

```bash
npm run build    # Compiles Next.js + server TypeScript (via postbuild)
npm start        # Runs compiled server from dist/
```

## Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — Detailed architecture, state management, component tree, and data flow
- [`PLAN.md`](./PLAN.md) — Full project plan, feature roadmap, and implementation phases
