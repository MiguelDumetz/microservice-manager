import type { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
}

function EmptyState({ icon: Icon, title, description }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-24 text-center gap-4">
      {Icon && <Icon className="w-12 h-12 text-gray-300 dark:text-slate-600" />}
      <p
        className={
          Icon
            ? "text-lg font-semibold text-gray-700 dark:text-slate-300"
            : "text-base font-semibold text-gray-500 dark:text-slate-400"
        }
      >
        {title}
      </p>
      {description && (
        <p className="text-sm text-gray-400 dark:text-slate-500 max-w-xs">
          {description}
        </p>
      )}
    </div>
  );
}

export default EmptyState;
