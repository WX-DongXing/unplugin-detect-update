export type VersionType = 'package' | 'commit' | 'timestamp'

export interface Options {
  fileName?: string
  type?: VersionType
  extra?: Record<string, any>
}
