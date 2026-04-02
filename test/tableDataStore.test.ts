import { beforeEach, describe, expect, it } from 'vitest'
import { DataType, useTableDataStore } from '../src/store/tableDataStore'

const STORAGE_KEY = 'siemens_table'

describe('tableDataStore', () => {
  beforeEach(() => {
    localStorage.clear()
    useTableDataStore.setState({ tableData: [] })
  })

  it('add creates a new row with id=maxId+1 (starting at 0)', () => {
    useTableDataStore.getState().add()
    expect(useTableDataStore.getState().tableData).toHaveLength(1)
    expect(useTableDataStore.getState().tableData[0].id).toBe(0)

    useTableDataStore.getState().add()
    expect(useTableDataStore.getState().tableData).toHaveLength(2)
    expect(useTableDataStore.getState().tableData[1].id).toBe(1)
  })

  it('defaultValue matches dataType (INT -> 0, BOOL -> TRUE)', () => {
    useTableDataStore.getState().add(DataType.INT)
    useTableDataStore.getState().add(DataType.BOOL)

    const [intRow, boolRow] = useTableDataStore.getState().tableData
    expect(intRow.dataType).toBe(DataType.INT)
    expect(intRow.defaultValue).toBe(0)
    expect(boolRow.dataType).toBe(DataType.BOOL)
    expect(boolRow.defaultValue).toBe('TRUE')
  })

  it('delete removes the row by id', () => {
    useTableDataStore.getState().add()
    useTableDataStore.getState().add()
    expect(useTableDataStore.getState().tableData.map((r) => r.id)).toEqual([
      0, 1,
    ])

    useTableDataStore.getState().delete(0)
    expect(useTableDataStore.getState().tableData.map((r) => r.id)).toEqual([1])
  })

  it('save stores current data into localStorage and load restores it', () => {
    useTableDataStore.getState().add(DataType.BOOL)
    useTableDataStore.getState().add(DataType.INT)
    useTableDataStore.getState().save()

    const raw = localStorage.getItem(STORAGE_KEY)
    expect(raw).not.toBeNull()

    useTableDataStore.setState({ tableData: [] })
    expect(useTableDataStore.getState().tableData).toHaveLength(0)

    useTableDataStore.getState().load()
    expect(useTableDataStore.getState().tableData).toHaveLength(2)
    expect(useTableDataStore.getState().tableData[0].id).toBe(0)
    expect(useTableDataStore.getState().tableData[0].dataType).toBe(
      DataType.BOOL,
    )
    expect(useTableDataStore.getState().tableData[0].defaultValue).toBe('TRUE')
    expect(useTableDataStore.getState().tableData[1].id).toBe(1)
    expect(useTableDataStore.getState().tableData[1].dataType).toBe(
      DataType.INT,
    )
    expect(useTableDataStore.getState().tableData[1].defaultValue).toBe(0)
  })
})
