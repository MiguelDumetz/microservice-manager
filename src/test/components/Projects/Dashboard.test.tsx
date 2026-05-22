import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Route, Routes, useLocation } from 'react-router-dom'
import ProjectDashboard from '../../../components/Projects/Dashboard'
import { renderWithProviders, createTestQueryClient } from '../../renderWithProviders'
import { fetchProjects } from '../../../api/projects'
import { fetchServices } from '../../../api/services'

vi.mock('../../../api/projects')
vi.mock('../../../api/services')

function LocationDisplay() {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

function renderProjectDashboard() {
  const queryClient = createTestQueryClient()
  const result = renderWithProviders(
    <Routes>
      <Route path="/" element={<ProjectDashboard />} />
      <Route path="/projects/:projectId/services" element={<LocationDisplay />} />
    </Routes>,
    { queryClient }
  )
  return { ...result, queryClient }
}

describe('ProjectDashboard', () => {
  beforeEach(() => {
    vi.mocked(fetchProjects).mockResolvedValue([
      { id: 1, name: 'Alpha' },
      { id: 2, name: 'Beta' },
    ])
    vi.mocked(fetchServices).mockResolvedValue([])
  })

  afterEach(() => vi.clearAllMocks())

  it('renders project names after data loads', async () => {
    renderProjectDashboard()
    expect(await screen.findByText('Alpha')).toBeInTheDocument()
    expect(screen.getByText('Beta')).toBeInTheDocument()
  })

  it('shows loading skeletons before data arrives', () => {
    vi.mocked(fetchProjects).mockReturnValue(new Promise(() => {}))
    renderProjectDashboard()
    const skeletons = document.querySelectorAll('.animate-pulse')
    expect(skeletons.length).toBeGreaterThan(0)
  })

  it('filters projects by name when searching', async () => {
    renderProjectDashboard()
    await screen.findByText('Alpha')
    await userEvent.type(screen.getByPlaceholderText('Search projects...'), 'Alp')
    expect(screen.getByText('Alpha')).toBeInTheDocument()
    expect(screen.queryByText('Beta')).not.toBeInTheDocument()
  })

  it('navigates to the project services page when a card is clicked', async () => {
    renderProjectDashboard()
    await screen.findByText('Alpha')
    await userEvent.click(screen.getByText('Alpha'))
    expect(screen.getByTestId('location')).toHaveTextContent('/projects/1/services')
  })
})
