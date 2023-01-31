/**
 * As type as version, package.json file version field or last commit id or current timestamp
 */
export type VersionType = 'package' | 'commit' | 'timestamp'

export interface WorkerOption {
  /**
   * Whether to generate worker file
   *
   * @default true
   */
  enable?: boolean
  /**
   * The name of generated worker file
   *
   * @default worker.js
   */
  fileName?: string
}

export interface Options {
  /**
   * The name of generated version record file
   *
   * @default version.json
   */
  fileName?: string
  /**
   * The type of generated version
   *
   * @default commit
   */
  type?: VersionType
  /**
   * Worker Options
   *
   * @default true
   */
  worker?: boolean | WorkerOption
  /**
   * extra data in version.json
   *
   * @default {}
   */
  extra?: Record<string, any>
}
