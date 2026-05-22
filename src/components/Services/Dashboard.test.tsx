import { screen, act } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes, useLocation } from 'react-router-dom'
import { QueryClientProvider } from '@tanstack/react-query'
import { render } from '@testing-library/react'
import ServiceDashboard from './Dashboard'
import { createTestQueryClient } from '../../test/renderWithProviders'
import { fetchProject } from '../../api/projects'
import { fetchServices } from '../../api/services'

vi.mock('../../api/projects')
vi.mock('../../api/services')

const mockProject = { id: 1, name: 'Prod Cluster' }
const mockServices = [
  { id: 1, name: 'Auth', url: 'http://auth.svc', projectId: 1 },
  { id: 2, name: 'Payment', url: 'http://pay.svc', projectId: 1 },
]

function LocationDisplay() {
  const location = useLocation()
  return <span data-testid="location">{location.pathname}</span>
}

function renderServiceDashboard() {
  const queryClient = createTestQueryClient()
  const result = render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter initialEntries={['/projects/1/services']}>
        <Routes>
          <Route path="/projects/:projectId/services" element={<ServiceDashboard />} />
          <Route path="/" element={<LocationDisplay />} />
        </Routes>
      </MemoryRouter>
    </QueryClientProvider>
  )
  return { ...result, queryClient }
}

describe('ServiceDashboard', () => {
  beforeEach(() => {
    vi.mocked(fetchProject).mockResolvedValue(mockProject)
    vi.mocked(fetchServices).mockResolvedValue(mockServices)
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network unavailable')))
  })

  afterEach(() => {
    vi.clearAllMocks()
    vi.unstubAllGlobals()
  })

  it('renders the project name as heading', async () => {
    renderServiceDashboard()
    expect(await screen.findByText('Prod Cluster')).toBeInTheDocument()
  })

  it('renders all service names', async () => {
    renderServiceDashboard()
    expect(await screen.findByText('Auth')).toBeInTheDocument()
    expect(screen.getByText('Payment')).toBeInTheDocument()
  })

  it('"← Return to dashboard" button navigates back to home', async () => {
    renderServiceDashboard()
    await screen.findByText('Prod Cluster')
    await userEvent.click(screen.getByRole('button', { name: /return to dashboard/i }))
    expect(screen.getByTestId('location')).toHaveTextContent('/')
  })

  it('filters services by name when searching', async () => {
    renderServiceDashboard()
    await screen.findByText('Auth')
    await userEvent.type(screen.getByPlaceholderText('Search services...'), 'auth')
    expect(screen.getByText('Auth')).toBeInTheDocument()
    expect(screen.queryByText('Payment')).not.toBeInTheDocument()
  })

  it('filters services by URL when searching', async () => {
    renderServiceDashboard()
    await screen.findByText('Auth')
    await userEvent.type(screen.getByPlaceholderText('Search services...'), 'pay.svc')
    expect(screen.getByText('Payment')).toBeInTheDocument()
    expect(screen.queryByText('Auth')).not.toBeInTheDocument()
  })

  it('Running filter shows only services with running status', async () => {
    const { queryClient } = renderServiceDashboard()
    await screen.findByText('Auth')
    act(() => {
      queryClient.setQueryData(['status', 'http://auth.svc'], { status: 'running' })
    })
    await userEvent.click(screen.getByRole('button', { name: 'Running' }))
    expect(screen.getByText('Auth')).toBeInTheDocument()
    expect(screen.queryByText('Payment')).not.toBeInTheDocument()
  })
})
