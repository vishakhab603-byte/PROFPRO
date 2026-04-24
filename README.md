# ProfPro 📡

> A real-time faculty availability tracker — built with Node.js, Express, MongoDB Atlas, and vanilla JS. Deployed on Vercel.

Students can instantly check whether a professor is available, in a lecture, in a meeting, or offline — no more wandering hallways.

**Live demo:** `https://profpro.vercel.app` ← 
---

## 🖥️ Tech Stack

| Layer    | Technology                        |
|----------|----------------------------------|
| Backend  | Node.js · Express.js (serverless) |
| Database | MongoDB Atlas · Mongoose          |
| Frontend | Vanilla HTML / CSS / JS           |
| Hosting  | Vercel (frontend + API together)  |

---

## 🚀 Local Development

### Prerequisites
- Node.js v18+
- A [MongoDB Atlas](https://cloud.mongodb.com) account (free tier works)

### Setup

```bash
# 1. Clone the repo

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example server/.env
# Then open server/.env and paste your MongoDB connection string

# 4. Start the backend
npm run dev        # auto-restarts with nodemon
# npm start        # production mode

# 5. Open the frontend
# Open client/index.html in your browser
# (while the backend is running on localhost:5000)
```

---

## ☁️ Deploy to Vercel

### One-time setup

```bash
# Install Vercel CLI globally
npm install -g vercel

# Log in
vercel login
```

### Deploy

```bash
# From the project root — Vercel reads vercel.json automatically
vercel

# Follow the prompts:
#   Set up and deploy? → Y
#   Which scope? → your username
#   Link to existing project? → N
#   Project name? → profsync (or anything)
#   In which directory is your code? → ./  (just press Enter)
```

### Add your environment variable on Vercel

After deploying, go to your project on **vercel.com → Settings → Environment Variables** and add:

| Key           | Value                                  |
|---------------|----------------------------------------|
| `MONGODB_URI` |  MongoDB Atlas connection string |

Then redeploy:

```bash
vercel --prod
```

That's it — your frontend and API are live on the same domain. ✅

---

## 📡 API Reference

Base URL (local): `http://localhost:5000`  
Base URL (prod): `https://your-project.vercel.app`

| Method | Endpoint                          | Description            |
|--------|-----------------------------------|------------------------|
| GET    | `/api/teachers`                   | Get all teachers       |
| GET    | `/api/teachers?status=Available`  | Filter by status       |
| GET    | `/api/teachers?department=CS`     | Filter by department   |
| GET    | `/api/teachers/:id`               | Get one teacher        |
| POST   | `/api/teachers`                   | Add a teacher          |
| PUT    | `/api/teachers/:id`               | Update teacher         |
| DELETE | `/api/teachers/:id`               | Delete teacher         |

### Request body (POST / PUT)
```json
{
  "name": "Dr. Arjun Mehta",
  "subject": "Data Structures",
  "department": "Computer Science",
  "currentStatus": "Available"
}
```

### Status values
`Available` · `In Lecture` · `In Meeting` · `On Break` · `Offline`

---

## 📁 Project Structure

```
profsync/
├── vercel.json                    # Routes /api/* → Express, /* → client/
├── .env.example                   # Template — copy to server/.env
├── .gitignore
├── package.json
├── README.md
├── server/
│   ├── server.js                  # Express app — works locally & serverless
│   ├── .env                       # ← NOT committed (in .gitignore)
│   ├── models/
│   │   └── Teacher.js             # Mongoose schema
│   └── routes/
│       └── teacherRoutes.js       # Full CRUD REST routes
└── client/
    └── index.html                 # Frontend dashboard (no build step)
```

---

## ✨ Features

- **Full CRUD** — add, edit, delete teachers
- **Live status cycling** — click a badge to cycle Available → In Lecture → etc.
- **Filter & search** — filter by status, search by name/subject/department
- **Stats bar** — total faculty, available count, availability rate
- **Toast notifications** — feedback on every action
- **Serverless-ready** — Mongoose connection cached per warm instance

---

## 🔑 Environment Variables

| Variable      | Required | Description                         |
|---------------|----------|-------------------------------------|
| `MONGODB_URI` | ✅ Yes   | MongoDB Atlas connection string      |
| `PORT`        | ❌ No    | Port for local dev (default: 5000)  |

---

## 🛣️ Future Plans

- [ ] JWT authentication so only faculty can update their own status
- [ ] WebSocket support for push updates across all connected clients  
- [ ] Weekly timetable view per teacher
- [ ] QR code for quick profile lookup

---

*Built as part of a full-stack web development project.*

