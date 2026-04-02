import './App.css'
import { Card, Space, Typography } from 'antd'
import VarTable from './components/VarTable'

function App() {
  return (
    <div className="app">
      <Card className="card" variant="borderless">
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              Var Table
            </Typography.Title>
          </div>
          <VarTable />
        </Space>
      </Card>
    </div>
  )
}

export default App
