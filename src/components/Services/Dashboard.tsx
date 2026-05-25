import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Server, BarChart2 } from "lucide-react";
import MicroserviceCard from "./Card";
import AddServiceButton from "./AddButton";
import DeleteConfirmModal from "../Modals/DeleteConfirmModal";
import Button from "../Button";
import SearchBar from "../SearchBar";
import StatusFilterTabs from "../StatusFilterTabs";
import type { StatusFilter } from "../StatusFilterTabs";
import { ServiceCardSkeleton } from "../Skeleton";
import useSelectable from "../../hooks/useSelectable";
import useProjectStatus from "../../hooks/useProjectStatus";

import { ServiceStatus } from "../../types";
import {
  fetchServices,
  createService,
  updateService,
  deleteServices,
} from "../../api/services";
import { fetchProject } from "../../api/projects";

function ServiceDashboard() {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [showGraphs, setShowGraphs] = useState<boolean>(true);

  const { data: project } = useQuery({
    queryKey: ["project", projectId],
    queryFn: () => fetchProject(Number(projectId)),
  });

  const { data: services = [], isLoading } = useQuery({
    queryKey: ["services", project?.id],
    queryFn: () => fetchServices(project!.id),
    enabled: !!project,
  });

  const addMutation = useMutation({
    mutationFn: (data: { name: string; url: string }) =>
      createService(Number(projectId), data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["services", Number(projectId)],
      }),
  });

  const updateMutation = useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number;
      data: { name: string; url: string };
    }) => updateService(Number(projectId), id, data),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["services", Number(projectId)],
      }),
  });

  const deleteMutation = useMutation({
    mutationFn: (ids: number[]) => deleteServices(Number(projectId), ids),
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["services", Number(projectId)],
      }),
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

  const selectedServices = services.filter((s) => selectedIds.has(s.id));
  const { running, error, dead } = useProjectStatus(Number(projectId));

  const filtered = services.filter((service) => {
    const nameMatch =
      service.name.toLowerCase().includes(search.toLowerCase()) ||
      service.url.toLowerCase().includes(search.toLowerCase());
    if (!nameMatch) return false;
    if (statusFilter === "all") return true;
    const cached = queryClient.getQueryData<{ status: ServiceStatus }>([
      "status",
      service.url,
    ]);
    return cached?.status === statusFilter;
  });

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-500 dark:text-slate-400">Loading project…</p>
      </div>
    );
  }

  function renderContent() {
    if (isLoading) {
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <ServiceCardSkeleton key={i} />
          ))}
        </div>
      );
    }
    if (services.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <Server className="w-12 h-12 text-gray-300 dark:text-slate-600" />
          <p className="text-lg font-semibold text-gray-700 dark:text-slate-300">
            No services configured
          </p>
          <p className="text-sm text-gray-400 dark:text-slate-500 max-w-xs">
            Add your first service to begin health monitoring for{" "}
            {project!.name}.
          </p>
        </div>
      );
    }
    if (filtered.length === 0) {
      return (
        <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
          <p className="text-base font-semibold text-gray-500 dark:text-slate-400">
            No services match your filter
          </p>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 3xl:grid-cols-4 gap-4">
        {filtered.map((service) => (
          <MicroserviceCard
            key={service.id}
            id={service.id}
            name={service.name}
            url={service.url}
            isSelecting={isSelecting}
            isSelected={selectedIds.has(service.id)}
            onToggleSelect={() => handleToggleSelect(service.id)}
            onEdit={(data) => updateMutation.mutate({ id: service.id, data })}
            onDelete={() => deleteMutation.mutateAsync([service.id])}
            showGraph={showGraphs}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-8">
      <header className="max-w-7xl mx-auto mb-4">
        <button
          onClick={() => navigate("/")}
          className="text-sm text-gray-500 hover:text-gray-900 dark:text-slate-400 dark:hover:text-white transition-colors mb-2 block"
        >
          ← Return to dashboard
        </button>
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
          {project.name}
        </h1>
      </header>
      <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between mb-4">
        <div className="flex items-center gap-4">
          {running > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-green-500 shrink-0" />
              <span className="text-xs lg:text-sm 2xl:text-base text-gray-500 dark:text-slate-400">
                {running} Running
              </span>
            </div>
          )}
          {error > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-red-500 shrink-0" />
              <span className="text-xs lg:text-sm 2xl:text-base text-gray-500 dark:text-slate-400">
                {error} Error
              </span>
            </div>
          )}
          {dead > 0 && (
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-gray-400 dark:bg-slate-500 shrink-0" />
              <span className="text-xs lg:text-sm 2xl:text-base text-gray-500 dark:text-slate-400">
                {dead} Dead
              </span>
            </div>
          )}
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
                Remove services
              </Button>
              <AddServiceButton onAdd={(s) => addMutation.mutate(s)} />
            </>
          )}
        </div>
      </div>
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row gap-2 mb-8">
        <div className="flex-1">
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder="Search services..."
          />
        </div>
        <StatusFilterTabs active={statusFilter} onChange={setStatusFilter} />
        <div className="bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
          <button
            role="switch"
            aria-checked={showGraphs}
            aria-label="Toggle latency graphs"
            onClick={() => setShowGraphs((v) => !v)}
            className={[
              "flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs lg:text-sm font-medium transition-colors",
              showGraphs
                ? "bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm"
                : "text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200",
            ].join(" ")}
          >
            <BarChart2 className="w-3.5 h-3.5 lg:w-4 lg:h-4" />
            <span className="hidden sm:inline">Latency</span>
          </button>
        </div>
      </div>
      <main className="max-w-7xl mx-auto">{renderContent()}</main>
      {showConfirm && (
        <DeleteConfirmModal
          services={selectedServices}
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowConfirm(false)}
        />
      )}
    </div>
  );
}

export default ServiceDashboard;
