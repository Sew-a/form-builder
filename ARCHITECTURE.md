# Architecture & Project Structure

This document describes the complete architecture, component hierarchy, state management, backend features, and data flow of the Form Builder application.

---

## 1. High-Level Architecture

Everything runs in **one Node.js process**:

```
┌─────────────────────────────────────────────────────┐
│                   Node.js Process                    │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │              HTTP Server (port 3000)          │   │
│  │                                               │   │
│  │  ┌─────────────────┐  ┌──────────────────┐  │   │
│  │  │   Express App    │  │   Socket.io      │  │   │
│  │  │                  │  │   Server          │  │   │
│  │  │  /api/auth/*     │  │                  │  │   │
│  │  │  /api/forms/*    │  │  form:join       │  │   │
│  │  │  /api/health     │  │  field:add       │  │   │
│  │  │                  │  │  field:update    │  │   │
│  │  │                  │  │  field:reorder   │  │   │
│  │  │                  │  │  field:delete    │  │   │
│  │  └─────────────────┘  └──────────────────┘  │   │
│  │                                               │   │
│  │  ┌──────────────────────────────────────┐    │   │
│  │  │     Next.js Request Handler          │    │   │
│  │  │     (fallback for non-/api routes)    │    │   │
│  │  │     Serves: /  /dashboard  /builder   │    │   │
│  │  └──────────────────────────────────────┘    │   │
│  └──────────────────────────────────────────────┘   │
│                        │                             │
│                        ▼                             │
│               ┌──────────────┐                      │
│               │   MongoDB    │                      │
│               │  (Mongoose)  │                      │
│               └──────────────┘                      │
└─────────────────────────────────────────────────────┘
```

**How it works:**
1. `server/index.ts` creates an HTTP server
2. Express is mounted first — it handles `/api/*` routes
3. Any request not matched by Express falls through to Next.js
4. Socket.io is attached to the same HTTP server (same port)
5. MongoDB connects via Mongoose (with in-memory fallback)

---

## 2. Complete File Tree

```
form-builder/
│
├── server/                              # ── BACKEND ──
│   ├── index.ts                         # Entry: HTTP + Express + Next.js + Socket.io
│   ├── app.ts                           # Express app: middleware, route mounting
│   ├── socket.ts                        # Socket.io: rooms, presence, field events
│   │
│   ├── controllers/
│   │   ├── auth.controller.ts           # register, login, logout, me, profile, avatar, delete
│   │   └── forms.controller.ts          # listForms, createForm, getForm, updateForm,
│   │                                    # deleteForm, getPublicForm, submitResponse, listResponses
│   │
│   ├── db/
│   │   ├── connect.ts                   # MongoDB connection + in-memory fallback
│   │   └── models/
│   │       ├── User.ts                  # User schema (name, email, passwordHash, avatar)
│   │       ├── Form.ts                  # Form schema (fields[], collaborators[], settings)
│   │       └── Response.ts              # Response schema (formId, answers[])
│   │
│   ├── middleware/
│   │   ├── auth.middleware.ts            # requireAuth (JWT verify), attachUserIfPresent
│   │   └── error.middleware.ts          # asyncHandler, ApiError class, errorHandler
│   │
│   └── routes/
│       ├── auth.routes.ts               # POST register/login/logout, GET/PATCH/DELETE me
│       ├── forms.routes.ts              # CRUD + public form + responses
│       └── constants.ts                 # API_ROUTES path constants
│
├── src/                                 # ── FRONTEND (Next.js App Router) ──
│   ├── app/
│   │   ├── layout.tsx                   # Root HTML layout, metadata, font imports
│   │   ├── page.tsx                     # Landing page (/)
│   │   ├── globals.css                  # Tailwind + custom CSS
│   │   ├── constants.tsx                # Landing page text content
│   │   │
│   │   ├── dashboard/
│   │   │   └── page.tsx                 # /dashboard — form list, create, delete
│   │   │
│   │   ├── builder/
│   │   │   └── [formId]/
│   │   │       └── page.tsx             # /builder/[formId] — drag-and-drop editor
│   │   │
│   │   ├── forms/
│   │   │   └── [formId]/
│   │   │       └── fill/
│   │   │           └── page.tsx         # /forms/[formId]/fill — public form (TODO)
│   │   │
│   │   └── settings/
│   │       └── profile/
│   │           └── page.tsx             # /settings/profile — profile management
│   │
│   ├── components/
│   │   ├── auth/
│   │   │   ├── AuthModal/
│   │   │   │   ├── AuthModal.tsx        # Tabbed sign-in / sign-up modal
│   │   │   │   └── index.ts
│   │   │   ├── SignInForm/
│   │   │   │   ├── SignInForm.tsx        # Login form (email + password)
│   │   │   │   ├── SignInForm.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── SignUpForm/
│   │   │   │   ├── SignUpForm.tsx        # Registration form (name + email + password)
│   │   │   │   ├── SignUpForm.test.tsx
│   │   │   │   └── index.ts
│   │   │   └── UserAvatar/
│   │   │       ├── UserAvatar.tsx        # Avatar image or initials fallback
│   │   │       └── index.ts
│   │   │
│   │   ├── builder/
│   │   │   ├── BuilderHeader.tsx         # Title editing, breadcrumb, save status
│   │   │   ├── BuilderCanvas.tsx         # Center: @dnd-kit sortable field list
│   │   │   ├── FieldPalette.tsx          # Left: draggable field type buttons
│   │   │   ├── PropertyPanel.tsx         # Right: edit selected field properties
│   │   │   ├── CreateFormDialog.tsx      # New form name dialog
│   │   │   └── constants.tsx            # Field type icons, labels, categories
│   │   │
│   │   ├── fields/
│   │   │   └── FieldRenderer.tsx         # Renders any field type (preview + live modes)
│   │   │
│   │   ├── layout/
│   │   │   ├── Header/
│   │   │   │   ├── Header.tsx            # Top bar: logo, user dropdown, auth buttons
│   │   │   │   ├── Header.test.tsx
│   │   │   │   ├── constants.tsx         # Dropdown menu links
│   │   │   │   └── index.ts
│   │   │   ├── Sidebar/
│   │   │   │   ├── Sidebar.tsx           # Nav: Home, Dashboard (locked if not authed)
│   │   │   │   ├── constants.tsx         # Nav items config
│   │   │   │   └── index.ts
│   │   │   ├── Footer/
│   │   │   │   ├── Footer.tsx            # Brand + footer links
│   │   │   │   ├── constants.tsx         # Footer link config
│   │   │   │   └── index.ts
│   │   │   ├── MainLayout/
│   │   │   │   ├── MainLayout.tsx        # Authenticated: Header + Sidebar + Footer
│   │   │   │   └── index.ts
│   │   │   └── PublicLayout/
│   │   │       ├── PublicLayout.tsx      # Public: Header only (no sidebar)
│   │   │       └── index.ts
│   │   │
│   │   ├── settings/
│   │   │   └── ProfileSettings/
│   │   │       ├── ProfileSettings.tsx   # Avatar, name, password, delete account
│   │   │       └── index.ts
│   │   │
│   │   └── ui/
│   │       ├── Button.tsx               # Reusable button (6 variants, 5 sizes)
│   │       ├── Modal.tsx                # Generic modal (backdrop, close, escape)
│   │       └── FeatureCard.tsx          # Landing page feature card
│   │
│   ├── hooks/
│   │   ├── useFormBuilder.ts            # Builder logic: load, add/update/delete fields, auto-save
│   │   └── useSocket.ts                 # Socket.io client: join room, presence, field sync
│   │
│   ├── lib/
│   │   ├── api.ts                       # Fetch wrapper (get/post/patch/delete with credentials)
│   │   ├── avatarImage.ts              # Image resize/compress for avatars
│   │   └── routes.ts                   # Frontend route path constants
│   │
│   └── store/
│       ├── useAuthStore.ts              # Zustand: user state + auth API calls
│       └── useFormStore.ts              # Zustand: form fields + dashboard CRUD
│
├── shared/                              # ── SHARED (client + server) ──
│   └── types.ts                         # Zod schemas, TypeScript types, constants
│
├── scripts/
│   └── count-users.ts                   # CLI: list all registered users
│
├── dist/                                # ── COMPILED OUTPUT ──
│   ├── server/                          # Compiled server JS (for production)
│   └── shared/                          # Compiled shared types
│
├── .env                                 # Active environment config
├── .env.example                         # Environment template
├── package.json                         # Dependencies + scripts
├── tsconfig.json                        # Frontend TS config
├── tsconfig.server.json                 # Server TS config
├── tailwind.config.js                   # Tailwind: colors, fonts, animations
├── postcss.config.js                    # PostCSS: tailwindcss + autoprefixer
├── next.config.js                       # Next.js config
├── jest.config.js                       # Jest test config
├── jest.setup.ts                        # Jest setup (browser API mocks)
└── PLAN.md                              # Full project plan + roadmap
```

---

## 3. Component Hierarchy

### Page Components (under `src/app/`)

```
src/app/layout.tsx (Root Layout)
├── page.tsx                           → / (Landing Page)
│   └── PublicLayout
│       ├── Header
│       ├── Hero section
│       ├── Stats section
│       ├── Features grid (FeatureCard × 6)
│       ├── CTA section
│       └── Footer
│
├── dashboard/page.tsx                 → /dashboard
│   └── MainLayout
│       ├── Header
│       ├── Sidebar
│       ├── Dashboard content
│       │   ├── "New Form" button
│       │   ├── CreateFormDialog (modal)
│       │   └── Form cards grid
│       └── Footer
│
├── builder/[formId]/page.tsx          → /builder/[formId]
│   ├── BuilderHeader
│   ├── FieldPalette (left, w-64)
│   ├── BuilderCanvas (center, flex-1)
│   │   └── SortableField × N
│   │       └── FieldRenderer
│   └── PropertyPanel (right, w-72)
│
├── forms/[formId]/fill/page.tsx       → /forms/[formId]/fill (TODO)
│
└── settings/profile/page.tsx          → /settings/profile
    └── MainLayout
        ├── Header
        ├── Sidebar
        ├── ProfileSettings
        │   ├── Avatar section
        │   ├── Profile section (name, nickname)
        │   ├── Change password section
        │   └── Delete account section
        └── Footer
```

### Component Tree

```
<RootLayout>
  ├── <PublicLayout> or <MainLayout>
  │   ├── <Header>
  │   │   ├── Logo text
  │   │   ├── UserAvatar (when logged in)
  │   │   ├── Dropdown menu (when logged in)
  │   │   │   ├── "Profile Settings" link
  │   │   │   ├── "My Dashboard" link
  │   │   │   └── "Log Out" button
  │   │   ├── "Sign In" button (when logged out)
  │   │   └── "Get Started" link (when logged out)
  │   │
  │   ├── <Sidebar> (MainLayout only)
  │   │   ├── Home nav item
  │   │   └── Dashboard nav item (locked if not authed)
  │   │
  │   ├── {children} (page content)
  │   │
  │   ├── <Footer>
  │   │   ├── Brand name
  │   │   └── Links (Privacy, Terms, Docs)
  │   │
  │   └── <AuthModal>
  │       ├── Sign In tab → <SignInForm>
  │       └── Sign Up tab → <SignUpForm>
```

---

## 4. State Management

Two Zustand stores manage all client-side state:

### `useAuthStore` (`src/store/useAuthStore.ts`)

```
┌─────────────────────────────────────────────┐
│              useAuthStore                     │
├─────────────────────────────────────────────┤
│ State:                                       │
│   user: AuthUserDTO | null                   │
│   loading: boolean                           │
│   error: string | null                       │
│   authModalOpen: boolean                     │
│   authModalTab: 'signin' | 'signup'          │
├─────────────────────────────────────────────┤
│ Actions:                                     │
│   setAuthModalOpen(open, tab?)               │
│   setUser(user)                              │
│   clearError()                               │
│   checkUser()          → GET /api/auth/me    │
│   login(email, pass)   → POST /api/auth/login│
│   register(name, email, pass)                │
│                        → POST /api/auth/register │
│   logout()             → POST /api/auth/logout│
│   updateProfile(data)  → PATCH /api/auth/me  │
│   changePassword(data) → PATCH /api/auth/password │
│   updateAvatar(data)   → PATCH /api/auth/avatar │
│   deleteAccount(data)  → DELETE /api/auth/me  │
└─────────────────────────────────────────────┘
```

**Used by:** Header, Sidebar, AuthModal, SignInForm, SignUpForm, MainLayout, PublicLayout, ProfileSettings

### `useFormStore` (`src/store/useFormStore.ts`)

```
┌──────────────────────────────────────────────┐
│              useFormStore                      │
├──────────────────────────────────────────────┤
│ Builder State:                                │
│   formId: string | null                       │
│   title: string                               │
│   fields: FormField[]                         │
│                                               │
│ Dashboard State:                              │
│   forms: FormDTO[]                            │
│   formsLoading: boolean                       │
├──────────────────────────────────────────────┤
│ Builder Actions:                              │
│   setForm(id, title, fields)                  │
│   addField(field)                             │
│   updateField(id, changes)                    │
│   removeField(id)                             │
│   reorderFields(from, to)                     │
│                                               │
│ Dashboard Actions:                            │
│   loadForms()          → GET /api/forms       │
│   createForm(title)    → POST /api/forms      │
│   deleteForm(id)       → DELETE /api/forms/:id│
└──────────────────────────────────────────────┘
```

**Used by:** Dashboard, BuilderCanvas, BuilderHeader, PropertyPanel, FieldPalette, useFormBuilder hook

---

## 5. Data Flow

### Authentication Flow

```
User clicks "Sign In"
  │
  ▼
AuthModal opens → SignInForm renders
  │
  ▼
User enters email + password → Zod validation (LoginSchema)
  │
  ▼
useAuthStore.login(email, password)
  │
  ▼
POST /api/auth/login  { email, password }
  │
  ▼
auth.controller.ts: login()
  ├── User.findOne({ email }).select('+passwordHash')
  ├── bcrypt.compare(password, user.passwordHash)
  ├── jwt.sign({ sub: user._id }, JWT_SECRET, { expiresIn: '7d' })
  └── res.cookie('fb_token', token, { httpOnly: true })
  │
  ▼
Response: AuthUserDTO { id, name, email, nickname?, avatarUrl? }
  │
  ▼
useAuthStore: setUser(user) → Header re-renders with user info
```

### Form Builder Flow

```
User navigates to /builder/[formId]
  │
  ▼
useFormBuilder hook:
  ├── GET /api/forms/:id  → loads form data
  ├── useFormStore.setForm(id, title, fields)
  └── useSocket(formId)   → joins Socket.io room
  │
  ▼
User drags field from FieldPalette → BuilderCanvas
  │
  ▼
useFormBuilder.addField(type)
  ├── Creates FormField with UUID
  ├── useFormStore.addField(field)  → local state update
  ├── useSocket.emit('field:add', field)  → broadcast to room
  └── Auto-save: debounced PATCH /api/forms/:id
  │
  ▼
Server receives field:add via Socket.io
  ├── Pushes field to MongoDB Form.fields[]
  ├── Saves to database
  └── Broadcasts to other clients in room
  │
  ▼
Other clients receive field:add → apply to their local store
```

### Real-time Collaboration Flow

```
Client A opens /builder/abc123
  │
  ▼
Socket.io: emit('form:join', { formId: 'abc123', user })
  │
  ▼
Server: joins room 'abc123', adds to presence map
  ├── Broadcasts 'user:joined' to room
  └── Sends 'presence:list' to Client A
  │
  ▼
Client B opens /builder/abc123
  │
  ▼
Server: broadcasts 'user:joined' (both A and B see each other)
  │
  ▼
Client A edits a field:
  ├── Local: useFormStore.updateField()  (instant)
  ├── Network: useSocket.emit('field:update', ...)
  └── Auto-save: PATCH /api/forms/abc123
  │
  ▼
Server receives 'field:update':
  ├── Updates field in MongoDB
  └── Broadcasts to Client B (not back to A)
  │
  ▼
Client B receives 'field:update':
  └── Applies change to local useFormStore
```

---

## 6. Backend Features

### Express Middleware Stack

```
Request
  │
  ▼
CORS (credentials: true)
  │
  ▼
JSON body parser (1mb limit)
  │
  ▼
Cookie parser
  │
  ▼
Route matching:
  ├── /api/auth/*  → auth.routes.ts
  ├── /api/forms/* → forms.routes.ts
  └── /api/health  → inline handler
  │
  ▼
Auth middleware (on protected routes):
  ├── requireAuth: verifies JWT, sets req.userId
  └── attachUserIfPresent: optional auth (doesn't reject)
  │
  ▼
Controller function
  │
  ▼
Error middleware (only for /api/* routes)
  ├── asyncHandler: wraps async routes
  ├── ApiError: structured HTTP errors
  └── errorHandler: returns JSON error response
```

### Socket.io Events

| Event | Direction | Payload | Description |
|-------|-----------|---------|-------------|
| `form:join` | Client → Server | `{ formId, user }` | Join a form room |
| `form:leave` | Client → Server | `{ formId }` | Leave a form room |
| `user:joined` | Server → Room | `{ user }` | Broadcast new user |
| `user:left` | Server → Room | `{ userId }` | Broadcast user left |
| `presence:list` | Server → Client | `PresenceUser[]` | Current room members |
| `field:add` | Client → Server → Room | `FormField` | New field added |
| `field:update` | Client → Server → Room | `{ fieldId, changes }` | Field edited |
| `field:reorder` | Client → Server → Room | `{ fieldIds[] }` | Fields reordered |
| `field:delete` | Client → Server → Room | `{ fieldId }` | Field removed |

### Database Connection Strategy

```
connectDB() called
  │
  ├── Production or non-localhost URI?
  │   └── Connect directly to MONGODB_URI
  │
  └── Development + localhost URI?
      │
      ├── Try local MongoDB (3s timeout)
      │   └── Success → connected
      │
      └── Fail → auto-start mongodb-memory-server
          └── In-memory database (no persistence)
```

---

## 7. User Data

### Where User Data Lives

User data is stored in **MongoDB** in the `users` collection (Mongoose model: `server/db/models/User.ts`).

**User document structure:**
```typescript
{
  _id: ObjectId,           // Auto-generated MongoDB ID
  name: string,            // Required, trimmed
  email: string,           // Required, unique, lowercase, trimmed
  passwordHash: string,    // bcrypt hash (hidden by default via select: false)
  nickname?: string,       // Optional, max 30 chars
  avatarUrl?: string,      // Optional, base64 data URL (JPEG/PNG/WebP, max 500KB)
  createdAt: Date,         // Auto-generated
  updatedAt: Date          // Auto-generated
}
```

### How Many Users Exist

There is **no hardcoded user data** in the codebase. All users are created through the registration endpoint (`POST /api/auth/register`). The number of users depends entirely on who has registered.

To check how many users exist:

```bash
npm run db:users
```

This runs `scripts/count-users.ts` which connects to MongoDB, counts all user documents, and lists them with name, email, nickname, and creation date.

### How to Add a User

**Method 1: Through the UI**
1. Start the app: `npm run dev`
2. Open `http://localhost:3000`
3. Click "Get Started" or "Sign In" in the header
4. Switch to the "Sign Up" tab
5. Enter name, email, and password (min 8 characters)
6. Submit — account is created and you're logged in

**Method 2: Through the API directly**
```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"mypassword123"}'
```

**Method 3: Create a seed script**
You could add a script similar to `scripts/count-users.ts`:

```typescript
// scripts/seed-user.ts
import 'dotenv/config';
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { connectDB } from '../server/db/connect';
import { User } from '../server/db/models/User';

async function main() {
  await connectDB();

  const users = [
    { name: 'Alice', email: 'alice@example.com', password: 'password123' },
    { name: 'Bob', email: 'bob@example.com', password: 'password123' },
  ];

  for (const u of users) {
    const exists = await User.findOne({ email: u.email });
    if (exists) {
      console.log(`User ${u.email} already exists, skipping.`);
      continue;
    }
    const passwordHash = await bcrypt.hash(u.password, 10);
    await User.create({ name: u.name, email: u.email, passwordHash });
    console.log(`Created user: ${u.email}`);
  }

  await mongoose.disconnect();
}

main().catch((err) => { console.error(err); process.exit(1); });
```

Then run it with `tsx scripts/seed-user.ts`.

### Auth Token Flow

```
Registration/Login
  │
  ▼
Password hashed with bcrypt (10 rounds)
  │
  ▼
JWT signed: { sub: userId }, secret: JWT_SECRET, expires: 7d
  │
  ▼
Token set as httpOnly cookie: fb_token
  │
  ▼
Subsequent requests:
  ├── Browser sends cookie automatically
  ├── auth.middleware.ts extracts token from cookie
  ├── jwt.verify(token, JWT_SECRET)
  └── Sets req.userId for route handlers
```

---

## 8. Shared Types (`shared/types.ts`)

This file is imported by both the frontend and backend. It contains:

- **Zod schemas** for validation (RegisterSchema, LoginSchema, CreateFormSchema, etc.)
- **TypeScript types** derived from Zod schemas (FormField, FormDTO, AuthUserDTO, etc.)
- **Constants** (FIELD_TYPES, COLOR_OPTIONS, WIDTH_OPTIONS, SOCKET_EVENTS)

The schemas ensure validation rules are identical on client and server — no duplication.

---

## 9. Styling System

### Color Palette (defined in `tailwind.config.js`)

```
dark-*    (grays):   #1e1f22 → #e8e8ea  (900 → 50)
accent-*  (blues):   #2d4880 → #eef4ff  (900 → 50)
```

### Fonts
- **Logo/branding:** "Story Script" (serif, decorative)
- **Body text:** Inter (sans-serif, 300-800 weights)

### Animations (defined in `tailwind.config.js`)
- `fadeIn` — 0.3s opacity fade
- `slideUp` — 0.3s translate from below
- `slideDown` — 0.3s translate from above
- `scaleIn` — 0.2s scale up from 0.95
- `slideIn` — 0.3s translate from left
- `shake` — 0.3s horizontal shake (for errors)

---

## 10. Testing

### Test Files

| File | Tests | Description |
|------|-------|-------------|
| `src/components/layout/Header/Header.test.tsx` | 4 | Logo render, auth buttons, modal trigger |
| `src/components/auth/SignInForm/SignInForm.test.tsx` | 4 | Input render, validation, login call, API errors |
| `src/components/auth/SignUpForm/SignUpForm.test.tsx` | 4 | Input render, validation, register call, API errors |

### Test Setup (`jest.setup.ts`)
Mocks `window.matchMedia`, `IntersectionObserver`, and `ResizeObserver` (not available in jsdom).

### Running Tests
```bash
npm test              # Single run
npm run test:watch    # Watch mode
```

---

## 11. Build Pipeline

```
npm run dev
  └── tsx watch server/index.ts
      ├── connectDB()
      ├── nextApp.prepare()
      ├── createExpressApp()
      ├── expressApp.all('*', handleNextRequest)
      ├── createServer(expressApp)
      ├── initSocket(httpServer)
      └── httpServer.listen(3000)

npm run build
  ├── next build          → .next/ (compiled React pages)
  └── tsc -p tsconfig.server.json  → dist/server/ (compiled JS)

npm start
  └── node dist/server/index.js (production mode)
      ├── Same as dev but uses compiled output
      └── NODE_ENV=production (HTTPS cookies, no hot-reload)
```
