import { useState } from "react";
import "./style.css";
import authApi from "../../services/auth";

const Auth = ({
  onLoginSuccess,
}: {
  onLoginSuccess: (token: string) => void;
}) => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [loginUser] = authApi.useLoginMutation();

  const handleLogin = async () => {
    loginUser({ email, password }).then((res) => {
      if (res.data.token) {
        onLoginSuccess(res.data.token);
      }
    });
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
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <button onClick={handleLogin}>Log In</button>
      <div className="footer-link">
        Not registered yet? Just enter your email to continue.
      </div>
    </div>
  );
};

export default Auth;
