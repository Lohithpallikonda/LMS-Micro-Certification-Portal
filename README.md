# Micro Certification Portal

>A lightweight micro‑certification engine: take a quiz, get instant results, download a PDF certificate.

## Features
- User registration & login (JWT)
- Quiz listing & question retrieval
- Question-by-question quiz flow (React)
- Automatic scoring & pass/fail evaluation
- Result persistence (MongoDB)
- On-demand PDF certificate generation (PDFKit)
- Seed script with sample quiz & demo user

## Tech Stack
| Layer | Stack |
|-------|-------|
| Frontend | React (Vite), React Router, Axios |
| Backend | Node.js, Express, Mongoose |
| Database | MongoDB Atlas (or local) |
| Auth | JWT (HS256) |
| PDF | PDFKit |
| Deployment | Vercel (backend + frontend) |

## Repository Structure
```
backend/
	src/
		config/ db.js
		middleware/ auth.js errorHandler.js
		models/ User.js Quiz.js Question.js Result.js
		routes/ authRoutes.js quizRoutes.js resultRoutes.js
		utils/ jwt.js certificate.js
		index.js
	scripts/ seed.js
	vercel.json
frontend/
	index.html
	src/
		api/client.js
		context/AuthContext.jsx
		pages/App.jsx (routes & pages)
```

## Environment Variables
Create `backend/.env` (based on `.env.example`):
```
PORT=4000
MONGO_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/microcert
JWT_SECRET=replace_with_strong_secret
CERT_ORG_NAME=AGH Learning
PASS_THRESHOLD=50
```
Frontend optional `.env` (at `frontend/.env`):
```
VITE_API_URL=https://<your-backend-vercel-domain>/api
```

## Local Development
Install dependencies:
```powershell
cd backend; npm install; cd ../frontend; npm install
```
Run backend (ensure Mongo running / Atlas string valid):
```powershell
cd backend
npm run dev
```
Seed data:
```powershell
cd backend
npm run seed
```
Run frontend:
```powershell
cd frontend
npm run dev
```
Access frontend at `http://localhost:5173` (default Vite) and backend health at `http://localhost:4000/api/health`.

Demo credentials after seeding:
```
Email: demo@example.com
Password: Password123
```

## API Summary
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | /api/auth/register | Register new user | No |
| POST | /api/auth/login | Login & receive JWT | No |
| GET | /api/quizzes | List active quizzes | No |
| GET | /api/quizzes/:quizId/questions | Get quiz & questions | Yes |
| POST | /api/results/quiz/:quizId/submit | Submit answers | Yes |
| GET | /api/results/:resultId | Fetch result summary | Yes |
| GET | /api/results/:resultId/certificate.pdf | Download certificate PDF | Yes |

Submit payload example:
```json
{
	"answers": [
		{ "questionId": "<ObjectId>", "selectedOption": 2 },
		{ "questionId": "<ObjectId>", "selectedOption": 3 }
	]
}
```

Result response example:
```json
{
	"resultId": "...",
	"score": 4,
	"total": 5,
	"percentage": 80,
	"passed": true
}
```

## Certificate
Generated dynamically with: student name, quiz title, percentage, pass/fail, issue date. Logic in `backend/src/utils/certificate.js`.

## Deployment (Vercel)
### Backend
1. From project root: deploy `backend` folder as a Vercel project.
2. Set environment variables in Vercel dashboard (same as `.env`).
3. After deployment, note the backend URL (e.g. `https://micro-cert-backend.vercel.app`).

### Frontend
1. Deploy `frontend` as a separate Vercel project.
2. Add env var `VITE_API_URL=https://<backend-domain>/api`.
3. Rebuild & verify quiz fetch and submission.

### Alternative Monorepo Approach
You can keep two Vercel projects pointing at subfolders. Current `backend/vercel.json` config ensures `src/index.js` is the entry. The frontend build requires no extra config.

## Security Notes
- JWT stored in `localStorage` for simplicity (improve with httpOnly cookie if desired).
- Rate limiting & helmet middleware can be added for production.
- Avoid exposing secret answers; API never returns `correctAnswer` fields.

## Possible Enhancements
- Timed quizzes
- Leaderboard (aggregate best percentages)
- Shareable result link tokens
- Email certificate delivery
- Admin UI to manage quizzes/questions

## Scripts
Backend:
```powershell
npm run dev   # local dev with watch
npm run seed  # insert sample data
```
Frontend:
```powershell
npm run dev
npm run build
```

## Screenshots
Add screenshots here after deployment (Home, Quiz, Result, Certificate PDF sample).

## License
Internal educational use (add proper license if needed).

---
For questions or improvements, open an issue or PR.
# LMS-Micro-Certification-Portal
