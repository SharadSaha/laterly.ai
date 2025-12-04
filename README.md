# 🕒 Laterly.ai — Save Smarter, Read with Purpose

> Your personal AI-powered reading assistant — save articles with intent, get summaries, and organize your reading life.

---

## 🚀 What is Laterly.ai?

**Laterly.ai** is a productivity-focused web tool + Chrome extension that lets users:

- 🔖 Save any article from the web with a single click
- 💬 Optionally add _"Why am I saving this?"_ intent
- 🧠 View AI-generated summaries of saved articles
- 📬 Get digest emails & smart search from your dashboard

All powered by OpenAI, FastAPI, React, Redux Toolkit, and RTK Query.

---

## 🧩 Tech Stack

| Layer      | Stack                                  |
| ---------- | -------------------------------------- |
| Frontend   | React, TypeScript, Tailwind, shadcn/ui |
| Extension  | Vite, React, Manifest v3               |
| State Mgmt | Redux Toolkit, RTK Query               |
| Backend    | Nest (TypeScript), OpenAI API          |
| Storage    | PostgreSQL (via Prisma)                |

---

## ✨ Features

- 🧩 Chrome Extension to save pages with optional "intent"
- 🤖 AI summaries (Gemini)
- 🔎 Full-text search across saved articles and intents
- 🏷️ Tagging + topic detection
- 📨 Weekly digest email (planned)
- 📊 Dashboard to manage, search, and explore saved content

---

## 📦 Setup Instructions

### 🧰 Prerequisites

- Node.js (v20 recommended)
- NPM
- Chrome (to load the extension)

### 🛠️ Install all packages

\`\`\`bash
cd extension && npm install
cd ../dashboard && npm install
\`\`\`

### ▶️ Run the Extension

\`\`\`bash
cd extension
npm run dev
\`\`\`

Load the \`dist/\` folder in [chrome://extensions](chrome://extensions) as an unpacked extension.

### 🧭 Run the Dashboard

\`\`\`bash
cd dashboard
npm run dev
\`\`\`

Open [http://localhost:5173](http://localhost:5173)

---

## 🛣️ Roadmap

- [x] Save article with intent via extension
- [x] AI summarization
- [x] Dashboard listing with smart search
- [ ] Weekly digest emails
- [ ] Topic-based exploration
- [ ] Collaborative/shared reading lists

---

## 💡 Inspiration

> We all save articles for "later", but rarely return. Laterly helps you **remember _why_ you saved**, then turns that into action with **AI summaries, search, and intent recall**.

---

## 🙌 Contributing

PRs are welcome! If you're passionate about productivity, AI, or reading — [open an issue](https://github.com/SharadSaha/laterly.ai/issues).

---

## 🧑‍💻 Author

Built with ❤️ by [@SharadSaha](https://github.com/SharadSaha)

---

## 📄 License

MIT © 2025
