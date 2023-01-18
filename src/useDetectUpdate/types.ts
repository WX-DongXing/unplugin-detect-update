export type Trigger = 'focus' | 'visibility'

export interface UseDetectUpdateOptions {
  immediate?: boolean
  worker?: boolean
  ms?: number
  trigger?: Trigger[]
}

export interface UseDetectUpdateReturn {
  cancel: () => void
  start: () => void
  detect: () => void
  onUpdate: EventHookOn<any>
}

export interface CheckUpdateReturn {
  shouldUpdate: boolean
  json?: Record<string, any>
}

export type EventHookOn<T = any> = (fn: (param: T) => void) => {
  off: () => void
}
export type EventHookOff<T = any> = (fn: (param: T) => void) => void
export type EventHookTrigger<T = any> = (param: T) => void

export interface EventHook<T = any> {
  on: EventHookOn<T>
  off: EventHookOff<T>
  trigger: EventHookTrigger<T>
}
