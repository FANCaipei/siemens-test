import { create } from 'zustand'
import { subscribeWithSelector } from 'zustand/middleware'

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
  isLoading: boolean
  loadError: string | null
  add: (dataType?: DataType) => void
  delete: (id: number) => void
  save: () => void
  load: () => void
}

const STORAGE_KEY = 'siemens_table'

let isHydrating = false
let saveTimer: ReturnType<typeof setTimeout> | undefined
let lastSavedJson: string | null = null

export const useTableDataStore = create<TableDataState>()(
  subscribeWithSelector((set, get) => ({
    tableData: [],
    isLoading: false,
    loadError: null,
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
      try {
        const json = JSON.stringify(data)
        lastSavedJson = json
        localStorage.setItem(STORAGE_KEY, json)
      } catch {
        set({ loadError: 'Save failed' })
      }
    },
    load: () => {
      isHydrating = true
      set({ isLoading: true, loadError: null })

      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) {
          set({ isLoading: false })
          return
        }

        const parsed = JSON.parse(raw) as unknown
        if (!Array.isArray(parsed)) {
          set({ isLoading: false, loadError: 'Invalid stored data' })
          return
        }

        lastSavedJson = raw
        set({ tableData: parsed as TableRow[], isLoading: false })
      } catch {
        set({ isLoading: false, loadError: 'Load failed' })
      } finally {
        isHydrating = false
      }
    },
  })),
)

useTableDataStore.subscribe(
  (s) => s.tableData,
  (tableData) => {
    if (isHydrating) return
    if (saveTimer) clearTimeout(saveTimer)
    saveTimer = setTimeout(() => {
      try {
        const json = JSON.stringify(tableData)
        if (json === lastSavedJson) return
        lastSavedJson = json
        localStorage.setItem(STORAGE_KEY, json)
      } catch {
        useTableDataStore.setState({ loadError: 'Save failed' })
      }
    }, 200)
  },
)
