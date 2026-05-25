import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LayoutGrid } from "lucide-react";
import ProjectCard from "./Card";
import AddProjectButton from "./AddButton";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import Button from "../Button";
import SearchBar from "../SearchBar";
import { ProjectCardSkeleton } from "../Skeleton";
import EmptyState from "../EmptyState";
import useSelectable from "../../hooks/useSelectable";
import { Project } from "../../types";
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProjects,
} from "../../api/projects";

function ProjectDashboard() {
  const dashboardName = "Project Dashboard";
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["projects"],
    queryFn: fetchProjects,
  });

  function handleSelectProject(project: Project) {
    navigate(`/projects/${project.id}/services`);
  }

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

  const filtered = useMemo(
    () =>
      projects.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [projects, search],
  );

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
              <AddProjectButton onAdd={(p) => addMutation.mutate(p.name)} />
            </>
          )}
        </div>
      </header>
      <div className="max-w-7xl mx-auto mb-4">
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder="Search projects..."
        />
      </div>
      <main className="max-w-7xl mx-auto">
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProjectCardSkeleton key={i} />
            ))}
          </div>
        ) : projects.length === 0 ? (
          <EmptyState
            icon={LayoutGrid}
            title="No projects yet"
            description="Create your first project to start monitoring your microservices."
          />
        ) : filtered.length === 0 ? (
          <EmptyState title={`No projects match "${search}"`} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
            {filtered.map((project) => (
              <ProjectCard
                key={project.id}
                id={project.id}
                name={project.name}
                isSelecting={isSelecting}
                isSelected={selectedIds.has(project.id)}
                onToggleSelect={() => handleToggleSelect(project.id)}
                onSelect={() => handleSelectProject(project)}
                onEdit={(data) =>
                  updateMutation.mutate({ id: project.id, name: data.name })
                }
                onDelete={() => deleteMutation.mutateAsync([project.id])}
              />
            ))}
          </div>
        )}
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
