# 🔥 TaskFlow – Team Task Manager

TaskFlow is a full-stack team collaboration app that helps users manage projects and tasks efficiently.
It allows teams to create projects, assign tasks, and track progress in a clean and intuitive interface.

---

## 🚀 Live Demo

🌐 Live App: https://team-task-manager-zaid.netlify.app
📦 Backend API: (Add your Railway URL here)

---

## 📌 Features

* 🔐 User Authentication (Login / Register)
* 📁 Create and manage projects
* 📝 Create, assign, and update tasks
* 📊 Track task status (Pending → Done)
* 🎯 Kanban-style task workflow (drag & drop)
* ⚡ Real-time UI updates
* 🔒 Secure API with JWT authentication

---

## 🛠️ Tech Stack

### Frontend

* React.js (Vite)
* Tailwind CSS
* Axios

### Backend

* Node.js
* Express.js
* Firebase Firestore

### Authentication

* JWT (JSON Web Token)
* bcrypt.js

### Deployment

* Frontend → Netlify
* Backend → Railway

---

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository

```bash
git clone https://github.com/codecrafter10/team-task-manager.git
cd team-task-manager
```

---

### 2️⃣ Setup Backend

```bash
cd server
npm install
```

Create a `.env` file inside `/server`:

```env
MONGO_URI=your_database_url
JWT_SECRET=your_secret_key
```

Start server:

```bash
npm start
```

---

### 3️⃣ Setup Frontend

```bash
cd client
npm install
npm run dev
```

---

## 🌐 API Endpoints

### Auth

* POST `/api/auth/register`
* POST `/api/auth/login`

### Projects

* POST `/api/projects/create`

### Tasks

* POST `/api/tasks/create`
* GET `/api/tasks/:projectId`
* PUT `/api/tasks/:taskId`
* DELETE `/api/tasks/:taskId`

---

## 📸 Screenshots

![Uploading image.png…]()


## 📂 Project Structure

```bash
team-task-manager/
│
├── client/        # React Frontend
├── server/        # Node Backend
├── README.md
```

---

## ⚠️ Important Notes

* Environment variables are not included for security reasons
* Ensure backend is deployed before using frontend
* Update API URL in frontend before deployment

---

## 👨‍💻 Author

**Zaid Ali**
Computer Science Engineer | Full Stack Developer

---

## ⭐ Final Words

This project demonstrates:

* Full-stack development
* Authentication & security
* API integration
* Modern UI/UX design
* Deployment skills

---
