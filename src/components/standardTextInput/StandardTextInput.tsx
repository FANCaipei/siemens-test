import { Button, Form, Input } from 'antd'
import { useCallback, useEffect, useState, type ChangeEvent } from 'react'
import { StandardTextManager } from '../../utils/standardTextManager';
import styles from './StandardTextInput.module.scss'

export default function StandardTextInput({value}: {value: string | null})  {
    const [form] = Form.useForm();
    const [text, setText] = useState(value || '')

    useEffect(() => {
        form.setFieldValue('text', value || '')
    }, [form, value])

    const onTextChange = useCallback((e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setText(e.target.value)
    }, [])

    const importText = useCallback(async () => {
        const parsedData = await StandardTextManager.parse(text)
        console.log(parsedData)
    }, [text])

    const exportData = useCallback(() => {
        // TODO: export data
    }, [])

    return (
        <div className={styles.container}>
            <div className={styles.formContainer}>
                <Form form={form} initialValues={{ text: value || '' }}>
                    <Input.TextArea name="text" autoSize={{ minRows: 4, maxRows: 6 }} onChange={onTextChange} />
                </Form>
            </div>
            <div className={styles.btns}>
                <Button type="primary" onClick={importText}>Import</Button>
                <Button type="primary" onClick={exportData}>Export</Button>
            </div>
        </div>
    )
}