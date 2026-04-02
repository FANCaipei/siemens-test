import { describe, expect, it } from 'vitest'
import { render, screen } from '@testing-library/react'
import VarTable from '../src/components/VarTable'
import { DataType, useTableDataStore } from '../src/store/tableDataStore'

describe('VarTable', () => {
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

    expect(screen.queryByText('Index')).not.toBeNull()
    expect(screen.queryByText('Name')).not.toBeNull()
    expect(screen.queryByText('Data Type')).not.toBeNull()
    expect(screen.queryByText('Default Value')).not.toBeNull()
    expect(screen.queryByText('Comment')).not.toBeNull()

    expect(screen.queryByText('5')).not.toBeNull()
    expect(screen.queryByText('speed')).not.toBeNull()
    expect(screen.queryByText(DataType.INT)).not.toBeNull()
    expect(screen.queryByText('0')).not.toBeNull()
    expect(screen.queryByText('unit: rpm')).not.toBeNull()

    expect(screen.queryByText('6')).not.toBeNull()
    expect(screen.queryByText('enabled')).not.toBeNull()
    expect(screen.queryByText(DataType.BOOL)).not.toBeNull()
    expect(screen.queryByText('TRUE')).not.toBeNull()
    expect(screen.queryByText('feature flag')).not.toBeNull()
  })
})
