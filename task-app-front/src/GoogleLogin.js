import React from "react";
import {
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
} from "firebase/auth";
import { auth } from "./firebase";

export function GoogleLogin() {
  const provider = new GoogleAuthProvider();

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Google Sign-In error:", error);
      alert("Login failed: " + error.message);
    }
  };

  return (
    <button onClick={handleLogin} style={styles.loginButton}>
      <img
        src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
        alt="Google"
        style={styles.icon}
      />
      Sign in with Google
    </button>
  );
}

export function GoogleLogout() {
  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout error:", error);
      alert("Logout failed: " + error.message);
    }
  };

  return (
    <button onClick={handleLogout} style={styles.logoutButton}>
      Logout
    </button>
  );
}

const styles = {
  loginButton: {
    display: "flex",
    alignItems: "center",
    backgroundColor: "#fff",
    border: "1px solid #ddd",
    borderRadius: 4,
    padding: "8px 16px",
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
    gap: "10px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
  },
  logoutButton: {
    backgroundColor: "#dc3545",
    color: "#fff",
    border: "none",
    padding: "8px 16px",
    borderRadius: 4,
    cursor: "pointer",
    fontWeight: 500,
    fontSize: 14,
  },
  icon: {
    width: 20,
    height: 20,
  },
};
