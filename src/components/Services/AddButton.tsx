import { useState } from 'react';
import { Plus } from 'lucide-react';
import MicroserviceForm from './AddForm';
import Button from '../Button';

interface AddServiceButtonProps {
  onAdd: (service: { name: string; url: string }) => void;
}

function AddServiceButton({ onAdd }: AddServiceButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(service: { name: string; url: string }) {
    onAdd(service);
    setIsOpen(false);
  }

  return (
    <>
      <button
        aria-label="Add service"
        onClick={() => setIsOpen(true)}
        className="sm:hidden size-8 flex items-center justify-center rounded-lg transition-colors text-gray-600 bg-white border border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:text-slate-300 dark:bg-slate-800 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:text-white"
      >
        <Plus className="size-4" />
      </button>
      <Button className="hidden sm:block" onClick={() => setIsOpen(true)}>
        + Add service
      </Button>
      {isOpen && (
        <MicroserviceForm
          onSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default AddServiceButton;
