import { useState } from 'react';
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
      <Button onClick={() => setIsOpen(true)}>+ Add service</Button>
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
