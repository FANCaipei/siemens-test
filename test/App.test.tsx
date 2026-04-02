import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from '../src/App'
import { DataType, useTableDataStore } from '../src/store/tableDataStore'

describe('App', () => {
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
    expect(screen.queryByText('Index')).not.toBeNull()
    expect(screen.queryByText('foo')).not.toBeNull()
  })
})
