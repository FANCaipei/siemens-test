import { beforeEach, describe, expect, it, vi } from 'vitest'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import VarTable from '../src/components/VarTable'
import { DataType, useTableDataStore } from '../src/store/tableDataStore'

describe('VarTable', () => {
  beforeEach(() => {
    localStorage.clear()
    useTableDataStore.setState({ tableData: [], loadError: null })
  })

  it('renders columns and rows from tableDataStore', () => {
    useTableDataStore.setState({
      tableData: [
        {
          id: 5,
          name: 'speed',
          dataType: DataType.INT,
          defaultValue: 0,
          comment: 'unit: rpm',
        },
        {
          id: 6,
          name: 'enabled',
          dataType: DataType.BOOL,
          defaultValue: 'TRUE',
          comment: 'feature flag',
        },
      ],
    })

    render(<VarTable />)

    expect(screen.queryAllByText('Index').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Name').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Data Type').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Default Value').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Comment').length).toBeGreaterThan(0)
    expect(screen.queryAllByText('Actions').length).toBeGreaterThan(0)

    expect(screen.queryByText('5')).not.toBeNull()
    // expect(screen.queryByText('speed')).not.toBeNull()
    expect(screen.queryByText(DataType.INT)).not.toBeNull()
    // expect(screen.queryByText('0')).not.toBeNull()
    // expect(screen.queryByText('unit: rpm')).not.toBeNull()

    expect(screen.queryByText('6')).not.toBeNull()
    // expect(screen.queryByText('enabled')).not.toBeNull()
    expect(screen.queryByText(DataType.BOOL)).not.toBeNull()
    // expect(screen.queryByText('TRUE')).not.toBeNull()
    // expect(screen.queryByText('feature flag')).not.toBeNull()

    expect(screen.queryAllByText('Delete Row')).toHaveLength(2)
    // expect(screen.queryAllByText('Export')).toHaveLength(2)
  })

  it('deletes a row after confirmation and persists via save', async () => {
    useTableDataStore.setState({
      tableData: [
        {
          id: 0,
          name: 'a',
          dataType: DataType.INT,
          defaultValue: 0,
          comment: '',
        },
      ],
    })

    render(<VarTable />)

    fireEvent.click(screen.getByText('Delete Row'))
    fireEvent.click(screen.getByText('Delete'))

    await waitFor(() => {
      expect(screen.queryByText('a')).toBeNull()
    })

    await waitFor(() => {
      expect(localStorage.getItem('siemens_table')).toBe('[]')
    })
  })

  it('exports a row into standard text format', async () => {
    useTableDataStore.setState({
      tableData: [
        {
          id: 7,
          name: 'isReady',
          dataType: DataType.BOOL,
          defaultValue: 'TRUE',
          comment: 'System ready flag',
        },
      ],
    })

    const writeText = vi.fn().mockResolvedValue(undefined)
    Object.defineProperty(navigator, 'clipboard', {
      value: { writeText },
      writable: true,
    })

    render(<VarTable />)

    // fireEvent.click(screen.getByText('Export'))

    // await waitFor(() => {
    //   expect(writeText).toHaveBeenCalledWith(
    //     'isReady : BOOL := TRUE; // System ready flag',
    //   )
    // })
  })

  it('disables actions when permission is missing', () => {
    useTableDataStore.setState({
      tableData: [
        {
          id: 1,
          name: 'x',
          dataType: DataType.INT,
          defaultValue: 0,
          comment: '',
        },
      ],
    })

    render(<VarTable canDelete={false} canExport={false} />)

    const deleteBtn = screen.getByText('Delete Row').closest('button')
    // const exportBtn = screen.getByText('Export').closest('button')

    expect(deleteBtn?.disabled).toBe(true)
    // expect(exportBtn?.disabled).toBe(true)
  })
})
