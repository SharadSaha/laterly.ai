# Laterly.ai Dashboard (Vite + React + TypeScript)

Modern dashboard built with React 18, TypeScript, Vite, Redux Toolkit, RTK Query, Tailwind, shadcn-style UI, Framer Motion, and React Router.

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:5173.

## Environment

- Copy `.env` and set `VITE_API_URL` (e.g. `http://localhost:3000`).
- Auth uses HttpOnly cookies; `fetchBaseQuery` sends credentials by default.

## Features

- Auto-login via `/api/me` using existing session cookie.
- Login form posts to `/api/auth/login` and stores returned `access_token` in Redux.
- Article CRUD actions with optimistic updates for bookmark/read/delete.
- Intent search (`/api/articles/filter?intent=`) with trending intents fallback.
- Topic search (`/api/topics` + filter) with multi-select chip cloud.
- Article detail page with AI summary, excerpt, resummarize, and original link.

## API assumptions

- Optional endpoint `/api/intents/trending` may return an array of `{ id, phrase }`. If missing, UI falls back to topic names or sample intents.
- Article list endpoints return `{ items: Article[]; total: number }` where `Article` matches the contract in the prompt.

## Scripts

- `npm run dev` – start dev server
- `npm run build` – type-check + build
- `npm run preview` – preview production build
- `npm run lint` – lint sources
