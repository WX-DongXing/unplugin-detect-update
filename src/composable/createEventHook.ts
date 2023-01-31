import type { EventHook } from './types'

/**
 * Utility for creating event hooks
 *
 * @see https://vueuse.org/createEventHook
 */
export default function createEventHook<T = any>(): EventHook<T> {
  const fns: Array<(param: T) => void> = []

  const off = (fn: (param: T) => void) => {
    const index = fns.indexOf(fn)
    if (index !== -1) fns.splice(index, 1)
  }

  const on = (fn: (param: T) => void) => {
    fns.push(fn)
    const offFn = () => off(fn)

    return {
      off: offFn,
    }
  }

  const trigger = (param: T) => {
    fns.forEach(fn => fn(param))
  }

  return {
    on,
    off,
    trigger,
  }
}
