# Rate Limiter Middleware (Express.js)

## 📌 Overview
This project implements a **custom rate-limiting middleware** in **Express.js** that restricts users to a fixed number of requests within a given time window.

The middleware:
- Allows **5 requests per minute per user**
- Identifies users using **UUID v4**
- Uses an **in-memory Map** for tracking requests
- Automatically **resets limits after the time window**
- Returns proper **rate-limit headers**
- Responds with **HTTP 429** when the limit is exceeded

This project was built as part of a backend hackathon task to demonstrate middleware design, scalability thinking, and clean code practices.

---

## ⚙️ Tech Stack
- Node.js
- Express.js
- UUID
- dotenv

---

## 📁 Project Structure

rate-limiter-middleware/
│
├── src/
│ ├── middleware/
│ │ └── rateLimiter.js
│ ├── routes/
│ │ └── test.routes.js
│ ├── config/
│ │ └── env.js
│ ├── app.js
│ └── server.js
│
├── .env
├── LLM_PROMPTS.md
├── package.json
└── README.md


---

## 🔐 Rate Limiting Rules
- **Limit:** 5 requests
- **Time Window:** 60 seconds
- **Scope:** Per user (UUID v4)
- **Applied:** Globally (all routes)

---

## 📦 Environment Variables

Create a `.env` file in the root directory:

```env
PORT=5000
RATE_LIMIT=5
RATE_WINDOW_SEC=60
🚀 How to Run the Project
1️⃣ Install dependencies
npm install
2️⃣ Start the server
npm run dev
Server will run on:

http://localhost:5000
🧪 Testing the Rate Limiter (Thunder Client)
Test Endpoint
GET /api/test
Headers Returned
X-User-Id
X-RateLimit-Limit
X-RateLimit-Remaining
X-RateLimit-Reset
Expected Behavior
First 5 requests → ✅ Allowed

6th request within 1 minute → ❌ HTTP 429

After 1 minute → ✅ Access restored

Error Response (429)
{
  "error": "rate_limited",
  "message": "Too many requests, please try again later."
}
🧹 Auto Cleanup Strategy
A background cleanup job runs using setInterval to remove expired users from memory, preventing memory leaks in long-running applications.

📈 Scalability Note
This implementation uses an in-memory Map, suitable for single-instance applications.
For production or distributed systems, a shared store like Redis with TTL would be recommended.

