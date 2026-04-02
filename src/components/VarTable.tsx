import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { useTableDataStore } from '../store/tableDataStore'
import type { TableRow } from '../store/tableDataStore'

const columns: ColumnsType<TableRow> = [
  {
    title: 'Index',
    dataIndex: 'id',
    key: 'id',
    width: 90,
  },
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'Data Type',
    dataIndex: 'dataType',
    key: 'dataType',
    width: 140,
  },
  {
    title: 'Default Value',
    dataIndex: 'defaultValue',
    key: 'defaultValue',
    width: 160,
    render: (v: TableRow['defaultValue']) => String(v),
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
  },
]

export default function VarTable() {
  const tableData = useTableDataStore((s) => s.tableData)

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tableData}
      pagination={false}
    />
  )
}
