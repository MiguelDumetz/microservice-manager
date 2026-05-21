import { useState } from "react";
import { Trash2 } from "lucide-react";
import Button from "../Button";
import IconButton from "../IconButton";

interface ProjectFormProps {
  initialValues?: { name: string };
  onSubmit: (project: { name: string }) => void;
  onDelete?: () => void;
  onClose: () => void;
}

function ProjectForm({
  initialValues,
  onSubmit,
  onDelete,
  onClose,
}: ProjectFormProps) {
  const [name, setName] = useState(initialValues?.name ?? "");
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const isEditing = initialValues !== undefined;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit({ name });
  }

  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 rounded-xl p-6 w-full max-w-md">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            {isEditing ? "Edit project" : "Add a project"}
          </h2>
          {isEditing && onDelete && !isConfirmingDelete && (
            <IconButton
              icon={Trash2}
              label="Delete project"
              variant="danger"
              onClick={() => setIsConfirmingDelete(true)}
            />
          )}
        </div>

        {isConfirmingDelete ? (
          <div className="flex flex-col gap-4">
            <p className="text-sm text-gray-600 dark:text-slate-300">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-gray-900 dark:text-white">
                {initialValues?.name}
              </span>
              ? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() => setIsConfirmingDelete(false)}
              >
                Cancel
              </Button>
              <Button type="button" variant="danger" onClick={onDelete}>
                Delete
              </Button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-gray-600 dark:text-slate-400">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                autoFocus
                className="bg-gray-50 border border-gray-300 text-gray-900 placeholder:text-gray-400 dark:bg-slate-900 dark:border-slate-600 dark:text-white dark:placeholder:text-slate-500 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-gray-400 dark:focus:border-slate-400"
              />
            </div>
            <div className="flex justify-end gap-2 mt-2">
              <Button type="button" variant="secondary" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {isEditing ? "Save changes" : "Add project"}
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProjectForm;
