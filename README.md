# Forum

A simple Q&A forum: Express + MongoDB backend (`forum-backend`) and a Next.js frontend (`forum-frontend`).

## Setup

1. Backend

   ```bash
   cd forum-backend
   npm install
   cp .env.example .env   # then set MONGODB_URI and JWT_SECRET
   npm start              # runs on http://localhost:5000
   ```

2. Frontend (in a second terminal)

   ```bash
   cd forum-frontend
   npm install
   npm run dev            # runs on http://localhost:3000
   ```

The frontend forwards every `/api/*` request to the backend (see `forum-frontend/next.config.mjs`).
If the backend runs somewhere other than `http://localhost:5000`, set `BACKEND_URL` before starting the frontend.

## API

| Method | Path | Auth | Description |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | | Register (`email`, `password`, `name`) |
| POST | `/api/auth/login` | | Log in (`email`, `password`) |
| GET | `/api/auth/me` | yes | Your profile with join date and stats (threads, replies, likes received) |
| PATCH | `/api/auth/me` | yes | Update `name` and `email` (returns a new token) |
| PATCH | `/api/auth/password` | yes | Change password (`current_password`, `new_password`, min 6 characters) |
| DELETE | `/api/auth/me` | yes | Delete your account (`password`), with your threads, replies and likes |
| GET | `/api/questions` | | List questions (with `answer_count` and `last_activity`) |
| POST | `/api/questions` | yes | Start a thread (`title`, `question_text`) |
| GET | `/api/questions/:id` | | Get one question |
| DELETE | `/api/questions/:id` | yes (owner) | Delete a question and its answers |
| GET | `/api/questions/:id/answers` | | List answers to a question |
| POST | `/api/questions/:id/answers` | yes | Answer a question (`answer_text`) |
| POST | `/api/answers/:id/like` | yes | Like / unlike someone else's answer |
| DELETE | `/api/answers/:id` | yes (owner) | Delete an answer |

Authenticated requests send `Authorization: Bearer <token>`, using the token returned by register/login.
