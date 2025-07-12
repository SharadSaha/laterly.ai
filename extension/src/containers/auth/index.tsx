import { useState } from "react";
import "./style.css";

const Auth = ({
  onLoginSuccess,
}: {
  onLoginSuccess: (token: string) => void;
}) => {
  const [email, setEmail] = useState<string>("");

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      body: JSON.stringify({ email }),
      headers: { "Content-Type": "application/json" },
    });
    const data = await res.json();
    if (data.token) {
      chrome.storage.local.set({ token: data.token });
      onLoginSuccess(data.token);
    }
  };

  return (
    <div className="auth-container">
      <h2>🔐 Welcome to Laterly.ai</h2>
      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Log In</button>
      <div className="footer-link">
        Not registered yet? Just enter your email to continue.
      </div>
    </div>
  );
};

export default Auth;
