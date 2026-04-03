import { Button, Popconfirm, Space, Table, Tooltip, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined, ExportOutlined } from '@ant-design/icons'
import { useTableDataStore } from '../store/tableDataStore'
import { DataType, type TableRow } from '../store/tableDataStore'

type VarTableProps = {
  canDelete?: boolean
  canExport?: boolean
}

function formatExportRow(row: TableRow) {
  const name = row.name ?? ''
  const dataType = (row.dataType ?? DataType.INT).toUpperCase()
  const rawDefaultValue = row.defaultValue
  const defaultValue =
    typeof rawDefaultValue === 'string' ? rawDefaultValue.toUpperCase() : rawDefaultValue
  const hasDefaultValue =
    defaultValue !== undefined && defaultValue !== null && defaultValue !== ''
  const comment = row.comment?.trim() ?? ''

  const defaultValuePart = hasDefaultValue ? ` := ${String(defaultValue)}` : ''
  const commentPart = comment.length > 0 ? ` // ${comment}` : ''

  return `${name} : ${dataType}${defaultValuePart};${commentPart}`
}

async function copyToClipboard(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text)
    return
  }

  const textarea = document.createElement('textarea')
  textarea.value = text
  textarea.style.position = 'fixed'
  textarea.style.left = '-9999px'
  textarea.style.top = '-9999px'
  document.body.appendChild(textarea)
  textarea.focus()
  textarea.select()

  const ok = document.execCommand('copy')
  document.body.removeChild(textarea)
  if (!ok) throw new Error('copy_failed')
}

export default function VarTable({ canDelete = true, canExport = true }: VarTableProps) {
  const tableData = useTableDataStore((s) => s.tableData)
  const deleteRow = useTableDataStore((s) => s.delete)
  const save = useTableDataStore((s) => s.save)

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
      render: (v: TableRow['defaultValue']) =>
        v === undefined || v === null ? '' : String(v),
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 240,
      fixed: 'right',
      render: (_: unknown, row: TableRow) => {
        const deleteDisabled = !canDelete
        const exportDisabled = !canExport

        const onDelete = () => {
          if (!canDelete) {
            message.error('No permission to delete')
            return
          }
          deleteRow(row.id)
          save()
          message.success('Row deleted')
        }

        const onExport = async () => {
          if (!canExport) {
            message.error('No permission to export')
            return
          }
          try {
            const text = formatExportRow(row)
            await copyToClipboard(text)
            message.success('Copied to clipboard')
          } catch {
            message.error('Export failed')
          }
        }

        const deleteButton = (
          <Button
            size="small"
            danger
            icon={<DeleteOutlined />}
            disabled={deleteDisabled}
          >
            Delete Row
          </Button>
        )

        const exportButton = (
          <Button
            size="small"
            icon={<ExportOutlined />}
            disabled={exportDisabled}
            onClick={onExport}
          >
            Export
          </Button>
        )

        return (
          <Space size="small" wrap>
            <Tooltip title={deleteDisabled ? 'No permission' : 'Delete this row'}>
              <span>
                <Popconfirm
                  title="Delete this row?"
                  okText="Delete"
                  cancelText="Cancel"
                  onConfirm={onDelete}
                  disabled={deleteDisabled}
                >
                  {deleteButton}
                </Popconfirm>
              </span>
            </Tooltip>
            <Tooltip title={exportDisabled ? 'No permission' : 'Export this row'}>
              <span>{exportButton}</span>
            </Tooltip>
          </Space>
        )
      },
    },
  ]

  return (
    <Table
      rowKey="id"
      columns={columns}
      dataSource={tableData}
      pagination={false}
      scroll={{ x: 'max-content' }}
    />
  )
}
