import { useState } from "react";
import { Sun, Moon, Activity } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchProjects } from "../api/projects";

interface NavbarProps {
  isDark: boolean;
  onToggleTheme: () => void;
}

function Navbar({ isDark, onToggleTheme }: NavbarProps) {
  const [projectsOpen, setProjectsOpen] = useState(false);
  const navigate = useNavigate();

  const { data: projects = [] } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  return (
    <nav className="bg-white border-b border-gray-200 dark:bg-slate-900 dark:border-slate-800 h-14 flex items-center px-4 sm:px-8">
      <div className="flex items-center gap-4 sm:gap-8 w-full">
        {/* Brand — icon only on mobile, icon + text on sm+ */}
        <div className="flex items-center gap-2 shrink-0">
          <Activity className="w-5 h-5 text-green-500" />
          <span className="hidden sm:inline font-semibold text-lg text-gray-900 dark:text-white">
            Service Manager
          </span>
        </div>

        {/* Projects dropdown — hidden on mobile */}
        <div
          className="relative h-14 hidden sm:flex items-center"
          onMouseEnter={() => setProjectsOpen(true)}
          onMouseLeave={() => setProjectsOpen(false)}
        >
          <button
            onClick={() => navigate("/")}
            className="text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors"
          >
            Projects
          </button>
          {projectsOpen && (
            <div className="absolute top-full left-0 bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 rounded-lg py-1 min-w-44 z-50">
              {projects.map((project) => (
                <button
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}/services`)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white transition-colors"
                >
                  {project.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme toggle */}
        <div className="ml-auto flex items-center gap-2">
          <span className="hidden sm:inline text-xs text-gray-500 dark:text-slate-400">
            {isDark ? "Dark" : "Light"}
          </span>
          <button
            role="switch"
            aria-checked={isDark}
            aria-label="Toggle dark mode"
            onClick={onToggleTheme}
            className={`relative w-11 h-6 rounded-full transition-colors duration-200 focus:outline-none ${
              isDark ? "bg-slate-600" : "bg-gray-300"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 size-5 bg-white rounded-full shadow transition-transform duration-200 flex items-center justify-center ${
                isDark ? "translate-x-5" : "translate-x-0"
              }`}
            >
              {isDark ? (
                <Moon size={11} className="text-slate-600" />
              ) : (
                <Sun size={11} className="text-amber-500" />
              )}
            </span>
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
