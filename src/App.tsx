import './App.css'
import { useEffect, useRef } from 'react'
import { Button, Card, Space, Spin, Tooltip, Typography, message } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import VarTable from './components/VarTable'
import { DataType, useTableDataStore } from './store/tableDataStore'
import CellInput from './components/CellInput'

function App() {
  const tableData = useTableDataStore((s) => s.tableData)
  const isLoading = useTableDataStore((s) => s.isLoading)
  const loadError = useTableDataStore((s) => s.loadError)
  const load = useTableDataStore((s) => s.load)

  const lastErrorRef = useRef<string | null>(null)

  useEffect(() => {
    load()
  }, [load])

  useEffect(() => {
    if (!loadError) return
    if (lastErrorRef.current === loadError) return
    lastErrorRef.current = loadError
    message.error(loadError)
  }, [loadError])

  const onAddRow = () => {
    try {
      const ids = tableData
        .map((r) => r.id)
        .filter((id): id is number => Number.isFinite(id))
      const maxId = ids.length > 0 ? Math.max(...ids) : -1
      const id = maxId + 1

      useTableDataStore.setState((s) => ({
        tableData: [
          ...s.tableData,
          {
            id,
            name: '',
            dataType: DataType.INT,
            defaultValue: 0,
            comment: '',
          },
        ],
      }))

      message.success('Row added')
    } catch {
      message.error('Add row failed')
    }
  }

  return (
    <div className="app">
      <Card className="card" variant="borderless">
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <Space
            align="center"
            style={{ width: '100%', justifyContent: 'space-between' }}
            wrap
          >
            <Typography.Title level={3} style={{ margin: 0 }}>
              Var Table
            </Typography.Title>
            <Tooltip title="Add a new row">
              <Button type="primary" icon={<PlusOutlined />} onClick={onAddRow}>
                Add Row
              </Button>
            </Tooltip>
          </Space>
          <Spin spinning={isLoading} delay={200} tip="Loading...">
            <VarTable />
          </Spin>
        </Space>
      </Card>
    </div>
  )
}

export default App
