import './App.css'
import { Button, Card, Space, Typography } from 'antd'
import { useCounterStore } from './store/counterStore'

function App() {
  const count = useCounterStore((s) => s.count)
  const inc = useCounterStore((s) => s.inc)
  const dec = useCounterStore((s) => s.dec)
  const reset = useCounterStore((s) => s.reset)

  return (
    <div className="app">
      <Card className="card" variant="borderless">
        <Space orientation="vertical" size={16} style={{ width: '100%' }}>
          <div>
            <Typography.Title level={3} style={{ margin: 0 }}>
              Vite + React + TypeScript + Zustand + antd
            </Typography.Title>
            <Typography.Text type="secondary">
              Zustand 管理计数状态，antd 负责 UI 组件
            </Typography.Text>
          </div>

          <Card size="small" title="Counter (Zustand)">
            <Space wrap>
              <Typography.Text strong>Count: {count}</Typography.Text>
              <Button onClick={dec}>-1</Button>
              <Button type="primary" onClick={inc}>
                +1
              </Button>
              <Button onClick={reset}>Reset</Button>
            </Space>
          </Card>
        </Space>
      </Card>
    </div>
  )
}

export default App
