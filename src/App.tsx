import { useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import Navbar from "./components/Navbar";
import ProjectDashboard from "./components/Projects/Dashboard";
import ServiceDashboard from "./components/Services/Dashboard";
import { Project } from "./types";
import { fetchProjects } from "./api/projects";
import "./App.css";

function App() {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : true;
  });

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const hasRestoredRef = useRef(false);

  useEffect(() => {
    if (hasRestoredRef.current || projects.length === 0) return;
    hasRestoredRef.current = true;
    const savedId = localStorage.getItem("lastProjectId");
    if (!savedId) return;
    const found = projects.find((p) => p.id === Number(savedId));
    if (found) setSelectedProject(found);
  }, [projects]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("no-transitions");
    root.classList.toggle("dark", isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove("no-transitions")));
  }, [isDark]);

  function handleSelectProject(project: Project) {
    setSelectedProject(project);
    localStorage.setItem("lastProjectId", String(project.id));
  }

  function handleGoHome() {
    setSelectedProject(null);
    localStorage.removeItem("lastProjectId");
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 dark:bg-slate-950 dark:text-slate-200">
      <Navbar
        projects={projects}
        isDark={isDark}
        onToggleTheme={() => setIsDark((d) => !d)}
        onHome={handleGoHome}
        onSelectProject={handleSelectProject}
      />
      {selectedProject ? (
        <ServiceDashboard
          project={selectedProject}
          onBack={handleGoHome}
        />
      ) : (
        <ProjectDashboard
          dashboardName="Project Dashboard"
          onSelectProject={handleSelectProject}
        />
      )}
    </div>
  );
}

export default App;
