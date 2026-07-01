# TaskFlow — Premium MERN Task Tracker

A feature-rich, high-performance Task Management Web Application built using the MERN Stack (MongoDB, Express, React, Node.js) with premium responsive styling, theme toggling, full-featured CRUD APIs, search filtering, and smart sorting mechanisms.

## ✨ Features

- **Dynamic Statistics Dashboard**: Completed vs total tasks, completion percentage visualized via a circular progress meter, and status-specific counts.
- **Full CRUD Capabilities**: Add, view details, start progress, complete, edit, and delete tasks dynamically.
- **Robust Field Validation**: Form validation with instant error display and prevention of past due dates.
- **Advanced Searching & Sorting**: Find tasks via text matches in title/description and sort by due dates, title alphabetically, or creation time.
- **Filterable Workspace**: Display tasks matching specific status (Todo, In Progress, Completed) and priority (Low, Medium, High).
- **Responsive Premium Styling**: Handcrafted with HSL CSS variables, glassmorphic structures, custom animations, and a seamless Dark/Light Mode toggle.
- **Zero-Config Database Fallback**: Spins up an automated in-memory MongoDB server when `MONGO_URI` is omitted from configurations, making local development instantaneous.
- **Animated Toast Management**: Responsive slide-in alerts notifying you of every CRUD action success or failure.

---

## 🛠️ Technology Stack

- **Frontend**: Vite + React, Lucide React (Icons), Axios, Vanilla CSS Custom Variables & Transitions.
- **Backend**: Node.js + Express.js (ESM), Mongoose.
- **Database**: MongoDB (Mongoose Schema) with `mongodb-memory-server` dev fallback.

---

## 🚀 Running Locally

Follow these instructions to start the application on your computer:

### 1. Install Dependencies
Run the install command from the root workspace directory to install dependencies for the backend, frontend, and root-level scripts:
```bash
npm run install-all
```

### 2. Environment Configurations (Optional)
If you want to use a persistent MongoDB Atlas server instead of the automatically launched in-memory server, copy `backend/.env.example` into a file named `backend/.env` and insert your URI:
```env
PORT=5001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/taskflow?retryWrites=true&w=majority
NODE_ENV=development
```

### 3. Launch Development Servers
Launch both client and API server concurrently in a single command:
```bash
npm run dev
```

- **Frontend Application**: `http://localhost:5173`
- **Backend REST API**: `http://localhost:5001`

---

## ☁️ Deployment Instructions

### Backend Deployment (e.g., Render, Railway, or Heroku)
1. Set the root folder for your backend service as `backend/`.
2. Define the following environment variables in the platform dashboard:
   - `MONGO_URI`: Your production MongoDB connection string.
   - `PORT`: Usually automatically set by hosting platforms, default is `5001` in code.
   - `NODE_ENV`: `production`
3. The build & start script commands should run `npm install` followed by `npm start`.

### Frontend Deployment (e.g., Vercel, Netlify, or Github Pages)
1. Set the root directory to `frontend/`.
2. Set the build command to `npm run build` and output directory to `dist/`.
3. Provide the production backend API URL in the environment variables:
   - `VITE_API_URL`: `https://your-backend-service-url.onrender.com/api/tasks`
