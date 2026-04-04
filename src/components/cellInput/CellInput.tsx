import { useCallback, useEffect, useMemo, useState } from 'react'
import styles from './CellInput.module.scss'
import { Button, Form, Input, } from 'antd'

export interface CellInputProps {
  validator: (rule: any, value: string) => Promise<string | null>
  initValue: string | number | null | undefined
  onSave: (newValue: string) => void
}

export default function CellInput({ validator, initValue, onSave }: CellInputProps) {
  const [editing, setEditing] = useState<boolean>(false)
  const [hasError, setHasError] = useState<boolean>(false)
  const [form] = Form.useForm();



  useEffect(() => {
    form.setFieldValue('input', initValue)
  }, [form, initValue])

  const onValuesChange = useCallback(() => {
    setTimeout(() => {
      setHasError(form.getFieldError('input').length > 0 ? true : false)
    }, 0)
  }, [form])

  const onFocus = useCallback(() => {
    setEditing(true)
  }, [])

  const onConfirm = useCallback(() => {
    console.log('form.getFieldError(): ', form.getFieldError('input'))
    if(form.getFieldError('input').length > 0) return

    onSave(form.getFieldValue('input'))
    setEditing(false)
  }, [form,onSave])

  const onCancel = useCallback(() => {
    form.setFieldValue('input', initValue)
    setEditing(false)
  }, [form, initValue])

  return (
    <div className={styles.container}>
      <Form form={form} initialValues={{ input: initValue }} onValuesChange={onValuesChange}>
        <Form.Item name="input" rules={[{validator}]} style={{ marginBottom: '0' }}>
          <Input onFocus={onFocus} />
        </Form.Item>
      </Form>

      <div className={styles.btnContainer} style={{ display: editing ? 'flex' : 'none' }}>
        <Button type="primary" onClick={onConfirm} disabled={hasError}>
          Confirm
        </Button>
        <Button onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  )
}
