import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes, useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import { renderWithProviders } from '../test/renderWithProviders'
import { fetchProjects } from '../api/projects'

vi.mock('../api/projects')

function LocationDisplay() {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

function renderNavbar(isDark = false, onToggleTheme = vi.fn()) {
  return renderWithProviders(
    <Routes>
      <Route
        path="/"
        element={
          <>
            <Navbar isDark={isDark} onToggleTheme={onToggleTheme} />
            <LocationDisplay />
          </>
        }
      />
      <Route path="/projects/:projectId/services" element={<LocationDisplay />} />
    </Routes>
  )
}

describe('Navbar', () => {
  beforeEach(() => {
    vi.mocked(fetchProjects).mockResolvedValue([
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Beta' },
    ])
  })

  afterEach(() => vi.clearAllMocks())

  it('renders the brand name', () => {
    renderNavbar()
    expect(screen.getByText('Service Manager')).toBeInTheDocument()
  })

  it('renders the theme toggle switch', () => {
    renderNavbar()
    expect(screen.getByRole('switch', { name: /toggle dark mode/i })).toBeInTheDocument()
  })

  it('calls onToggleTheme when the theme toggle is clicked', async () => {
    const onToggleTheme = vi.fn()
    renderNavbar(false, onToggleTheme)
    await userEvent.click(screen.getByRole('switch', { name: /toggle dark mode/i }))
    expect(onToggleTheme).toHaveBeenCalledOnce()
  })

  it('shows project names in dropdown on hover', async () => {
    renderNavbar()
    await waitFor(() => screen.getByText('Projects'))
    await userEvent.hover(screen.getByText('Projects'))
    expect(await screen.findByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('navigates to project services when a dropdown item is clicked', async () => {
    renderNavbar()
    await waitFor(() => screen.getByText('Projects'))
    await userEvent.hover(screen.getByText('Projects'))
    await userEvent.click(await screen.findByText('Alpha'))
    expect(screen.getByTestId('location')).toHaveTextContent('/projects/1/services')
  })
})
