import { renderHook, act } from '@testing-library/react'
import useSelectable from '../../Hooks/useSelectable'

describe('useSelectable', () => {
  it('starts with default state', () => {
    const { result } = renderHook(() => useSelectable(vi.fn().mockResolvedValue(undefined)))
    expect(result.current.isSelecting).toBe(false)
    expect(result.current.selectedIds.size).toBe(0)
    expect(result.current.showConfirm).toBe(false)
  })

  it('handleStartSelecting enables select mode', () => {
    const { result } = renderHook(() => useSelectable(vi.fn().mockResolvedValue(undefined)))
    act(() => result.current.handleStartSelecting())
    expect(result.current.isSelecting).toBe(true)
  })

  it('handleCancelSelecting disables select mode and clears selection', () => {
    const { result } = renderHook(() => useSelectable(vi.fn().mockResolvedValue(undefined)))
    act(() => {
      result.current.handleStartSelecting()
      result.current.handleToggleSelect(1)
    })
    act(() => result.current.handleCancelSelecting())
    expect(result.current.isSelecting).toBe(false)
    expect(result.current.selectedIds.size).toBe(0)
  })

  it('handleToggleSelect adds an id to the selection', () => {
    const { result } = renderHook(() => useSelectable(vi.fn().mockResolvedValue(undefined)))
    act(() => result.current.handleToggleSelect(42))
    expect(result.current.selectedIds.has(42)).toBe(true)
  })

  it('handleToggleSelect removes an id when toggled twice', () => {
    const { result } = renderHook(() => useSelectable(vi.fn().mockResolvedValue(undefined)))
    act(() => {
      result.current.handleToggleSelect(42)
      result.current.handleToggleSelect(42)
    })
    expect(result.current.selectedIds.has(42)).toBe(false)
  })

  it('handleConfirmDelete calls onDelete with the selected ids then resets state', async () => {
    const onDelete = vi.fn().mockResolvedValue(undefined)
    const { result } = renderHook(() => useSelectable(onDelete))
    act(() => {
      result.current.handleToggleSelect(1)
      result.current.handleToggleSelect(3)
    })
    await act(() => result.current.handleConfirmDelete())
    expect(onDelete).toHaveBeenCalledWith(expect.arrayContaining([1, 3]))
    expect(onDelete.mock.calls[0][0]).toHaveLength(2)
    expect(result.current.isSelecting).toBe(false)
    expect(result.current.selectedIds.size).toBe(0)
  })
})
