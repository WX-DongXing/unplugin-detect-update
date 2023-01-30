import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import type { VersionType, WorkerOption } from './types'

export const getTimestampVersion = (): string => Date.now().toString()

export const getPackageVersion = (): string => {
  try {
    const file = readFileSync(resolve('package.json'), { encoding: 'utf-8' })
    const { version } = JSON.parse(file)
    return version ?? '0.0.0'
  } catch (error) {
    console.error(
      `[unplugin-detect-update]: get package version error ${error}`,
    )
    return getTimestampVersion()
  }
}

export const getCommitVersion = (): string => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
  } catch (error) {
    console.error(`[unplugin-detect-update]: get commit version error ${error}`)
    return getTimestampVersion()
  }
}

/**
 * generate version
 * @param type
 * @returns
 */
export const generateVersion = (
  type: VersionType = 'commit',
): Record<string, string> => {
  let version = ''
  switch (type) {
    case 'commit':
      version = getCommitVersion()
      break
    case 'package':
      version = getPackageVersion()
      break
    case 'timestamp':
      version = getTimestampVersion()
      break
    default:
      version = getTimestampVersion()
      break
  }

  return { version }
}

/**
 * read worker file source
 * @param path
 * @returns
 */
export const readWorkerFile = (path: string): string => {
  try {
    const workerFile = readFileSync(resolve(path), { encoding: 'utf-8' })
    return workerFile
  } catch (error) {
    console.error(`[unplugin-detect-update]: read worker.js error: ${error}`)
    return ''
  }
}

/**
 * resolve worker options
 * @param option
 * @returns
 */
export const resolveWorkerOption = (
  option: boolean | WorkerOption,
): WorkerOption => {
  if (typeof option === 'boolean')
    return { enable: option, fileName: 'worker.js' }
  return {
    enable: true,
    fileName: 'worker.js',
    ...option,
  }
}
