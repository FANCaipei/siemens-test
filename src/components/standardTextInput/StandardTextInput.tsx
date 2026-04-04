import { Button, Form, Input, message } from 'antd'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { StandardTextManager } from '../../utils/standardTextManager';
import styles from './StandardTextInput.module.scss'
import { useTableDataStore } from '../../store/tableDataStore';

export default function StandardTextInput({value}: {value: string | null})  {
    const [form] = Form.useForm();
    const [text, setText] = useState(value || '')
    const {tableData, updateAll} = useTableDataStore()

    useEffect(() => {
        form.setFieldValue('text', value || '')
    }, [form, value])

    const onTextChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setText(e.target.value)
    }, [])

    const importText = useCallback(async () => {
        try {
            const parsedData = await StandardTextManager.parse(text)
            updateAll(parsedData)
        } catch(err: unknown) {
            message.error(err as string)
        }
    }, [text, updateAll])

    const exportData = useCallback(() => {
        const serialized = StandardTextManager.serialize(tableData)
        setText(serialized)
    }, [tableData])

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <Form form={form} initialValues={{ text: value || '' }}>
                    <Input.TextArea value={text} name="text" autoSize={{ minRows: 4, maxRows: 6 }} onChange={onTextChange} />
                </Form>
            </div>
            <div className={styles.btns}>
                <Button type="primary" onClick={importText}>Import</Button>
                <Button type="primary" onClick={exportData}>Export</Button>
            </div>
        </div>
    )
}