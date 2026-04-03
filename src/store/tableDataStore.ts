import { create } from 'zustand'

export const DataType = {
  BOOL: 'BOOL',
  INT: 'INT',
} as const

export type DataType = (typeof DataType)[keyof typeof DataType]

export type TableRow = {
  id: number
  name: string
  dataType: DataType
  defaultValue?: 0 | 'TRUE' | 'FALSE' | ''
  comment: string
}

type TableDataState = {
  tableData: TableRow[]
  add: (dataType?: DataType) => void
  delete: (id: number) => void
  save: () => void
  load: () => void
}

const STORAGE_KEY = 'siemens_table'

export const useTableDataStore = create<TableDataState>((set, get) => ({
  tableData: [],
  add: (dataType = DataType.INT) =>
    set((s) => {
      const maxId = s.tableData.reduce((m, r) => Math.max(m, r.id), -1)
      const id = maxId + 1

      const row: TableRow = {
        id,
        name: '',
        dataType,
        defaultValue: dataType === DataType.INT ? 0 : 'TRUE',
        comment: '',
      }

      return { tableData: [...s.tableData, row] }
    }),
  delete: (id) =>
    set((s) => ({
      tableData: s.tableData.filter((r) => r.id !== id),
    })),
  save: () => {
    const data = get().tableData
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  },
  load: () => {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return
    try {
      const parsed = JSON.parse(raw) as unknown
      if (!Array.isArray(parsed)) return
      set({ tableData: parsed as TableRow[] })
    } catch {
      return
    }
  },
}))
