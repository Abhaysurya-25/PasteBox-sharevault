# PasteBox

A modern file-sharing platform built with the MERN stack and AWS S3. Upload files, generate short links, protect downloads with passwords, set expiry dates, and share via QR code, WhatsApp, Facebook, or email.

## Features

- **Guest uploads** — Share files without creating an account (session stored locally)
- **User accounts** — Register, log in, and manage files from a dashboard
- **Cloud storage** — Files stored on AWS S3 with signed preview/download URLs
- **Security** — Optional password protection and link expiry
- **Sharing** — Short links (`/f/…` for users, `/g/…` for guests), QR codes, social share, server-side email
- **Analytics** — Upload and download counts on the dashboard
- **Modern UI** — React + Tailwind CSS, light/dark mode, responsive layout

## Tech stack

| Layer    | Technologies                                      |
| -------- | ------------------------------------------------- |
| Frontend | React 18, Vite, Tailwind CSS, Redux Toolkit       |
| Backend  | Node.js, Express, MongoDB Atlas, Mongoose         |
| Storage  | AWS S3 (SDK v3)                                   |
| Auth     | JWT, bcrypt                                       |
| Email    | Nodemailer (Gmail SMTP + App Password)            |

## Project structure

```
pastebox-file-sharing-platform/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/
│       ├── redux/
│       └── config/
└── server/          # Express API
    └── src/
        ├── controllers/
        ├── models/
        ├── routes/
        └── config/
```

## Prerequisites

- Node.js 18+
- MongoDB Atlas (or local MongoDB)
- AWS account with S3 bucket and IAM credentials
- Gmail account with 2-Step Verification (for App Password email sharing)

## Setup

### 1. Clone and install

```bash
git clone <your-repo-url>
cd pastebox-file-sharing-platform

cd client && npm install
cd ../server && npm install
```

### 2. Server environment

Copy `server/.env.sample` to `server/.env` and fill in:

```env
PORT=6600
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_REGION=your_region
AWS_BUCKET_NAME=your_bucket

MAIL_USER=your@gmail.com
MAIL_PASS=your_16_char_gmail_app_password
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_SECURE=false

FRONTEND_URL=https://your-vercel-app.vercel.app
BASE_URL=https://your-vercel-app.vercel.app
```

For Gmail, create an [App Password](https://myaccount.google.com/apppasswords) and use it as `MAIL_PASS`.

### 3. Client environment (optional)

```env
# client/.env
VITE_API_URL=https://your-render-api.example.com/api
```

### 4. Run locally

**Terminal 1 — API**

```bash
cd server
npm start
```

**Terminal 2 — Frontend**

```bash
cd client
npm run dev
```

- App: (see `FRONTEND_URL`)  
- API: (see `VITE_API_URL`)  

## Main routes

| Route            | Description              |
| ---------------- | ------------------------ |
| `/`              | Guest upload & landing   |
| `/login`         | Sign in                  |
| `/signup`        | Register                 |
| `/dashboard`     | User dashboard (auth)    |
| `/f/:shortCode`  | Download shared user file |
| `/g/:shortCode`  | Download shared guest file |

## Scripts

**Client**

```bash
npm run dev      # development
npm run build    # production build
npm run preview  # preview build
```

**Server**

```bash
npm start        # nodemon dev server
```

## License

MIT

---

Made with ♥ by Abhay Surya
