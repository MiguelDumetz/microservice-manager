import { ServiceStatus } from '../types';

export type StatusFilter = 'all' | ServiceStatus;

const TABS: { value: StatusFilter; label: string }[] = [
  { value: 'all',     label: 'All' },
  { value: 'running', label: 'Running' },
  { value: 'error',   label: 'Error' },
  { value: 'dead',    label: 'Dead' },
];

interface StatusFilterTabsProps {
  active: StatusFilter;
  onChange: (tab: StatusFilter) => void;
}

function StatusFilterTabs({ active, onChange }: StatusFilterTabsProps) {
  return (
    <div className="flex items-center gap-1 bg-gray-100 dark:bg-slate-800 rounded-lg p-1">
      {TABS.map((tab) => (
        <button
          key={tab.value}
          onClick={() => onChange(tab.value)}
          className={`px-2.5 py-1 rounded-md text-xs lg:text-sm font-medium transition-colors ${
            active === tab.value
              ? 'bg-white dark:bg-slate-700 text-gray-900 dark:text-white shadow-sm'
              : 'text-gray-500 dark:text-slate-400 hover:text-gray-700 dark:hover:text-slate-200'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export default StatusFilterTabs;
