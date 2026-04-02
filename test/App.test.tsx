import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App'
import { useCounterStore } from '../src/store/counterStore'

describe('App', () => {
  it('renders title and initial count', () => {
    useCounterStore.setState({ count: 0 })
    render(<App />)

    expect(
      screen.getByText('Vite + React + TypeScript + Zustand + antd'),
    ).toBeInTheDocument()
    expect(screen.getByText('Count: 0')).toBeInTheDocument()
  })
})
