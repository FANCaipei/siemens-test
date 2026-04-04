import { Button, Popconfirm, Select, Space, Table, Tooltip, message } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { DeleteOutlined } from '@ant-design/icons'
import { useTableDataStore } from '../store/tableDataStore'
import { DataType, type TableRow } from '../store/tableDataStore'
import CellInput from './cellInput/CellInput'
import { useCallback } from 'react'

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
  const {tableData, updateAll} = useTableDataStore()
  const deleteRow = useTableDataStore((s) => s.delete)

  const nameValidator = useCallback((row: TableRow) => {
    const validator = async (_: unknown, value: string) => {
      let nameExist = false;
      for (const r of tableData) {
        if (r.id !== row.id && r.name === value) {
          nameExist = true
          break
        }
      }
      if (nameExist) return Promise.reject('Name already exists')
      return Promise.resolve(null)
    }
    return validator
  }, [tableData])

  const boolDefaultValueValidator = useCallback(() => {
    const validator = async (_: unknown, value: string) => {
      const acceptValues = ['TRUE', 'FALSE', 'true', 'false']
      if (!acceptValues.includes(value.toUpperCase())) return Promise.reject('Invalid boolean value')
      return Promise.resolve(null)
    }
    return validator
  }, [])

  const intDefaultValueValidator = useCallback(() => {
    const validator = async (_: unknown, value: string) => {
      if (!/^-?[0-9]+$/.test(value)) return Promise.reject('Invalid integer value')
      try {
        const v = Number(value)
        if (v> 2147483648 || v < -2147483648) return Promise.reject('out of range')
      } catch (e) {
        return Promise.reject('Invalid integer value')
      }
      return Promise.resolve(null)
    }
    return validator
  }, [])

  const updateRecordField = useCallback((row: TableRow, newValue: string, fieldName: string) => {
    updateAll(tableData.map((r) => (r.id === row.id ? { ...r, [fieldName]: newValue } : r)))
  }, [tableData])

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
      render:(_, row: TableRow) => {
        return (
          <CellInput
            validator={nameValidator(row)}
            initValue={row.name }
            onSave={(newValue) => {
              updateRecordField(row, newValue, 'name')
            }}
          />
        )
      },
    },
    {
      title: 'Data Type',
      dataIndex: 'dataType',
      key: 'dataType',
      width: 140,
      render:(_, row: TableRow) => {
        return (
          <Select
            value={row.dataType ?? DataType.INT}
            options={Object.values(DataType).map((v) => ({ label: v, value: v }))}
            onChange={(newValue) => {
              updateRecordField(row, newValue, 'dataType')
            }}
          />
        )
      },
    },
    {
      title: 'Default Value',
      dataIndex: 'defaultValue',
      key: 'defaultValue',
      width: 160,
      render: (_, row: TableRow) => {
        return (
          <CellInput
            validator={row.dataType === DataType.INT ? intDefaultValueValidator() : boolDefaultValueValidator()}
            initValue={row.defaultValue}
            onSave={(newValue) => {
              switch (row.dataType) {
                case DataType.BOOL:
                  const nValue = newValue.toUpperCase()
                  updateRecordField(row, nValue, 'defaultValue')
                  break
                case DataType.INT:
                  updateRecordField(row, newValue, 'defaultValue')
                  break
                default:
                  break
              }
            }}
          />
        )
      },
    },
    {
      title: 'Comment',
      dataIndex: 'comment',
      key: 'comment',
      render: (_, row: TableRow) => {
        return (
          <CellInput
            validator={() => Promise.resolve(null)}
            initValue={row.comment}
            onSave={(newValue) => {
              updateRecordField(row, newValue, 'comment')
            }}
          />
        )
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      fixed: 'right',
      render: (_: unknown, row: TableRow) => {
        const deleteDisabled = !canDelete

        const onDelete = () => {
          if (!canDelete) {
            message.error('No permission to delete')
            return
          }
          deleteRow(row.id)
          message.success('Row deleted')
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
          </Space>
        )
      },
    },
  ]

  return (
    <>
      <Table
        rowKey="id"
        columns={columns}
        dataSource={tableData}
        pagination={false}
        scroll={{ x: 'max-content' }}
      />
    </>
  )
}
