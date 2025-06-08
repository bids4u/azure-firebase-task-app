# 📝 Azure Firebase Task App

A full-stack task management application built with:

- 🔥 Firebase Authentication (Google Sign-In)
- ⚛️ React (Frontend)
- ☁️ Azure Static Web App (Frontend Hosting)
- 📡 Azure Functions v4 (Backend API)
- 🍃 MongoDB Atlas (Database)

---

## 📁 Project Structure

azure-firebase-task-app/
├── task-app-front/ # React frontend (Firebase Auth + Task UI)
├── task-app-back/ # Azure Functions backend (Node.js + MongoDB)


---

## 🚀 Features

- ✅ Google Sign-In via Firebase
- ✅ Secure backend with Firebase token validation
- ✅ Task CRUD (Create, Read, Update, Delete)
- ✅ Persistent task storage with MongoDB
- ✅ Serverless architecture (Azure Functions)
- ✅ CI/CD deployment with GitHub Actions

---

## 🔐 Authentication

Uses **Firebase Authentication** with Google Sign-In.

- Frontend uses `signInWithPopup` to authenticate.
- Backend validates JWT using Firebase Admin SDK (`utils/auth.js`).

---

## ⚙️ Backend Setup

Located in `task-app-back/`

### Prerequisites:
- Azure CLI & Azure Function Core Tools
- MongoDB URI (Atlas recommended)
- Firebase Admin SDK JSON key

### Steps:

1. Install dependencies:

```bash
cd task-app-back
npm install
```
2. Set up local.settings.json:

```bash
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "MONGODB_URI": "<your-mongodb-uri>",
    "FIREBASE_PROJECT_ID": "<your-project-id>",
    "FIREBASE_CLIENT_EMAIL": "<your-service-account-email>",
    "FIREBASE_PRIVATE_KEY": "<your-private-key>"
  }
}
```

3. Run locally:

```bash
npm start
```
 or
```bash
func start
```

