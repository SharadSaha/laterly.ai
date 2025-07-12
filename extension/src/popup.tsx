import ReactDOM from "react-dom/client";
import useChromeStorage from "./hooks/useChromeStorage";
import Auth from "./containers/auth";
import SaveIntentForm from "./containers/save-intent";

const Popup = () => {
  const [token, setToken, loading] = useChromeStorage<string | null>(
    "token",
    null
  );

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!token) {
    return <Auth onLoginSuccess={setToken} />;
  }

  return <SaveIntentForm />;
};

ReactDOM.createRoot(document.getElementById("root")!).render(<Popup />);
