import { useState } from 'react';

function useSelectable(
  onDelete: (ids: number[]) => Promise<void>
) {
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [showConfirm, setShowConfirm] = useState(false);

  function handleStartSelecting() {
    setIsSelecting(true);
    setSelectedIds(new Set());
  }

  function handleCancelSelecting() {
    setIsSelecting(false);
    setSelectedIds(new Set());
  }

  function handleToggleSelect(id: number) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  async function handleConfirmDelete() {
    await onDelete(Array.from(selectedIds));
    setSelectedIds(new Set());
    setIsSelecting(false);
    setShowConfirm(false);
  }

  return {
    isSelecting,
    selectedIds,
    showConfirm,
    setShowConfirm,
    handleStartSelecting,
    handleCancelSelecting,
    handleToggleSelect,
    handleConfirmDelete,
  };
}

export default useSelectable;
