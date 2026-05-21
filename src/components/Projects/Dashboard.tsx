import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LayoutGrid } from "lucide-react";
import ProjectCard from "./Card";
import AddProjectButton from "./AddButton";
import DeleteConfirmModal from "../DeleteConfirmModal";
import Button from "../Button";
import SearchBar from "../SearchBar";
import { ProjectCardSkeleton } from "../Skeleton";
import useSelectable from "../../Hooks/useSelectable";
import { Project } from "../../types";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProjects,
} from "../../api/projects";

interface ProjectDashboardProps {
  dashboardName: string;
  onSelectProject: (project: Project) => void;
}

function ProjectDashboard({ dashboardName, onSelectProject }: ProjectDashboardProps) {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  const addMutation = useMutation({
    mutationFn: (name: string) => createProject(name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) =>
      updateProject(id, name),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteProjects(ids),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["projects"] }),
  });

  const {
    isSelecting,
    selectedIds,
    showConfirm,
    setShowConfirm,
    handleStartSelecting,
    handleCancelSelecting,
    handleToggleSelect,
    handleConfirmDelete,
  } = useSelectable((ids) => deleteMutation.mutateAsync(ids));

  const selectedProjects = projects.filter((p) => selectedIds.has(p.id));
  const filtered = projects.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  function renderContent() {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => <ProjectCardSkeleton key={i} />)}
        </div>
      );
    }
    if (projects.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <LayoutGrid className="w-12 h-12 text-gray-300 dark:text-slate-600" />
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-300">No projects yet</p>
          <p className="text-sm text-gray-400 dark:text-slate-500 max-w-xs">
            Create your first project to start monitoring your microservices.
          </p>
        </div>
      );
    }
    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <p className="text-base font-semibold text-gray-500 dark:text-slate-400">No projects match "{search}"</p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
        {filtered.map((project) => (
          <ProjectCard
            key={project.id}
            id={project.id}
            name={project.name}
            isSelecting={isSelecting}
            isSelected={selectedIds.has(project.id)}
            onToggleSelect={() => handleToggleSelect(project.id)}
            onSelect={() => onSelectProject(project)}
            onEdit={(data) => updateMutation.mutate({ id: project.id, name: data.name })}
            onDelete={() => deleteMutation.mutateAsync([project.id])}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <header className="max-w-7xl mx-auto mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            {dashboardName}
          </h1>
        </div>
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {isSelecting ? (
            <>
              <Button variant="secondary" onClick={handleCancelSelecting}>Cancel</Button>
              <Button variant="danger" onClick={() => setShowConfirm(true)} disabled={selectedIds.size === 0}>
                Delete selected ({selectedIds.size})
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleStartSelecting}>Remove projects</Button>
              <AddProjectButton onAdd={(p) => addMutation.mutate(p.name)} />
            </>
          )}
        </div>
      </header>
      <div className="max-w-7xl mx-auto mb-4">
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
      </div>
      <main className="max-w-7xl mx-auto">
        {renderContent()}
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
