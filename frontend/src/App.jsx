import { useEffect, useState } from "react";
import EmailForm from "./EmailForm";

export default function App() {
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    // OAuth callback ke baad backend redirect karega:
    // http://localhost:5173/?user_email=xxx@gmail.com
    const params = new URLSearchParams(window.location.search);
    const email = params.get("user_email");

    if (email) {
      localStorage.setItem("user_email", email);
      setUserEmail(email);
      window.history.replaceState({}, document.title, "/");
    } else {
      const stored = localStorage.getItem("user_email");
      if (stored) setUserEmail(stored);
    }
  }, []);

  function login() {
    window.location.href = "https://email-chat-app-ktgy.onrender.com/login";
  }

  function logout() {
    localStorage.removeItem("user_email");
    setUserEmail(null);
  }

  if (!userEmail) {
    return (
      <div style={styles.loginContainer}>
        <h1>📧 Simple Email Sender</h1>
        <p>Send emails directly from your Gmail account</p>
        <button onClick={login} style={styles.loginButton}>
          🔐 Login with Google
        </button>
      </div>
    );
  }

  return (
    <div>
      <div style={styles.header}>
        <button onClick={logout} style={styles.logoutButton}>
          Logout
        </button>
      </div>
      <EmailForm userEmail={userEmail} />
    </div>
  );
}

const styles = {
  loginContainer: {
    textAlign: "center",
    marginTop: "100px",
    fontFamily: "Arial, sans-serif",
  },
  loginButton: {
    padding: "15px 30px",
    fontSize: 16,
    fontWeight: "bold",
    backgroundColor: "#4285F4",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
    marginTop: 20,
  },
  header: {
    textAlign: "right",
    padding: 20,
  },
  logoutButton: {
    padding: "10px 20px",
    fontSize: 14,
    backgroundColor: "#f44336",
    color: "white",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
};
