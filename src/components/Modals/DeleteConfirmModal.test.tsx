import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import DeleteConfirmModal from './DeleteConfirmModal'

const items = [
  { id: 1, name: 'auth-service' },
  { id: 2, name: 'payment-service' },
]

describe('DeleteConfirmModal', () => {
  it('renders all item names', () => {
    render(<DeleteConfirmModal services={items} onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('auth-service')).toBeInTheDocument()
    expect(screen.getByText('payment-service')).toBeInTheDocument()
  })

  it('shows singular heading for one item', () => {
    render(<DeleteConfirmModal services={[items[0]]} onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Delete 1 item?')).toBeInTheDocument()
  })

  it('shows plural heading for multiple items', () => {
    render(<DeleteConfirmModal services={items} onConfirm={vi.fn()} onCancel={vi.fn()} />)
    expect(screen.getByText('Delete 2 items?')).toBeInTheDocument()
  })

  it('calls onConfirm when Delete button is clicked', async () => {
    const onConfirm = vi.fn()
    render(<DeleteConfirmModal services={items} onConfirm={onConfirm} onCancel={vi.fn()} />)
    await userEvent.click(screen.getByRole('button', { name: /^delete$/i }))
    expect(onConfirm).toHaveBeenCalledOnce()
  })

  it('calls onCancel when Cancel button is clicked', async () => {
    const onCancel = vi.fn()
    render(<DeleteConfirmModal services={items} onConfirm={vi.fn()} onCancel={onCancel} />)
    await userEvent.click(screen.getByRole('button', { name: /cancel/i }))
    expect(onCancel).toHaveBeenCalledOnce()
  })
})
