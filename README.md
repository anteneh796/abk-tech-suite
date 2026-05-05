# ABK Technologies — Enterprise Suite

Monorepo scaffold for the ABK Technologies Final Year Project (MERN + advanced patterns)

This repo contains two top-level folders:
- `backend` — Node.js + Express + MongoDB API
- `frontend` — React (Next.js) client (scaffold instructions below)

Goals:
- Demonstrate Enterprise Patterns: RBAC, server-side validation, state management (React Query), image optimization (Cloudinary), and polished UX (Tailwind + Framer Motion).

Quick start — Backend

1. Open a terminal in `backend`.

2. Copy `.env.example` to `.env` and set values:

- `MONGO_URI`
- `JWT_SECRET`
- `CLOUDINARY_URL`
- `PORT` (optional)

3. Install and run:

```powershell
cd backend; npm install
# for development (if you have nodemon)
npm run dev
# or
npm start
```

Quick start — Frontend

I recommend scaffolding the frontend with Vite and then installing the suggested libraries (Tailwind, React Query, React Hook Form, Zod, Framer Motion).

Commands to create the frontend (run from project root):

```powershell
# Create Vite React app
npm create vite@latest frontend -- --template react
cd frontend
npm install
# then follow Tailwind + library setup instructions (see frontend/README.md)
```

What's here now (scaffolded):
- `backend/src` with a basic Express server, MongoDB connection helper, `User` model, auth controller and routes, and JWT middleware.
- `frontend` folder placeholder + notes to scaffold with Vite.

Next steps I can do for you (pick one):
- Implement Service, ServiceTicket, and Startup models + controllers.
- Add Cloudinary upload middleware and example route.
- Scaffold the React app (Vite) and pre-install frontend libraries and a sample `Landing` page.
- Configure CI (GitHub Actions) for tests and linting.

Tell me which next step you want me to implement now.