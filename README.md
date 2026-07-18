# Collaborative Drag & Drop Form Builder

Full-stack app: Next.js (App Router, TypeScript) + Express + Socket.io + MongoDB,
all running as **one Node.js process** via a custom server.

See [`PLAN.md`](./PLAN.md) for the full project plan, architecture notes, data
models, API design, and build roadmap.

## Requirements

- Node.js 18.18+ (20 LTS recommended)
- A MongoDB instance — local (`mongod`), Docker, or a free Atlas cluster

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Configure environment
cp .env.example .env
# then edit .env: set MONGODB_URI and a real JWT_SECRET

# 3. Run in development
npm run dev
```

The app will be available at **http://localhost:3000** — this single URL
serves the React frontend, the `/api/*` REST endpoints, and the Socket.io
real-time layer.

Quick sanity check once it's running: open `http://localhost:3000/api/health`
— you should see `{"ok": true}`.

## Production build

```bash
npm run build   # builds Next.js, then compiles the server (see postbuild)
npm start        # runs the compiled server from dist/
```

## Project structure

```
server/     Express app, Socket.io, Mongoose models/routes/controllers
src/app/    Next.js pages (App Router)
src/        components, hooks, store, lib (frontend code)
shared/     Types + Zod schemas shared between client and server
```

## Where to go next

The scaffold gives you: auth endpoints, form CRUD endpoints, Mongoose models,
a working custom server (Express + Socket.io + Next.js in one process), and
placeholder pages. Follow the build order in `PLAN.md` section 7 — start with
auth, then forms CRUD UI, then the drag-and-drop builder itself, and layer in
Socket.io real-time editing last.
