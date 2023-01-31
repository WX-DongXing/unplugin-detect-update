import createEventHook from './createEventHook'
import type { EventHookOn, Trigger } from './types'

export interface UseWindowFocusReturn {
  isFocus: boolean
  onChange: EventHookOn<boolean>
}

export default function useWindowFocus(
  trigger: Trigger[] = [],
): UseWindowFocusReturn {
  const event = createEventHook()
  const result: UseWindowFocusReturn = {
    isFocus: false,
    onChange: event.on,
  }

  if (!trigger.includes('focus') || !window) return result

  const blurChange = () => {
    result.isFocus = false
    event.trigger(result.isFocus)
  }

  const focusChange = () => {
    result.isFocus = true
    event.trigger(result.isFocus)
  }

  window.addEventListener('blur', blurChange)

  window.addEventListener('focus', focusChange)

  return result
}
