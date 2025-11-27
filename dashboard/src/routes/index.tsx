import { Navigate, Route, Routes } from "react-router-dom";
import Home from "../pages/Home";
import ArticleDetail from "../pages/ArticleDetail";
import Login from "../pages/Login";
import IntentSearch from "../pages/IntentSearch";
import TopicSearch from "../pages/TopicSearch";
import { useAppSelector } from "../app/store/hooks";

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const auth = useAppSelector((state) => state.auth);
  if (auth.status === "unauthenticated") {
    return <Navigate to="/login" replace />;
  }
  return children;
};

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/article/:id"
        element={
          <ProtectedRoute>
            <ArticleDetail />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search/intent"
        element={
          <ProtectedRoute>
            <IntentSearch />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search/topic"
        element={
          <ProtectedRoute>
            <TopicSearch />
          </ProtectedRoute>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRoutes;
