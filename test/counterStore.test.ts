import { beforeEach, describe, expect, it } from 'vitest'
import { useCounterStore } from '../src/store/counterStore'

describe('counterStore', () => {
  beforeEach(() => {
    useCounterStore.setState({ count: 0 })
  })

  it('inc/decs/reset work', () => {
    expect(useCounterStore.getState().count).toBe(0)

    useCounterStore.getState().inc()
    expect(useCounterStore.getState().count).toBe(1)

    useCounterStore.getState().dec()
    expect(useCounterStore.getState().count).toBe(0)

    useCounterStore.getState().inc()
    useCounterStore.getState().inc()
    useCounterStore.getState().reset()
    expect(useCounterStore.getState().count).toBe(0)
  })
})
