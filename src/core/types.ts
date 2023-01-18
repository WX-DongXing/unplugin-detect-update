export type VersionType = 'package' | 'commit' | 'timestamp'

export interface WorkerOption {
  enable?: boolean
  fileName?: string
}

export interface Options {
  fileName?: string
  type?: VersionType
  worker?: boolean | WorkerOption
  extra?: Record<string, any>
}
