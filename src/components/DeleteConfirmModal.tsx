import Button from './Button';

interface Item {
  id: number;
  name: string;
}

interface DeleteConfirmModalProps {
  services: Item[];
  onConfirm: () => void;
  onCancel: () => void;
}

function DeleteConfirmModal({ services, onConfirm, onCancel }: DeleteConfirmModalProps) {
  return (
    <div className="fixed inset-0 bg-black/40 dark:bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white border border-gray-200 dark:bg-slate-800 dark:border-slate-700 rounded-xl p-6 w-full max-w-md">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
          Delete {services.length} item{services.length > 1 ? 's' : ''}?
        </h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mb-4">The following items will be removed:</p>
        <ul className="mb-6 flex flex-col gap-1">
          {services.map((s) => (
            <li key={s.id} className="text-sm text-gray-700 dark:text-slate-300 font-mono bg-gray-100 dark:bg-slate-900 px-3 py-1.5 rounded-lg">
              {s.name}
            </li>
          ))}
        </ul>
        <div className="flex justify-end gap-2">
          <Button variant="secondary" type="button" onClick={onCancel}>Cancel</Button>
          <Button variant="danger" type="button" onClick={onConfirm}>Delete</Button>
        </div>
      </div>
    </div>
  );
}

export default DeleteConfirmModal;
