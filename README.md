# 🕒 Laterly.ai — Save Smarter, Read with Purpose

> Your personal AI-powered reading assistant — save with intent, get summaries, and organize your reading life.

---

## 🔗 Live

- **Dashboard:** https://laterly-ai.vercel.app/ (highlight)
- **API Base:** https://laterly-ai.onrender.com/api/

---

## 🚀 What is Laterly.ai?

Laterly.ai combines a Chrome extension and a web dashboard to help you capture articles with context, summarize them, and resurface what matters.

- 🔖 Save any page from the extension or manually from the dashboard
- 💬 Add “why am I saving this?” intent to keep context
- 🧠 AI-generated summaries + topic tagging
- 🔎 Search by intent, title, topic, or text
- 📊 Dashboard to review, bookmark, and mark as read

---

## ✨ Feature Highlights

- **Chrome Extension (MV3):** one-click save with optional intent; auto-grabs page content.
- **Manual Save (Dashboard):** enter URL, title, intent, and content without the extension.
- **AI Summaries & Topics:** content is sent to AI for summary, topic detection, and intent normalization.
- **Smart Search:** filter by intent or topics; view trending intents.
- **Read/Bookmark States:** manage your queue from the dashboard.

---

## 🧩 Tech Stack

| Layer      | Stack                                      |
| ---------- | ------------------------------------------ |
| Frontend   | React, TypeScript, Tailwind, shadcn/ui     |
| Extension  | Vite + React, Manifest v3                  |
| State Mgmt | Redux Toolkit, RTK Query                   |
| Backend    | NestJS (TypeScript), OpenAI API (AI tasks) |
| Database   | PostgreSQL via Prisma                      |

---

## 📦 Setup

### Prerequisites

- Node.js (v20 recommended)
- npm
- Chrome (for loading the extension)

### Install dependencies

```bash
# extension
cd extension && npm install

# dashboard
cd ../dashboard && npm install

# backend
cd ../backend && npm install
```

### Env

- `extension/.env` uses `VITE_DASHBOARD_URL` and `VITE_BACKEND_URL`.
- `dashboard/.env` expects `VITE_API_URL` pointing to the backend (e.g., `https://laterly-ai.onrender.com`).
- `backend/.env` should include DB URL, JWT secret, and OpenAI creds (see sample in repo).

### Run the Extension

```bash
cd extension
npm run dev
```

Load the built `dist/` folder in `chrome://extensions` as an unpacked extension (Manifest v3).

### Run the Dashboard

```bash
cd dashboard
npm run dev
```

Open http://localhost:5173

### Run the Backend

```bash
cd backend
npm run start:dev
```

Backend serves under `/api` (e.g., http://localhost:3000/api).

---

## 🛣️ Roadmap

- [x] Save with intent via extension
- [x] Manual save from dashboard
- [x] AI summaries + topic detection
- [x] Dashboard search + trending intents
- [ ] Weekly digest emails
- [ ] Topic-based exploration UX
- [ ] Shared/collaborative reading lists

---

## 🙌 Contributing

PRs welcome! If you're passionate about productivity, AI, or reading — [open an issue](https://github.com/SharadSaha/laterly.ai/issues).

---

## 🧑‍💻 Author

Built by [@SharadSaha](https://github.com/SharadSaha)

---

## 📄 License

MIT © 2025
