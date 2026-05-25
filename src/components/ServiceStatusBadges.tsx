interface ServiceStatusBadgesProps {
  running: number;
  error: number;
  dead: number;
}

function ServiceStatusBadges({ running, error, dead }: ServiceStatusBadgesProps) {
  return (
    <div className="flex items-center gap-3 lg:gap-4">
      {running > 0 && (
        <div className="flex items-center gap-1 lg:gap-1.5">
          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-green-500 shrink-0" />
          <span className="text-xs lg:text-sm 2xl:text-base text-gray-500 dark:text-slate-400">
            {running} Running
          </span>
        </div>
      )}
      {error > 0 && (
        <div className="flex items-center gap-1 lg:gap-1.5">
          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-red-500 shrink-0" />
          <span className="text-xs lg:text-sm 2xl:text-base text-gray-500 dark:text-slate-400">
            {error} Error
          </span>
        </div>
      )}
      {dead > 0 && (
        <div className="flex items-center gap-1 lg:gap-1.5">
          <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-gray-400 dark:bg-slate-500 shrink-0" />
          <span className="text-xs lg:text-sm 2xl:text-base text-gray-500 dark:text-slate-400">
            {dead} Dead
          </span>
        </div>
      )}
    </div>
  );
}

export default ServiceStatusBadges;
