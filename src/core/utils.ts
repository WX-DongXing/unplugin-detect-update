import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { execSync } from 'node:child_process'
import type { VersionType } from './types'

export const generateTimestamp = (): string => Date.now().toString()

const generatePackageVersion = (): string => {
  try {
    const file = readFileSync(resolve('package.json'), { encoding: 'utf-8' })
    const { version } = JSON.parse(file)
    return version ?? '0.0.0'
  } catch (error) {
    console.error(
      `[unplugin-detect-update]: generate package version error ${String(
        error,
      )}`,
    )
    return generateTimestamp()
  }
}

const generateCommitVersion = (): string => {
  try {
    return execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
  } catch (error) {
    console.error(
      `[unplugin-detect-update]: generate commit version error ${String(
        error,
      )}`,
    )
    return generateTimestamp()
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
      version = generateCommitVersion()
      break
    case 'package':
      version = generatePackageVersion()
      break
    case 'timestamp':
      version = generateTimestamp()
      break
    default:
      version = generateTimestamp()
      break
  }

  return { version }
}
