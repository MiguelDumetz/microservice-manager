import { useState, Dispatch, SetStateAction } from 'react';

function useSelectable<T extends { id: number }>(setItems: Dispatch<SetStateAction<T[]>>) {
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
    setSelectedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function handleConfirmDelete() {
    setItems(prev => prev.filter(item => !selectedIds.has(item.id)));
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
