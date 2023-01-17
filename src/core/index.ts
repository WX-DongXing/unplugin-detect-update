import { createUnplugin } from 'unplugin'
import { generateVersion } from './utils'
import type { Options } from './types'

export * from './types'

export default createUnplugin<Options | undefined>((options: Options = {}) => ({
  name: 'unplugin-detect-update',
  apply: 'build',
  buildEnd() {
    const { fileName = 'version.json', type = 'commit', extra = {} } = options
    const version = generateVersion(type)
    const source = JSON.stringify(Object.assign({}, version, extra), null, '  ')
    this.emitFile({
      type: 'asset',
      fileName,
      source,
    })
  },
}))
