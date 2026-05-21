import { ServiceStatus } from "../types";

interface LatencyChartProps {
  history: number[];
  status: ServiceStatus;
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = (p / 100) * (sorted.length - 1);
  const lo = Math.floor(idx);
  const hi = Math.ceil(idx);
  return Math.round(sorted[lo] + (sorted[hi] - sorted[lo]) * (idx - lo));
}

function computeSeries(history: number[]): {
  p50: number[];
  p95: number[];
  p99: number[];
} {
  const p50: number[] = [];
  const p95: number[] = [];
  const p99: number[] = [];
  for (let i = 0; i < history.length; i++) {
    const sorted = [...history.slice(0, i + 1)].sort((a, b) => a - b);
    p50.push(percentile(sorted, 50));
    p95.push(percentile(sorted, 95));
    p99.push(percentile(sorted, 99));
  }
  return { p50, p95, p99 };
}

function smoothPath(points: [number, number][]): string {
  if (points.length < 2) return "";
  let d = `M ${points[0][0].toFixed(1)} ${points[0][1].toFixed(1)}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const cx = (x0 + x1) / 2;
    d += ` C ${cx.toFixed(1)} ${y0.toFixed(1)}, ${cx.toFixed(1)} ${y1.toFixed(1)}, ${x1.toFixed(1)} ${y1.toFixed(1)}`;
  }
  return d;
}

function LegendItem({
  color,
  label,
  value,
}: {
  color: string;
  label: string;
  value: number;
}) {
  return (
    <span className="flex items-center gap-1">
      <span
        className="w-2 h-2 rounded-full shrink-0"
        style={{ backgroundColor: color }}
      />
      <span className="text-xs font-mono text-gray-500 dark:text-slate-400">
        {label}: {value}ms
      </span>
    </span>
  );
}

const GRID_YS = [20, 36, 52];

function GridLines() {
  return (
    <>
      {GRID_YS.map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="400"
          y2={y}
          className="stroke-gray-200 dark:stroke-slate-700"
          strokeWidth="0.5"
        />
      ))}
    </>
  );
}

function LatencyChart({ history, status }: LatencyChartProps) {
  if (status === "dead") {
    return (
      <div className="flex flex-col gap-2">
        <svg
          viewBox="0 0 400 72"
          width="100%"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ height: "72px" }}
        >
          <GridLines />
          <line
            x1="0"
            y1="36"
            x2="400"
            y2="36"
            stroke="#9ca3af"
            strokeWidth="1.5"
            strokeDasharray="10 6"
            strokeLinecap="round"
          />
        </svg>
        <p className="text-xs text-gray-400 dark:text-slate-500 text-center">
          Unreachable
        </p>
      </div>
    );
  }

  if (history.length < 2) {
    return (
      <div className="flex flex-col gap-2">
        <svg
          viewBox="0 0 400 72"
          width="100%"
          preserveAspectRatio="none"
          aria-hidden="true"
          style={{ height: "72px" }}
        >
          <GridLines />
        </svg>
        <p className="text-xs text-gray-400 dark:text-slate-500">
          Collecting data…
        </p>
      </div>
    );
  }

  const { p50, p95, p99 } = computeSeries(history);
  const maxVal = Math.max(...p99, 1);
  const n = history.length;

  function toPoints(series: number[]): [number, number][] {
    return series.map((v, i) => [
      n === 1 ? 200 : (i / (n - 1)) * 400,
      68 - (v / maxVal) * 64,
    ]);
  }

  const lastP50 = p50[p50.length - 1];
  const lastP95 = p95[p95.length - 1];
  const lastP99 = p99[p99.length - 1];

  return (
    <div className="flex flex-col gap-2">
      <svg
        viewBox="0 0 400 72"
        width="100%"
        preserveAspectRatio="none"
        aria-hidden="true"
        style={{ height: "72px" }}
      >
        <GridLines />
        <path
          d={smoothPath(toPoints(p99))}
          fill="none"
          stroke="#ef4444"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={smoothPath(toPoints(p95))}
          fill="none"
          stroke="#f59e0b"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={smoothPath(toPoints(p50))}
          fill="none"
          stroke="#22c55e"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <div className="flex items-center gap-3 flex-wrap">
        <LegendItem color="#22c55e" label="P50" value={lastP50} />
        <LegendItem color="#f59e0b" label="P95" value={lastP95} />
        <LegendItem color="#ef4444" label="P99" value={lastP99} />
      </div>
    </div>
  );
}

export default LatencyChart;
