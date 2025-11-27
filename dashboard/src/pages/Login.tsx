import { FormEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { useLazyMeQuery, useLoginMutation } from "../app/services/authApi";
import { useAppDispatch, useAppSelector } from "../app/store/hooks";
import { setCredentials, setHydrated } from "../app/store";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { BookMarked } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, { isLoading }] = useLoginMutation();
  const [fetchMe] = useLazyMeQuery();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (auth.status === "authenticated") {
      navigate("/");
    }
  }, [auth.status, navigate]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setHydrated(false));
      dispatch(
        setCredentials({ user: null, accessToken: res.access_token ?? null })
      );
      const me = await fetchMe().unwrap();
      dispatch(setCredentials({ user: me }));
      toast.success("Welcome back");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Login failed. Check your credentials.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 px-4 py-10">
      <Card className="w-full max-w-md glass">
        <CardHeader className="space-y-3 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-500 to-emerald-400 text-white shadow-lg">
            <BookMarked className="h-5 w-5" />
          </div>
          <CardTitle className="text-2xl font-semibold">
            Sign in to Laterly
          </CardTitle>
          <p className="text-sm text-slate-500">
            Secure login with your saved session cookie.
          </p>
        </CardHeader>
        <CardContent>
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
              </label>
              <Input
                required
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@company.com"
                aria-label="Email address"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-200">
                Password
              </label>
              <Input
                required
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                aria-label="Password"
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={isLoading}
              aria-label="Login"
            >
              {isLoading ? "Signing in…" : "Login"}
            </Button>
            <p className="text-xs text-center text-slate-500">
              We respect your session cookie; if you're already logged in via
              the extension we'll pick it up automatically.
            </p>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default Login;
