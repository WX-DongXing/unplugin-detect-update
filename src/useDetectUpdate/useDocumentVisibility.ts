import createEventHook from './createEventHook'
import type { EventHookOn, Trigger } from './types'

interface UseDocumentVisibilityReturn {
  isVisibility: boolean
  onChange: EventHookOn<boolean>
}

export default function useDocumentVisibility(
  trigger: Trigger[] = [],
): UseDocumentVisibilityReturn {
  const event = createEventHook()
  const result: UseDocumentVisibilityReturn = {
    isVisibility: false,
    onChange: event.on,
  }

  if (!trigger.includes('visibility') || !document) return result

  const visibilityChange = () => {
    const isVisibility = document?.visibilityState === 'visible'
    result.isVisibility = isVisibility
    event.trigger(isVisibility)
  }

  document?.addEventListener('visibilitychange', visibilityChange)

  return result
}
