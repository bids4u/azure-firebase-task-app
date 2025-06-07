# SmartTodo App

SmartTodo is a simple, secure, and efficient task management app built with React. It uses Firebase Authentication for user login, Azure Functions for backend APIs, and is deployed as an Azure Static Web App.

---

## Features

- Google Sign-In authentication with Firebase Auth
- Add, edit, and track todo tasks with status (Pending, In Progress, Completed)
- Backend API implemented with Azure Functions
- Responsive UI for desktop and mobile
- Continuous deployment via GitHub Actions to Azure Static Web Apps

---

## Tech Stack

| Component           | Technology           |
|---------------------|---------------------|
| Frontend            | React, Tailwind CSS (optional) |
| Authentication      | Firebase Authentication (Google Sign-In) |
| Backend API         | Azure Functions (HTTP triggered) |
| Hosting & Deployment| Azure Static Web Apps + GitHub Actions |

---

## Getting Started

### Prerequisites

- Node.js (v14+ recommended)
- Firebase project (for Authentication)
- Azure subscription (for Static Web Apps & Functions)
- GitHub account (for CI/CD integration)

---

### Setup Firebase Authentication

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/).
2. Enable Google Authentication under **Authentication > Sign-in methods**.
3. Add your app’s Firebase config to `firebase.js` (or wherever you configure Firebase SDK).
4. Ensure you initialize Firebase Auth properly.

```js
// firebase.js example
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  // ...other config
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
