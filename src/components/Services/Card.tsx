import { useState, useRef, useEffect } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { ServiceStatus } from "../../types";
import IconButton from "../IconButton";
import ServiceForm from "./AddForm";
import LatencyChart from "./LatencyChart";

interface StatusStyle {
  border: string;
  dot: string;
  label: string;
}

const STATUS_STYLES: Record<ServiceStatus, StatusStyle> = {
  running: {
    border: "border-green-500/50 dark:border-green-500/30",
    dot: "bg-green-500",
    label: "text-green-600 dark:text-green-500",
  },
  dead: {
    border: "border-gray-300 dark:border-slate-500/30",
    dot: "bg-gray-400 dark:bg-slate-500",
    label: "text-gray-500 dark:text-slate-400",
  },
  error: {
    border: "border-red-500/50 dark:border-red-500/30",
    dot: "bg-red-500",
    label: "text-red-600 dark:text-red-500",
  },
};

interface QueryResult {
  status: ServiceStatus;
  errorCode?: number;
  latency?: number;
}

interface MicroserviceCardProps {
  id: number;
  name: string;
  url: string;
  isSelecting?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onEdit: (data: { name: string; url: string }) => void;
  onDelete: () => void;
  showGraph?: boolean;
}

function MicroserviceCard({
  id: _id,
  name,
  url,
  isSelecting = false,
  isSelected = false,
  onToggleSelect,
  onEdit,
  onDelete,
  showGraph = false,
}: MicroserviceCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const latencyHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    latencyHistoryRef.current = [];
  }, [url]);

  const { data = { status: "dead" as ServiceStatus } } = useQuery<QueryResult>({
    queryKey: ["status", url],
    queryFn: async (): Promise<QueryResult> => {
      const t0 = performance.now();
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
        const latency = Math.round(performance.now() - t0);
        latencyHistoryRef.current = [
          ...latencyHistoryRef.current.slice(-29),
          latency,
        ];
        if (res.ok) return { status: "running", latency };
        return { status: "error", errorCode: res.status, latency };
      } catch {
        return { status: "dead" };
      }
    },
    refetchInterval: () => (latencyHistoryRef.current.length < 2 ? 1000 : 5000),
    retry: false,
  });

  const { status, errorCode, latency } = data;
  const styles = STATUS_STYLES[status];
  const collecting = status !== "dead" && latencyHistoryRef.current.length < 2;
  const showChart =
    showGraph &&
    (status === "dead" ||
      status === "error" ||
      latencyHistoryRef.current.length >= 2 ||
      collecting);

  function handleEdit(data: { name: string; url: string }) {
    onEdit(data);
    setIsEditing(false);
  }

  return (
    <>
      <div
        onClick={isSelecting ? onToggleSelect : undefined}
        className={[
          "relative bg-white dark:bg-slate-800 border-3 rounded-xl p-3 lg:p-5 2xl:p-7 flex flex-col gap-1.5 lg:gap-2 2xl:gap-3 transition-all",
          isSelecting ? "cursor-pointer" : "",
          isSelected
            ? "ring-2 ring-red-500/60 border-red-300 dark:border-red-500/30"
            : styles.border,
        ].join(" ")}
      >
        <div className="flex items-center gap-2 pr-9 lg:pr-11 2xl:pr-14">
          <span
            className={`w-2 h-2 lg:w-2.5 lg:h-2.5 2xl:w-3 2xl:h-3 rounded-full shrink-0 ${styles.dot}`}
          />
          <h2 className="text-sm lg:text-base 2xl:text-lg font-semibold text-gray-900 dark:text-white">
            {name}
          </h2>
        </div>
        <p className="text-xs 2xl:text-sm font-mono text-gray-500 dark:text-slate-400">
          {url}
        </p>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs 2xl:text-sm font-semibold uppercase tracking-wider ${styles.label}`}
          >
            {status}
            {errorCode ? ` ${errorCode}` : ""}
          </span>
          {status === "running" && latency !== undefined && (
            <span className="text-xs font-mono text-gray-400 dark:text-slate-500">
              {latency}ms
            </span>
          )}
        </div>
        {showChart && (
          <>
            <div className="-mx-3 lg:-mx-5 2xl:-mx-7 border-t border-gray-100 dark:border-slate-700/60" />
            <LatencyChart
              history={latencyHistoryRef.current}
              status={status}
              collecting={collecting}
            />
          </>
        )}
        <div className="absolute top-1.5 right-1.5 lg:top-2 lg:right-2 2xl:top-3 2xl:right-3">
          {isSelecting ? (
            <IconButton
              icon={Trash2}
              label={isSelected ? "Deselect service" : "Select service"}
              variant={isSelected ? "danger" : "secondary"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect?.();
              }}
            />
          ) : (
            <IconButton
              icon={Pencil}
              label="Edit service"
              variant="secondary"
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            />
          )}
        </div>
      </div>
      {isEditing && (
        <ServiceForm
          initialValues={{ name, url }}
          onSubmit={handleEdit}
          onDelete={onDelete}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}

export default MicroserviceCard;
