import { Dispatch, SetStateAction } from "react";
import ProjectCard from "./Card";
import AddProjectButton from "./AddButton";
import DeleteConfirmModal from "../DeleteConfirmModal";
import Button from "../Button";
import useSelectable from "../../Hooks/useSelectable";
import { Project } from "../../types";

interface ProjectDashboardProps {
  dashboardName: string;
  projects: Project[];
  setProjects: Dispatch<SetStateAction<Project[]>>;
  onSelectProject: (project: Project) => void;
}

function ProjectDashboard({ dashboardName, projects, setProjects, onSelectProject }: ProjectDashboardProps) {
  const {
    isSelecting,
    selectedIds,
    showConfirm,
    setShowConfirm,
    handleStartSelecting,
    handleCancelSelecting,
    handleToggleSelect,
    handleConfirmDelete,
  } = useSelectable(setProjects);

  function handleAdd(project: { name: string }) {
    setProjects((prev) => [...prev, { id: Date.now(), ...project }]);
  }

  const selectedProjects = projects.filter((p) => selectedIds.has(p.id));

  return (
    <div className="p-8">
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-white">{dashboardName}</h1>
          <p className="text-slate-400 text-sm mt-1">{projects.length} projects</p>
        </div>
        <div className="flex items-center gap-2">
          {isSelecting ? (
            <>
              <Button variant="secondary" onClick={handleCancelSelecting}>
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={() => setShowConfirm(true)}
                disabled={selectedIds.size === 0}
              >
                Delete selected ({selectedIds.size})
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleStartSelecting}>
                Remove projects
              </Button>
              <AddProjectButton onAdd={handleAdd} />
            </>
          )}
        </div>
      </header>
      <main className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            name={project.name}
            isSelecting={isSelecting}
            isSelected={selectedIds.has(project.id)}
            onToggleSelect={() => handleToggleSelect(project.id)}
            onSelect={() => onSelectProject(project)}
          />
        ))}
      </main>
      {showConfirm && (
        <DeleteConfirmModal
          services={selectedProjects}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default ProjectDashboard;
