import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProjectDashboard from "./components/Projects/Dashboard";
import ServiceDashboard from "./components/Services/Dashboard";

interface AppRouterProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function AppRouter({ isDark, onToggleTheme }: AppRouterProps) {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          element={<Layout isDark={isDark} onToggleTheme={onToggleTheme} />}
        >
          <Route path="/" element={<ProjectDashboard />} />
          <Route
            path="/projects/:projectId/services"
            element={<ServiceDashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
