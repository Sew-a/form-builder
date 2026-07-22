# Project Plan — Collaborative Drag & Drop Form Builder

## 1. Architecture — "one app"

A single Node.js process hosts everything:

```
One Node.js process
 ├─ Express app (mounted)
 │   ├─ REST API routes (/api/...)
 │   └─ Socket.io server (real-time collaboration)
 └─ Next.js request handler (mounted as fallback, serves all pages/React)
```

This is a custom server (`server/index.ts`) rather than plain `next dev`,
because real-time collaboration needs WebSockets, and Socket.io needs a raw
HTTP server to attach to — that's much harder to do cleanly from inside
Next.js's own API routes.

**Stack**

- Frontend: Next.js 14+ (App Router), React, TypeScript
- Backend: Node.js + Express (custom server, same repo)
- Realtime: Socket.io
- Database: MongoDB + Mongoose
- Drag & drop: `dnd-kit`
- Auth: JWT in an httpOnly cookie
- Client state: Zustand
- Validation: Zod (shared between frontend/backend via `shared/types.ts`)

## 2. Project structure

```
form-builder/
├── server/
│   ├── index.ts              # custom server: HTTP server + Express + Next.js
│   ├── app.ts                 # Express app (middleware, routes)
│   ├── socket.ts              # Socket.io setup, room + presence logic
│   ├── db/
│   │   ├── connect.ts
│   │   └── models/ (User, Form, Response)
│   ├── routes/ (auth, forms)
│   ├── controllers/ (auth, forms)
│   └── middleware/ (auth, error handling)
├── src/                        # Next.js app (App Router)
│   ├── app/
│   │   ├── dashboard/
│   │   ├── builder/[formId]/    # the drag-drop editor
│   │   └── forms/[formId]/fill/ # public form-filling view
│   ├── components/
│   │   ├── builder/, fields/, ui/
│   ├── hooks/useSocket.ts
│   ├── store/useFormStore.ts
│   └── lib/api.ts
├── shared/types.ts             # types + Zod schemas used by both sides
├── PLAN.md                      # this file
└── package.json
```

## 3. Data models

**User** — `_id, name, email, passwordHash, createdAt`

**Form**
```
_id, title, description, ownerId,
collaborators: [{ userId, role: 'editor'|'viewer' }],
fields: [FormField],   // ordered array — the drag-drop state
settings: { submitMessage, isPublished },
createdAt, updatedAt
```

**FormField** (embedded)
```
{ id, type: 'text'|'textarea'|'checkbox'|'radio'|'dropdown'|'date',
  label, placeholder, required, options?: string[], order }
```

**Response**
```
_id, formId, answers: [{ fieldId, value }], submittedAt
```

## 4. Feature scope

### MVP (build first)
- Auth (register/login, JWT session cookie)
- Create/rename/delete forms; dashboard listing "my forms"
- Drag-and-drop builder: add fields from a palette, reorder via drag, delete,
  edit basic properties (label, required)
- Save form to MongoDB
- Public shareable link to fill out a published form
- View submitted responses in a simple table
`
### Phase 2 — Real-time collaboration (the differentiator)
- Multiple users open the same form builder → see live presence
- Live sync of field add/reorder/edit via Socket.io rooms (`formId` as room)
- Conflict handling: last-write-wins per field to start; Yjs (CRDT) as a
  stretch goal for true concurrent-editing robustness
- "Who's viewing this form" presence list

### Phase 3 — Polish / extras
- More field types: rating, signature, file upload
- Conditional logic (show field X if field Y = value)
- Response analytics (charts)
- Form templates, CSV export
- Dark mode, mobile-responsive filling experience

## 5. Real-time collaboration design

1. Client connects via Socket.io on `/builder/[formId]`, joins room `formId`.
2. On edit (add/reorder/update/delete field), client:
   - Optimistically updates local Zustand state (instant feedback)
   - Emits an event (`field:add`, `field:update`, `field:reorder`, `field:delete`)
3. Server persists the change to MongoDB, then broadcasts to everyone else
   in the room (`socket.to(formId).emit(...)`) — the sender doesn't get its
   own event echoed back, since it already applied the change locally.
4. Presence: on join, broadcast `user:joined` + send the joiner the current
   `presence:list`; on disconnect, broadcast `user:left`. Tracked in-memory
   per server process (`server/socket.ts`) — move to Redis if you ever scale
   to multiple server instances.

Start with last-write-wins (implemented in the scaffold). Yjs is a good
"advanced" addition once the MVP works end-to-end.

## 6. REST API

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
GET    /api/auth/me

GET    /api/forms                 # list user's forms
POST   /api/forms                 # create
GET    /api/forms/:id
PATCH  /api/forms/:id              # update fields/settings
DELETE /api/forms/:id

GET    /api/forms/:id/public       # public view for filling (no auth)
POST   /api/forms/:id/responses    # submit a response (no auth)
GET    /api/forms/:id/responses    # owner views responses (auth)
```

Collaborator-invite endpoint (`POST /api/forms/:id/collaborators`) is in the
data model already (`Form.collaborators`) but not yet wired up as a route —
add it when you get to sharing/permissions.

## 7. Build order (roadmap)

1. **Scaffold** ✅ — Next.js + TS, custom Express server wrapping it, MongoDB
   connection, confirm the app boots (`npm run dev`, check `/api/health`).
2. **Auth** — register/login pages, wire up `/api/auth/*`, protect routes
   client-side by checking `/api/auth/me`.
3. **Forms CRUD** — dashboard page: list/create/delete forms via `/api/forms`
   (no builder UI yet — just plain data in a table/list).
4. **Drag & drop builder (solo mode)** — field palette, canvas, reorder with
   `dnd-kit`, property panel, save to DB via `PATCH /api/forms/:id`. Get this
   fully solid single-user before adding real-time.
5. **Public form filling + responses** — shareable link (`/forms/[id]/fill`),
   submission storage, response table for the owner.
6. **Socket.io real-time layer** — presence + live field sync on top of the
   already-working builder (hook: `src/hooks/useSocket.ts`).
7. **Polish** — extra field types, conditional logic, analytics, as time
   allows.

Real-time collaboration is the hardest and most bug-prone part — get the
underlying data model and single-user UI fully solid (steps 1-5) before
layering sockets on top.

## 8. What's already in this scaffold

- ✅ Custom server wiring Express + Socket.io + Next.js into one process
- ✅ MongoDB connection + Mongoose models (User, Form, Response)
- ✅ Auth: register/login/logout/me, JWT in httpOnly cookie, bcrypt hashing
- ✅ Forms CRUD API + public form + response submission endpoints
- ✅ Socket.io room/presence logic + field add/update/reorder/delete events
- ✅ Shared Zod schemas/types used by both client and server
- ✅ Zustand store + `useSocket` hook skeleton for the builder page
- ✅ Placeholder pages for `/dashboard`, `/builder/[formId]`, `/forms/[formId]/fill`
- 🚧 Not yet built: the actual `dnd-kit` drag-and-drop UI, field palette,
  property panel, login/register forms, dashboard UI, response viewing UI —
  these are the next coding sessions, following the build order above.

---

## 9. Current Implementation Plan (Approved)

### Phase 1: Ellipsus-Inspired Redesign
**Palette:** Warm cream `#FAF7F2` bg, stone warm grays, terracotta `#C2703E` / amber `#D97706` accents, olive `#5B7553` highlights
**Fonts:** Playfair Display (serif) for logo/branding, Inter for body text — loaded via Google Fonts
**Smooth scrolling:** `scroll-behavior: smooth` in globals.css
**Logo:** Replace SVG "F" icon with styled `<span className="font-logo">FORM-BUILDER</span>` text
**All layout components** (Header, Sidebar, Footer, MainLayout), auth components, and landing page get warm-tone color overhaul

**Files modified:**
- `tailwind.config.js` — warm color palette, Playfair Display font family, custom animations
- `src/app/globals.css` — Google Fonts import, smooth scroll, CSS custom properties, keyframes
- `src/app/layout.tsx` — Inter font class on body
- `src/components/layout/Header/Header.tsx` — logo text, warm colors
- `src/components/layout/Sidebar/Sidebar.tsx` — warm accents
- `src/components/layout/Footer/Footer.tsx` — warm branding
- `src/components/layout/MainLayout/MainLayout.tsx` — warm background
- `src/components/auth/AuthModal/AuthModal.tsx` — warm accents
- `src/components/auth/SignInForm/SignInForm.tsx` — warm accents
- `src/components/auth/SignUpForm/SignUpForm.tsx` — warm accents
- `src/app/page.tsx` — full landing page redesign
- `src/app/settings/profile/page.tsx` — accent colors

### Phase 2: Dashboard (Form CRUD + Card Grid)
- Expand `useFormStore` with `forms[]`, `loadForms()`, `createForm(title)`, `deleteForm(id)`
- Dashboard: "Create New Form" button → modal dialog for name → create → redirect to `/builder/[id]`
- Card grid: title, field count, created/updated dates, delete button, link to builder

**Files modified/created:**
- `src/store/useFormStore.ts` — dashboard state + API calls
- `src/app/dashboard/page.tsx` — full dashboard UI
- `src/components/builder/CreateFormDialog.tsx` — **NEW** name entry modal

### Phase 3: Drag & Drop Builder
**Extended field types:** `text`, `email`, `number`, `textarea`, `dropdown`, `checkbox`, `radio`, `date`, `file`, `rating`, `section` (content block)

**3-panel layout:**
- Left: `FieldPalette` — draggable field type cards grouped by category
- Center: `BuilderCanvas` — `@dnd-kit` sortable area, drop zone for new fields, reorder existing
- Right: `PropertyPanel` — edit selected field's label, placeholder, required, options, colors, background, border, width

**Section Block:** Content element with editable text, customizable background color, border color, border radius, stretchable width — decorative only

**Auto-save:** Debounced save to MongoDB on every field change via `PATCH /api/forms/:id`

**Files modified/created:**
- `shared/types.ts` — extend FIELD_TYPES
- `src/app/builder/[formId]/page.tsx` — full builder page
- `src/components/builder/FieldPalette.tsx` — **NEW**
- `src/components/builder/BuilderCanvas.tsx` — **NEW**
- `src/components/builder/PropertyPanel.tsx` — **NEW**
- `src/components/fields/FieldRenderer.tsx` — **NEW**
- `src/components/fields/SectionBlock.tsx` — **NEW**
- `src/components/ui/Button.tsx` — **NEW**
- `src/components/ui/Modal.tsx` — **NEW**

### Phase 4: Property Panel Features
- Label, placeholder, required toggle
- Options editor (add/remove/reorder for dropdown, checkbox, radio)
- Background color picker (warm palette swatches)
- Border color picker
- Border radius control
- Width selector (full / half / auto)
- For section blocks: editable text content area
