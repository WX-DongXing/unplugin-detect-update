import { createUnplugin } from 'unplugin'
import { generateVersion, readWorkerFile, resolveWorkerOption } from './utils'
import type { Options } from './types'

export * from './types'

export default createUnplugin<Options | undefined>((options: Options = {}) => {
  const {
    fileName = 'version.json',
    type = 'commit',
    extra = {},
    worker = false,
  } = options

  const { enable, fileName: workerFileName } = resolveWorkerOption(worker)

  let workerPath = ''

  return {
    name: 'unplugin-detect-update',
    apply: 'build',
    async load(id) {
      if (id.includes('unplugin-detect-update')) {
        // find worker.js path by import useDetectUpdate
        workerPath = id.replace(
          /(.+unplugin-detect-update)(?:.+)/,
          '$1/dist/worker/index.js',
        )
      }
      return null
    },
    buildEnd() {
      const version = generateVersion(type)
      const source = JSON.stringify(
        Object.assign({}, version, extra),
        null,
        '  ',
      )
      this.emitFile({
        type: 'asset',
        fileName,
        source,
      })

      if (enable && workerPath) {
        const source = readWorkerFile(workerPath)
        this.emitFile({
          type: 'asset',
          fileName: workerFileName,
          source,
        })
      }
    },
  }
})
