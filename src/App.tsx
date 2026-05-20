import { useState } from "react";
import Navbar from "./components/Navbar";
import ProjectDashboard from "./components/Projects/Dashboard";
import ServiceDashboard from "./components/Services/Dashboard";
import { Project } from "./types";
import "./App.css";

const INITIAL_PROJECTS: Project[] = [
  { id: 1, name: "Familiprix" },
  { id: 2, name: "La Ruche" },
  { id: 3, name: "Canadiens Montreal" },
];

function App() {
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200">
      <Navbar
        projects={projects}
        onHome={() => setSelectedProject(null)}
        onSelectProject={setSelectedProject}
      />
      {selectedProject ? (
        <ServiceDashboard
          dashboardName={selectedProject.name}
          onBack={() => setSelectedProject(null)}
        />
      ) : (
        <ProjectDashboard
          dashboardName="Project Dashboard"
          projects={projects}
          setProjects={setProjects}
          onSelectProject={setSelectedProject}
        />
      )}
    </div>
  );
}

export default App;
