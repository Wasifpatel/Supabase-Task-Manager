# React + TypeScript + Vite + Supabase

# 📝 Supabase Task Manager

A simple yet powerful **Task Manager** application built with [React + Vite](https://vitejs.dev/), powered by [Supabase](https://supabase.com/) as the backend, and deployed seamlessly on [Vercel](https://vercel.com/).  

Manage tasks effortlessly with an intuitive interface, real-time updates, and secure authentication.
---

## 🚀 Features
- ✅ User authentication with Supabase
- 📌 Add, edit, and delete tasks
- 📅 Store task details with title, description, and timestamp
- 🔄 Real-time data sync with Supabase
- 🌐 Fully responsive UI
- ☁️ Deployed on Vercel

---

## 🛠️ Tech Stack
- **Frontend:** React, Vite, TailwindCSS (if used)
- **Backend:** Supabase (Database + Auth)
- **Deployment:** Vercel

---

## 📂 Project Structure
supabase-task-manager/
│── src/
│ ├── components/ # Reusable components
│ ├── pages/ # Page-level components
│ ├── App.jsx # Root component
│ └── main.jsx # Entry point
│── public/ # Static assets
│── .env.local # Environment variables
│── package.json # Dependencies
│── README.md

## ⚙️ Installation & Setup

### 1️⃣ Clone the repository
git clone https://github.com/your-username/supabase-task-manager.git
cd supabase-task-manager

2️⃣ Install dependencies
npm install

3️⃣ Setup environment variables
Create a .env.local file in the root directory and add your Supabase credentials:
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

4️⃣ Run the development server
npm run dev
Your app should now be running at http://localhost:5173.
