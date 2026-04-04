import { beforeEach, describe, expect, it } from 'vitest'
import { fireEvent, render, screen } from '@testing-library/react'
import App from '../src/App'
import { DataType, useTableDataStore } from '../src/store/tableDataStore'

describe('App', () => {
  beforeEach(() => {
    localStorage.clear()
    useTableDataStore.setState({ tableData: [], loadError: null, isLoading: false })
  })

  it('renders VarTable with data from tableDataStore', () => {
    useTableDataStore.setState({
      tableData: [
        {
          id: 0,
          name: 'foo',
          dataType: DataType.INT,
          defaultValue: 0,
          comment: '',
        },
      ],
    })
    render(<App />)

    expect(screen.queryByText('Var Table')).not.toBeNull()
    expect(screen.queryAllByText('Index').length).toBeGreaterThan(0)
  })

  it('adds a row when clicking "Add Row" and id increments from current max id', () => {
    useTableDataStore.setState({
      tableData: [
        {
          id: 2,
          name: 'a',
          dataType: DataType.INT,
          defaultValue: 0,
          comment: '',
        },
        {
          id: 5,
          name: 'b',
          dataType: DataType.BOOL,
          defaultValue: 'TRUE',
          comment: '',
        },
      ],
    })

    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /Add Row/ }))

    const { tableData } = useTableDataStore.getState()
    expect(tableData).toHaveLength(3)
    expect(tableData[2].id).toBe(6)
  })

  it('adds id=0 when tableDataStore is empty', () => {
    useTableDataStore.setState({ tableData: [] })

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /Add Row/ }))

    const { tableData } = useTableDataStore.getState()
    expect(tableData).toHaveLength(1)
    expect(tableData[0].id).toBe(0)
  })
})
