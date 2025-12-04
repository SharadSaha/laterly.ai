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

  const [loginUser, { isLoading: isLoginUserLoading }] =
    authApi.useLoginMutation();

  const handleLogin = async () => {
    loginUser({ email, password })
      .unwrap()
      .then((res) => {
        if (res.token) {
          onLoginSuccess(res.token);
        }
      });
  };

  return (
    <div className="auth-shell">
      <div className="auth-hero">
        <div className="auth-glow" />
        <div className="auth-badge">Laterly.ai</div>
        <h1>Sign in to capture your reads</h1>
        <p>
          Same cozy vibe as saving with intent—just log in and start dropping
          links.
        </p>
      </div>

      <div className="auth-card">
        <label className="auth-label">Email</label>
        <input
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label className="auth-label">Password</label>
        <input
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="auth-button"
          onClick={handleLogin}
          disabled={isLoginUserLoading}
        >
          {isLoginUserLoading ? "Logging in..." : "Log in"}
        </button>
        <p className="auth-footnote">
          Not registered? Enter your email to continue.
        </p>
      </div>
    </div>
  );
};

export default Auth;
