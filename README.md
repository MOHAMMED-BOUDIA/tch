# Nexus Pro

Enterprise workspace collaboration platform built with Next.js.

## Tech Stack

- **Framework:** Next.js 15 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS v4
- **Database:** MongoDB (Mongoose)
- **Auth:** JWT (jsonwebtoken + bcryptjs)
- **Real-time:** Socket.IO (optional, external server)
- **UI:** Lucide React, Motion (Framer Motion)

## Getting Started

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Edit .env.local with your MongoDB URI and JWT secret

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Project Structure

```
app/
  api/              # API routes (serverless)
  dashboard/        # Authenticated dashboard pages
  login/            # Login page
  page.tsx          # Landing page
components/         # Shared React components
lib/
  models/           # Mongoose schemas
  auth.ts           # JWT auth helpers
  db.ts             # MongoDB connection
  types.ts          # Shared TypeScript types
```

## API Routes

All Express backend logic has been migrated to `app/api/` as Next.js route handlers:

- `api/auth/*` — login, register, forgot-password, reset-password, logout
- `api/graph` — knowledge graph data
- `api/users/*` — user search, profiles, projects
- `api/projects/*` — CRUD for projects
- `api/notes/*` — user notes
- `api/messages/*` — direct messaging (REST + Socket.IO for real-time)
- `api/admin/*` — admin dashboard, user management, groups, settings, broadcast, logs
- `api/notifications/*` — user notifications
- `api/upload` — file upload

## Deployment (Vercel)

1. Push to GitHub
2. Import to Vercel
3. Set environment variables in Vercel dashboard:
   - `MONGO_URI` — MongoDB connection string
   - `JWT_SECRET` — Secret for JWT signing
4. Deploy

### Socket.IO

Real-time chat requires a persistent WebSocket server. For production on Vercel, deploy a separate Socket.IO server and set `NEXT_PUBLIC_SOCKET_URL` to its URL. Without it, chat falls back to REST-based messaging.
