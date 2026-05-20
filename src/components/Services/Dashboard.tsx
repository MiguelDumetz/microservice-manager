import { useState } from "react";
import MicroserviceCard from "./Card";
import AddServiceButton from "./AddButton";
import DeleteConfirmModal from "../DeleteConfirmModal";
import Button from "../Button";
import useSelectable from "../../Hooks/useSelectable";
import { Service } from "../../types";

const INITIAL_SERVICES: Service[] = [
  { id: 1, name: "Auth Service",    url: "http://localhost:3001" },
  { id: 2, name: "User Service",    url: "http://localhost:3002" },
  { id: 3, name: "Payment Service", url: "http://localhost:3003" },
];

interface ServiceDashboardProps {
  dashboardName: string;
  onBack: () => void;
}

function ServiceDashboard({ dashboardName, onBack }: ServiceDashboardProps) {
  const [services, setServices] = useState<Service[]>(INITIAL_SERVICES);
  const {
    isSelecting,
    selectedIds,
    showConfirm,
    setShowConfirm,
    handleStartSelecting,
    handleCancelSelecting,
    handleToggleSelect,
    handleConfirmDelete,
  } = useSelectable(setServices);

  function handleAdd(service: { name: string; url: string }) {
    setServices((prev) => [...prev, { id: Date.now(), ...service }]);
  }

  const selectedServices = services.filter((s) => selectedIds.has(s.id));

  return (
    <div className="p-8">
      <header className="max-w-4xl mx-auto mb-8 flex items-center justify-between">
        <div>
          <button
            onClick={onBack}
            className="text-sm text-slate-400 hover:text-white transition-colors mb-2 block"
          >
            ← Return to dashboard
          </button>
          <h1 className="text-3xl font-bold text-white">{dashboardName}</h1>
          <p className="text-slate-400 text-sm mt-1">
            {services.length} services configured
          </p>
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
                Remove services
              </Button>
              <AddServiceButton onAdd={handleAdd} />
            </>
          )}
        </div>
      </header>
      <main className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {services.map((service) => (
          <MicroserviceCard
            key={service.id}
            name={service.name}
            url={service.url}
            isSelecting={isSelecting}
            isSelected={selectedIds.has(service.id)}
            onToggleSelect={() => handleToggleSelect(service.id)}
          />
        ))}
      </main>
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
