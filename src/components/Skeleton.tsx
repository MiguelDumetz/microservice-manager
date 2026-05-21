export function ProjectCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 lg:p-5 2xl:p-7 animate-pulse">
      <div className="h-4 lg:h-5 bg-gray-200 dark:bg-slate-700 rounded w-3/4 mb-3 lg:mb-4" />
      <div className="flex gap-3">
        <div className="h-3 bg-gray-100 dark:bg-slate-700/60 rounded w-16" />
        <div className="h-3 bg-gray-100 dark:bg-slate-700/60 rounded w-12" />
      </div>
    </div>
  );
}

export function ServiceCardSkeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl p-3 lg:p-5 2xl:p-7 animate-pulse flex flex-col gap-2">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 lg:w-2.5 lg:h-2.5 rounded-full bg-gray-200 dark:bg-slate-700 shrink-0" />
        <div className="h-4 bg-gray-200 dark:bg-slate-700 rounded w-2/3" />
      </div>
      <div className="h-3 bg-gray-100 dark:bg-slate-700/60 rounded w-full" />
      <div className="h-3 bg-gray-100 dark:bg-slate-700/60 rounded w-1/4" />
    </div>
  );
}
