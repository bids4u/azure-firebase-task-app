import React, { useEffect, useState } from "react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import TodoList from "./TodoList";
import AddTodo from "./AddTodo";
import { GoogleLogin } from "./GoogleLogin";

function App() {
  const [user, setUser] = useState(null);
  const [idToken, setIdToken] = useState(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
        const token = await firebaseUser.getIdToken(true);
        setIdToken(token);
      } else {
        setUser(null);
        setIdToken(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    const auth = getAuth();
    await signOut(auth);
  };

  if (!user) {
    return (
      <div style={styles.container}>
        <h2>Welcome to SmartTodo</h2>
        <p style={styles.description}>
          SmartTodo is a simple, secure, and efficient task management app. Sign in with your Google account to start organizing your tasks.
        </p>
        <GoogleLogin />
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>Welcome, {user.displayName}</h1>
        <button onClick={handleSignOut} style={styles.signOutBtn}>Sign Out</button>
      </div>

      <p style={styles.description}>
        Use the form below to add new tasks, and keep track of your to-dos easily and securely.
      </p>

      <AddTodo idToken={idToken} />
      <TodoList idToken={idToken} />
    </div>
  );
}

const styles = {
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    padding: "2rem",
    fontFamily: "sans-serif",
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  description: {
    fontSize: "1rem",
    color: "#555",
    marginBottom: "1.5rem",
  },
  signOutBtn: {
    backgroundColor: "#f44336",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: 500,
  },
};

export default App;
