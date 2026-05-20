import { useQuery } from '@tanstack/react-query';
import { ServiceStatus } from '../../types';

interface StatusStyle {
  border: string;
  dot: string;
  label: string;
}

const STATUS_STYLES: Record<ServiceStatus, StatusStyle> = {
  running: {
    border: 'border-green-500/30',
    dot:    'bg-green-500',
    label:  'text-green-500',
  },
  dead: {
    border: 'border-slate-500/30',
    dot:    'bg-slate-500',
    label:  'text-slate-400',
  },
  error: {
    border: 'border-red-500/30',
    dot:    'bg-red-500',
    label:  'text-red-500',
  },
};

interface QueryResult {
  status: ServiceStatus;
  errorCode?: number;
}

interface MicroserviceCardProps {
  name: string;
  url: string;
  isSelecting?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

function MicroserviceCard({ name, url, isSelecting = false, isSelected = false, onToggleSelect }: MicroserviceCardProps) {
  const { data = { status: 'dead' as ServiceStatus } } = useQuery<QueryResult>({
    queryKey: ['status', url],
    queryFn: async (): Promise<QueryResult> => {
      try {
        const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
        if (res.ok) return { status: 'running' };
        return { status: 'error', errorCode: res.status };
      } catch {
        return { status: 'dead' };
      }
    },
    refetchInterval: 5000,
    retry: false,
  });

  const { status, errorCode } = data;
  const styles = STATUS_STYLES[status];

  return (
    <div
      onClick={isSelecting ? onToggleSelect : undefined}
      className={[
        'bg-slate-800 border-3 rounded-xl p-5 flex flex-col gap-2 transition-all',
        isSelecting ? 'cursor-pointer' : '',
        isSelected ? 'ring-2 ring-red-500/60 border-red-500/30' : styles.border,
      ].join(' ')}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${styles.dot}`} />
          <h2 className="text-base font-semibold text-white">{name}</h2>
        </div>
        {isSelecting && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            onClick={(e) => e.stopPropagation()}
            className="w-4 h-4 accent-red-500 cursor-pointer"
          />
        )}
      </div>
      <p className="text-xs font-mono text-slate-400">{url}</p>
      <span className={`text-xs font-semibold uppercase tracking-wider ${styles.label}`}>
        {status}{errorCode ? ` ${errorCode}` : ''}
      </span>
    </div>
  );
}

export default MicroserviceCard;
