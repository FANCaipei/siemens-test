import type { ChangeEvent, MouseEvent } from 'react'
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react'
import styles from './CellInput.module.scss'

export interface CellInputProps {
  validator: (value: string) => boolean
  initValue: string
  onSave: (newValue: string) => void
}

const DEFAULT_ERROR_MSG = '输入格式错误'

export default function CellInput({ validator, initValue, onSave }: CellInputProps) {
  const [value, setValue] = useState<string>(initValue)
  const [focused, setFocused] = useState<boolean>(false)
  const [valid, setValid] = useState<boolean | null>(null)
  const [errorMsg, setErrorMsg] = useState<string>('')

  const errorId = useId()
  const inputRef = useRef<HTMLInputElement | null>(null)

  const runValidation = useCallback(
    (nextValue: string) => {
      try {
        const ok = validator(nextValue)
        setValid(ok)
        setErrorMsg(ok ? '' : DEFAULT_ERROR_MSG)
        return ok
      } catch (e) {
        console.warn(e)
        setValid(false)
        setErrorMsg(DEFAULT_ERROR_MSG)
        return false
      }
    },
    [validator],
  )

  useEffect(() => {
    setValue(initValue)
    runValidation(initValue)
  }, [initValue, runValidation])

  const onFocus = useCallback(() => {
    setFocused(true)
  }, [])

  const onBlur = useCallback(() => {
    setFocused(false)
  }, [])

  const onChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const nextValue = e.target.value
      setValue(nextValue)
      runValidation(nextValue)
    },
    [runValidation],
  )

  const blurSelf = useCallback(() => {
    inputRef.current?.blur()
    setFocused(false)
  }, [])

  const onConfirm = useCallback(() => {
    if (valid !== true) return
    onSave(value)
    blurSelf()
  }, [blurSelf, onSave, valid, value])

  const onCancel = useCallback(() => {
    setValue(initValue)
    runValidation(initValue)
    blurSelf()
  }, [blurSelf, initValue, runValidation])

  const keepFocusOnMouseDown = useCallback((e: MouseEvent) => {
    e.preventDefault()
  }, [])

  const inputClassName = useMemo(() => {
    if (!focused) return `${styles.input} ${styles.inputBlur}`
    if (valid === false) return `${styles.input} ${styles.inputFocusInvalid}`
    if (valid === true) return `${styles.input} ${styles.inputFocusValid}`
    return `${styles.input} ${styles.inputFocusValid}`
  }, [focused, valid])

  const confirmDisabled = valid !== true
  const confirmBtnClassName = useMemo(() => {
    const base = styles.btn
    if (confirmDisabled) return `${base} ${styles.btnDisabled}`
    return `${base} ${styles.btnPrimary}`
  }, [confirmDisabled])

  const cancelBtnClassName = useMemo(() => `${styles.btn}`, [])

  return (
    <div className={styles.container}>
      <div className={styles.row}>
        <input
          ref={inputRef}
          value={value}
          onFocus={onFocus}
          onBlur={onBlur}
          onChange={onChange}
          className={inputClassName}
          aria-invalid={valid === false}
          aria-errormessage={valid === false ? errorId : undefined}
        />
        {focused ? (
          <div className={styles.actions}>
            <button
              type="button"
              onMouseDown={keepFocusOnMouseDown}
              onClick={onConfirm}
              disabled={confirmDisabled}
              className={confirmBtnClassName}
              aria-label="Confirm"
            >
              Confirm
            </button>
            <button
              type="button"
              onMouseDown={keepFocusOnMouseDown}
              onClick={onCancel}
              className={cancelBtnClassName}
              aria-label="Cancel"
            >
              Cancel
            </button>
          </div>
        ) : null}
      </div>
      {focused && valid === false ? (
        <div id={errorId} className={styles.error} role="alert">
          {errorMsg}
        </div>
      ) : null}
    </div>
  )
}
