export type VersionType = 'package' | 'commit' | 'timestamp'

export interface Options {
  fileName?: string
  type?: VersionType
  extra?: Record<string, any>
}

export interface UseDetectUpdateOptions {
  worker?: boolean
  time?: number
}

export interface UseDetectUpdateReturn {
  execute?: () => void
  detect?: () => void
  onUpdate?: () => void
}
