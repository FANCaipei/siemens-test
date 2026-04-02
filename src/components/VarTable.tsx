import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTableDataStore } from '../store/tableDataStore'
import type { TableRow } from '../store/tableDataStore'

const columns: ColumnsType<TableRow> = []

export default function VarTable() {
  const tableData = useTableDataStore((s) => s.tableData)

  return (
    <Table
      columns={columns}
      dataSource={tableData}
    />
  )
}
