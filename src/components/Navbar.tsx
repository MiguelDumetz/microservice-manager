import { useState } from 'react';
import { Project } from '../types';
import { useAuth } from '../context/AuthContext';
import AuthModal from './Auth/AuthModal';

interface NavbarProps {
  projects: Project[];
  onHome: () => void;
  onSelectProject: (project: Project) => void;
}

function Navbar({ projects, onHome, onSelectProject }: NavbarProps) {
  const { user, logout } = useAuth();
  const [projectsOpen, setProjectsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  return (
    <>
      <nav className="bg-slate-900 border-b border-slate-800 h-14 flex items-center px-8">
        <div className="flex items-center gap-8 w-full">
          <span className="text-white font-semibold text-lg">Service Manager</span>
          <div
            className="relative h-14 flex items-center"
            onMouseEnter={() => setProjectsOpen(true)}
            onMouseLeave={() => setProjectsOpen(false)}
          >
            <button
              onClick={onHome}
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Projects
            </button>
            {projectsOpen && (
              <div className="absolute top-full left-0 bg-slate-800 border border-slate-700 rounded-lg py-1 min-w-44 z-50">
                {projects.map((project) => (
                  <button
                    key={project.id}
                    onClick={() => onSelectProject(project)}
                    className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                  >
                    {project.name}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="ml-auto">
            {user ? (
              <div
                className="relative h-14 flex items-center"
                onMouseEnter={() => setProfileOpen(true)}
                onMouseLeave={() => setProfileOpen(false)}
              >
                <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-semibold cursor-default select-none">
                  {user.name[0].toUpperCase()}
                </div>
                {profileOpen && (
                  <div className="absolute top-full right-0 bg-slate-800 border border-slate-700 rounded-lg py-1 min-w-44 z-50">
                    <p className="px-4 py-2 text-sm text-white font-medium border-b border-slate-700">
                      {user.name}
                    </p>
                    <button
                      onClick={logout}
                      className="w-full text-left px-4 py-2 text-sm text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                    >
                      Log out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="text-sm text-slate-400 hover:text-white transition-colors"
              >
                Log in
              </button>
            )}
          </div>
        </div>
      </nav>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} />}
    </>
  );
}

export default Navbar;
