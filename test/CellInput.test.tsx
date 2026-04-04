import { describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import CellInput from '../src/components/CellInput'

describe('CellInput', () => {
  it('renders initValue', () => {
    render(
      <CellInput validator={() => true} initValue="abc" onSave={() => {}} />,
    )
    const input = screen.getByDisplayValue('abc') as HTMLInputElement
    expect(input.value).toBe('abc')
  })

  it('shows buttons only when focused and hides after blur', () => {
    render(
      <CellInput validator={() => true} initValue="a" onSave={() => {}} />,
    )

    expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()

    const input = screen.getByDisplayValue('a')
    fireEvent.focus(input)

    expect(screen.queryByRole('button', { name: 'Confirm' })).not.toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel' })).not.toBeNull()

    fireEvent.blur(input)
    expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
  })

  it('valid/invalid input toggles aria-invalid and confirm disabled', () => {
    const validator = (v: string) => v.length >= 2
    render(
      <CellInput validator={validator} initValue="ok" onSave={() => {}} />,
    )

    const input = screen.getByDisplayValue('ok') as HTMLInputElement
    fireEvent.focus(input)

    const confirmBtn = screen.getByRole('button', { name: 'Confirm' })
    expect((confirmBtn as HTMLButtonElement).disabled).toBe(false)
    expect(input.getAttribute('aria-invalid')).toBe('false')

    fireEvent.change(input, { target: { value: 'x' } })

    const confirmBtn2 = screen.getByRole('button', { name: 'Confirm' })
    expect((confirmBtn2 as HTMLButtonElement).disabled).toBe(true)
    expect(input.getAttribute('aria-invalid')).toBe('true')
    expect(screen.queryByText('输入格式错误')).not.toBeNull()
  })

  it('clicking Confirm calls onSave only when valid and then blurs', () => {
    const onSave = vi.fn()
    const validator = (v: string) => v === 'yes'
    render(<CellInput validator={validator} initValue="no" onSave={onSave} />)

    const input = screen.getByDisplayValue('no') as HTMLInputElement
    fireEvent.focus(input)

    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onSave).not.toHaveBeenCalled()

    fireEvent.change(input, { target: { value: 'yes' } })
    fireEvent.click(screen.getByRole('button', { name: 'Confirm' }))
    expect(onSave).toHaveBeenCalledWith('yes')

    expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull()
    expect(screen.queryByRole('button', { name: 'Cancel' })).toBeNull()
  })

  it('clicking Cancel restores initValue and blurs', () => {
    const validator = (v: string) => v.length > 0
    render(
      <CellInput validator={validator} initValue="init" onSave={() => {}} />,
    )

    const input = screen.getByDisplayValue('init') as HTMLInputElement
    fireEvent.focus(input)
    fireEvent.change(input, { target: { value: '' } })
    expect(input.getAttribute('aria-invalid')).toBe('true')

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    const restored = screen.getByDisplayValue('init') as HTMLInputElement
    expect(restored.value).toBe('init')
    expect(restored.getAttribute('aria-invalid')).toBe('false')
    expect(screen.queryByRole('button', { name: 'Confirm' })).toBeNull()
  })

  it('revalidates when initValue changes', () => {
    const validator = (v: string) => v.length > 0
    const { rerender } = render(
      <CellInput validator={validator} initValue="a" onSave={() => {}} />,
    )

    const input = screen.getByDisplayValue('a') as HTMLInputElement
    fireEvent.focus(input)
    expect(input.getAttribute('aria-invalid')).toBe('false')

    rerender(<CellInput validator={validator} initValue="" onSave={() => {}} />)

    const input2 = screen.getByDisplayValue('') as HTMLInputElement
    fireEvent.focus(input2)
    expect(input2.getAttribute('aria-invalid')).toBe('true')
  })
})
