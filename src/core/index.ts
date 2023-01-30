import { createUnplugin } from 'unplugin'
import { generateVersion, readWorkerFile, resolveWorkerOption } from './utils'
import type { Options } from './types'

export * from './types'

export default createUnplugin<Options | undefined>((options: Options = {}) => {
  const {
    fileName = 'version.json',
    type = 'commit',
    extra = {},
    worker = true,
  } = options

  const { enable = false, fileName: workerFileName = 'worker.js' } =
    resolveWorkerOption(worker)

  let workerPath = ''

  return {
    name: 'unplugin-detect-update',
    apply: 'build',
    transform(code: string, id: string) {
      if (!id.includes('unplugin-detect-update/dist/useDetectUpdate')) return

      workerPath = id.replace(
        /(.+unplugin-detect-update)(?:.+)/,
        '$1/dist/worker/index.js',
      )

      const generateCode = code
        .replace(/version\.json/, fileName)
        .replace(/worker\.js/, workerFileName)

      return {
        code: generateCode,
        id,
      }
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
        const workerSource = source.replace(/version\.json/, fileName)

        this.emitFile({
          type: 'asset',
          fileName: workerFileName,
          source: workerSource,
        })
      }
    },
  }
})
