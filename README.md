# ACE Official Mail Dispatcher

A fullstack monorepo for dispatching official emails — built with **React + Vite** on the frontend and **Node.js + Express + TypeScript** on the backend.

---

## 📁 Project Structure

```
ACE-Official-Mail-dispatcher/
├── frontend/        # React + Vite + TypeScript UI
└── backend/         # Express + TypeScript REST API
```

---

## 🖥️ Frontend

**Stack:** React 19, Vite, TypeScript, React Router DOM

### Setup

```bash
cd frontend
npm install
npm run dev       # Start dev server (http://localhost:5173)
npm run build     # Production build
```

---

## 🛠️ Backend

**Stack:** Node.js, Express, TypeScript, Nodemailer

### Setup

```bash
cd backend
npm install
cp .env.example .env   # Fill in your SMTP credentials
npm run dev            # Start dev server (http://localhost:3000)
npm run build          # Compile TypeScript
npm start              # Run compiled server
```

### API Endpoints

| Method | Endpoint              | Description         |
|--------|-----------------------|---------------------|
| GET    | `/api/v1/health`      | Health check        |
| POST   | `/api/v1/mail/send`   | Send an email       |

#### POST `/api/v1/mail/send`

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Hello!",
  "html": "<p>This is the email body</p>",
  "cc": "optional@example.com",
  "bcc": "optional@example.com"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully"
}
```

---

## 🔧 Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

| Variable     | Description                          |
|--------------|--------------------------------------|
| `PORT`       | Backend server port (default: 3000)  |
| `NODE_ENV`   | `development` or `production`        |
| `SMTP_HOST`  | SMTP server hostname                 |
| `SMTP_PORT`  | SMTP port (587 for TLS, 465 for SSL) |
| `SMTP_USER`  | SMTP username / email address        |
| `SMTP_PASS`  | SMTP password / app password         |
| `SMTP_FROM`  | Sender email address                 |

---

## 🚀 Getting Started (Full Stack)

```bash
# Terminal 1 - Backend
cd backend && npm install && cp .env.example .env && npm run dev

# Terminal 2 - Frontend
cd frontend && npm install && npm run dev
```

---

## 📦 Scripts Summary

| Location   | Command         | Action                            |
|------------|-----------------|-----------------------------------|
| `backend/` | `npm run dev`   | Start with hot-reload (nodemon)   |
| `backend/` | `npm run build` | Compile TypeScript → `dist/`      |
| `backend/` | `npm start`     | Run compiled production server    |
| `frontend/`| `npm run dev`   | Start Vite dev server             |
| `frontend/`| `npm run build` | Production bundle                 |
| `frontend/`| `npm run lint`  | Run ESLint                        |

---

## 📝 License

MIT
