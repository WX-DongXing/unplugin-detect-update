/**
 * Extra detect trigger type, trigger detection when window focused or visible
 */
export type Trigger = 'focus' | 'visibility'

export interface UseDetectUpdateOptions {
  /**
   * Execute the detect immediately on calling
   *
   * @default true
   */
  immediate?: boolean
  /**
   * Whether use worker
   *
   * @default false
   */
  worker?: boolean
  /**
   * cycle time, ms
   *
   * @default 5 * 60000
   */
  ms?: number
  /**
   * Extra detect trigger type
   *
   * @default []
   */
  trigger?: Trigger[]
}

export interface UseDetectUpdateReturn {
  /**
   * Cancel detect on calling
   */
  cancel: () => void
  /**
   * Start detect on calling
   */
  start: () => void
  /**
   * Active trigger version detection
   */
  detect: () => void
  /**
   * Called when version changed
   */
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
