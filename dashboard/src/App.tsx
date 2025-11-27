import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import Header from "./components/Header";
import AppRoutes from "./routes";
import { useAppDispatch, useAppSelector } from "./app/store/hooks";
import { clearAuth, setCredentials } from "./app/store";
import { useMeQuery } from "./app/services/authApi";

const App = () => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const auth = useAppSelector((state) => state.auth);
  const { data: me, isLoading, isError, error } = useMeQuery();

  useEffect(() => {
    if (me) {
      dispatch(setCredentials({ user: me }));
    }
  }, [dispatch, me]);

  useEffect(() => {
    if (isError && !isLoading) {
      dispatch(clearAuth());
      const status = (error as any)?.status;
      if (status && status !== 401) {
        toast.error("Unable to fetch session");
      }
    }
  }, [dispatch, error, isError, isLoading]);

  const shouldShowHeader = location.pathname !== "/login";
  const bootstrapping = isLoading && !auth.hydrated;

  if (bootstrapping) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
        <div className="flex items-center gap-3 text-slate-700 dark:text-slate-200">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Preparing your dashboard…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {shouldShowHeader && <Header />}
      <main className="max-w-6xl mx-auto px-4 py-6 md:py-10">
        <AppRoutes />
      </main>
    </div>
  );
};

export default App;
