import { useState } from 'react';
import ProjectForm from './AddForm';
import Button from '../Button';

interface AddProjectButtonProps {
  onAdd: (project: { name: string }) => void;
}

function AddProjectButton({ onAdd }: AddProjectButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  function handleSubmit(project: { name: string }) {
    onAdd(project);
    setIsOpen(false);
  }

  return (
    <>
      <Button onClick={() => setIsOpen(true)}>+ Add project</Button>
      {isOpen && (
        <ProjectForm
          onSubmit={handleSubmit}
          onClose={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

export default AddProjectButton;
