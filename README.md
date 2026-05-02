# TaskFlow — Team Task Manager

A full-stack web application for managing team projects and tasks with role-based access control.

## Features

- **Authentication** — Signup and login with JWT-based auth
- **Projects** — Create projects, add team members, manage roles (Admin/Member)
- **Tasks** — Create, assign, and track tasks with status (To Do / In Progress / Done), priority levels, and due dates
- **Dashboard** — Overview of all projects with task counts and progress summary
- **Role-Based Access** — Admins can manage members, delete tasks/projects; Members can create and update tasks
- **Responsive** — Works on desktop and mobile

## Tech Stack

- **Frontend:** React 19, Vite, React Router, Axios
- **Backend:** Node.js, Express, Mongoose
- **Database:** MongoDB Atlas
- **Auth:** JWT (JSON Web Tokens) + bcrypt
- **Deployment:** Railway

## Project Structure

```
Task_Management_System/
├── backend/
│   ├── models/          # Mongoose schemas (User, Project, Task)
│   └── src/
│       ├── controllers/ # Route handlers
│       ├── middlewares/  # Auth & role-based access
│       ├── routes/       # API route definitions
│       ├── libs/         # DB connection
│       ├── utils/        # Token generation
│       ├── app.js        # Express setup
│       └── server.js     # Entry point
├── frontend/
│   └── src/
│       ├── components/   # Reusable UI components
│       ├── pages/        # Page components
│       ├── context/      # Auth context
│       └── utils/        # Axios instance
└── package.json          # Root scripts for deployment
```

## Setup

### Prerequisites

- Node.js 18+
- MongoDB Atlas account (free tier works)

### 1. Clone the repo

```bash
git clone <your-repo-url>
cd Task_Management_System
```

### 2. Install dependencies

```bash
# Install all deps (backend + frontend)
npm run install:all
```

### 3. Configure environment

Create `backend/.env`:

```
MONGO_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/taskmanager
JWT_SECRET=your_secret_key_here
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 4. Run locally

```bash
# Terminal 1 — Backend
npm run dev:backend

# Terminal 2 — Frontend
npm run dev:frontend
```

Backend runs on `http://localhost:5000`, frontend on `http://localhost:5173`.

## API Endpoints

### Auth
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/signup` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Get current user |

### Projects
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/projects` | Create project |
| GET | `/api/projects` | List user's projects |
| GET | `/api/projects/:id` | Get project details |
| PUT | `/api/projects/:id` | Update project (admin) |
| DELETE | `/api/projects/:id` | Delete project (admin) |
| POST | `/api/projects/:id/members` | Add member (admin) |
| DELETE | `/api/projects/:id/members/:userId` | Remove member (admin) |

### Tasks
| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/projects/:projectId/tasks` | Create task |
| GET | `/api/projects/:projectId/tasks` | List tasks |
| GET | `/api/projects/:projectId/tasks/:id` | Get task |
| PUT | `/api/projects/:projectId/tasks/:id` | Update task |
| DELETE | `/api/projects/:projectId/tasks/:id` | Delete task (admin) |

## Deployment (Railway)

1. Push code to GitHub
2. Create a new project on [Railway](https://railway.app)
3. Connect your GitHub repo
4. Set environment variables:
   - `MONGO_URI` — your MongoDB Atlas connection string
   - `JWT_SECRET` — a random secret string
   - `NODE_ENV` — `production`
   - `PORT` — Railway sets this automatically
5. Set build command: `cd frontend && npm install && npm run build`
6. Set start command: `cd backend && npm install && npm start`

The backend serves the built frontend in production mode.

## License

MIT
