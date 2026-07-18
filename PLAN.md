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
