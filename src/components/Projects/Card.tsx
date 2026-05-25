import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import IconButton from "../IconButton";
import ProjectForm from "./AddForm";
import useProjectStatus from "../../hooks/useProjectStatus";

interface ProjectCardProps {
  id: number;
  name: string;
  isSelecting?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
  onSelect?: () => void;
  onEdit: (data: { name: string }) => void;
  onDelete: () => void;
}

function ProjectCard({
  id,
  name,
  isSelecting = false,
  isSelected = false,
  onToggleSelect,
  onSelect,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const { running, error, dead, total } = useProjectStatus(id);

  function handleEdit(data: { name: string }) {
    onEdit(data);
    setIsEditing(false);
  }

  return (
    <>
      <div
        onClick={isSelecting ? onToggleSelect : onSelect}
        className={[
          "relative bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 rounded-xl p-5 lg:p-6 2xl:p-8 cursor-pointer hover:bg-gray-50 dark:hover:bg-slate-700/60 transition-all flex flex-col min-h-36 lg:min-h-44 2xl:min-h-52",
          isSelected ? "ring-2 ring-red-500/60" : "",
        ].join(" ")}
      >
        <h2 className="text-base lg:text-lg 2xl:text-xl font-semibold text-gray-900 dark:text-white pr-10 lg:pr-12 2xl:pr-14 mb-3 lg:mb-4 2xl:mb-5">
          {name}
        </h2>
        {total > 0 ? (
          <div className="flex items-center gap-3 lg:gap-4 2xl:gap-5 mt-auto">
            {running > 0 && (
              <div className="flex items-center gap-1 lg:gap-1.5">
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-green-500 shrink-0" />
                <span className="text-xs 2xl:text-sm text-gray-500 dark:text-slate-400">
                  {running} Running
                </span>
              </div>
            )}
            {error > 0 && (
              <div className="flex items-center gap-1 lg:gap-1.5">
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-red-500 shrink-0" />
                <span className="text-xs 2xl:text-sm text-gray-500 dark:text-slate-400">
                  {error} Error
                </span>
              </div>
            )}
            {dead > 0 && (
              <div className="flex items-center gap-1 lg:gap-1.5">
                <span className="w-1.5 h-1.5 lg:w-2 lg:h-2 2xl:w-2.5 2xl:h-2.5 rounded-full bg-gray-400 dark:bg-slate-500 shrink-0" />
                <span className="text-xs 2xl:text-sm text-gray-500 dark:text-slate-400">
                  {dead} Dead
                </span>
              </div>
            )}
          </div>
        ) : (
          <p className="text-xs lg:text-sm text-gray-400 dark:text-slate-500 mt-auto">
            No services configured
          </p>
        )}
        <div className="absolute top-3 right-3 lg:top-4 lg:right-4 2xl:top-5 2xl:right-5">
          {isSelecting ? (
            <IconButton
              icon={Trash2}
              label={isSelected ? "Deselect project" : "Select project"}
              variant={isSelected ? "danger" : "secondary"}
              onClick={(e) => {
                e.stopPropagation();
                onToggleSelect?.();
              }}
            />
          ) : (
            <IconButton
              icon={Pencil}
              label="Edit project"
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
        <ProjectForm
          initialValues={{ name }}
          onSubmit={handleEdit}
          onDelete={onDelete}
          onClose={() => setIsEditing(false)}
        />
      )}
    </>
  );
}

export default ProjectCard;
