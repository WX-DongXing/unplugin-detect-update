import type {
  CheckUpdateReturn,
  UseDetectUpdateOptions,
  UseDetectUpdateReturn,
} from './types'
import createEventHook from './createEventHook'
import useDocumentVisibility from './useDocumentVisibility'
import useWindowFocus from './useWindowFocus'
import useWebWorker from './useWebWorker'

let timer: ReturnType<typeof setInterval> | null = null

export default function useDetectUpdate(
  options: UseDetectUpdateOptions = {},
): UseDetectUpdateReturn {
  const {
    immediate = true,
    worker = false,
    ms = 3 * 1000,
    trigger = [],
  } = options

  let allowDetect = immediate

  const event = createEventHook()

  const { post, onMessage } = useWebWorker(worker, '/worker.js')

  onMessage(data => {
    if (data.signal === 'version') {
      const store = localStorage.getItem('detect-update-store') || '{}'
      const { version } = JSON.parse(store)
      if (data.json) {
        const shouldUpdate = data?.json?.version !== version
        if (shouldUpdate) {
          event.trigger(data?.json)
          localStorage.setItem('detect-update-store', JSON.stringify(data.json))
        }
      }
    }
  })

  const { onChange: onVisibilityChange } = useDocumentVisibility(trigger)

  onVisibilityChange(isVisibility => {
    if (allowDetect && isVisibility) detect()
  })

  const { onChange: onWindowFocus } = useWindowFocus(trigger)

  onWindowFocus(isFocus => {
    if (allowDetect && isFocus) detect()
  })

  function start() {
    allowDetect = true

    if (!worker) {
      if (timer) clearInterval(timer)
      timer = setInterval(() => detect(), ms)
    } else {
      post?.({ signal: 'start', options: { ms } })
    }
  }

  /**
   * detect update
   */
  async function detect() {
    try {
      const { shouldUpdate, json } = await checkUpdate()
      if (shouldUpdate) event.trigger(json)
    } catch (error) {
      console.error(
        `[unplugin-detect-update]: An error occurred during detect: ${error}`,
      )
    }
  }

  /**
   * fetch version file and check for update
   * @returns
   */
  async function checkUpdate(): Promise<CheckUpdateReturn> {
    try {
      const data = await fetch(`/version.json?t=${Date.now()}`)
      const json = await data.json()
      const store = localStorage.getItem('detect-update-store') || '{}'
      const { version } = JSON.parse(store)
      const shouldUpdate = json?.version !== version
      if (shouldUpdate)
        localStorage.setItem('detect-update-store', JSON.stringify(json))
      return {
        shouldUpdate,
        json,
      }
    } catch (error) {
      console.error(`[unplugin-detect-update]: Fetch version error: ${error}`)
      return {
        shouldUpdate: false,
      }
    }
  }

  function cancel() {
    allowDetect = false

    if (!worker) {
      if (timer) clearTimeout(timer)
    } else {
      post?.({ signal: 'cancel' })
    }
  }

  immediate && start()

  return {
    start,
    cancel,
    detect,
    onUpdate: event.on,
  }
}
