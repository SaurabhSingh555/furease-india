import { useCallback, useEffect, useState } from "react";
import { LandingPage } from "./pages/LandingPage";
import { AdminPage } from "./pages/AdminPage";

export default function App() {
  const [path, setPath] = useState(window.location.pathname);

  useEffect(() => {
    const syncPath = () => setPath(window.location.pathname);
    window.addEventListener("popstate", syncPath);
    return () => window.removeEventListener("popstate", syncPath);
  }, []);

  const navigate = useCallback((nextPath: string) => {
    window.history.pushState({}, "", nextPath);
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  if (path.startsWith("/admin")) {
    return <AdminPage navigate={navigate} path={path} />;
  }

  return <LandingPage onAdmin={() => navigate("/admin")} />;
}
