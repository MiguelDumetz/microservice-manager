import { render, screen } from '@testing-library/react'
import LatencyChart from './LatencyChart'

describe('LatencyChart', () => {
  it('renders "Unreachable" text when status is dead', () => {
    render(<LatencyChart history={[]} status="dead" />)
    expect(screen.getByText('Unreachable')).toBeInTheDocument()
  })

  it('renders collecting message when collecting prop is true', () => {
    render(<LatencyChart history={[100, 200]} status="running" collecting />)
    expect(screen.getByText('Collecting data…')).toBeInTheDocument()
  })

  it('renders collecting message when history has fewer than 2 points', () => {
    render(<LatencyChart history={[100]} status="running" />)
    expect(screen.getByText('Collecting data…')).toBeInTheDocument()
  })

  it('renders collecting message when history is empty', () => {
    render(<LatencyChart history={[]} status="running" />)
    expect(screen.getByText('Collecting data…')).toBeInTheDocument()
  })

  it('renders P50/P95/P99 legend labels when enough history exists', () => {
    const history = [10, 20, 30, 40, 50]
    render(<LatencyChart history={history} status="running" />)
    expect(screen.getByText(/P50/)).toBeInTheDocument()
    expect(screen.getByText(/P95/)).toBeInTheDocument()
    expect(screen.getByText(/P99/)).toBeInTheDocument()
  })
})
