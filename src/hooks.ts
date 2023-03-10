import type {
  CheckUpdateReturn,
  UseDetectUpdateOptions,
  UseDetectUpdateReturn,
} from './composable/types'
import createEventHook from './composable/createEventHook'
import useDocumentVisibility from './composable/useDocumentVisibility'
import useWindowFocus from './composable/useWindowFocus'
import useWebWorker from './composable/useWebWorker'

let timer: ReturnType<typeof setInterval> | null = null

export function useDetectUpdate(
  options: UseDetectUpdateOptions = {},
): UseDetectUpdateReturn {
  const {
    immediate = true,
    worker = false,
    ms = 5 * 60000,
    trigger = [],
  } = options

  const isDev = process.env.NODE_ENV === 'development'

  let allowDetect = immediate

  const event = createEventHook()

  const { post, onMessage } = useWebWorker(!isDev && worker, '/worker.js')

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
      detect()
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
      const data = await fetch(
        `/${isDev ? 'package.json' : 'version.json'}?t=${Date.now()}`,
      )
      const json = await data.json()
      const store = sessionStorage.getItem('detect-update-store')
      if (!store) {
        sessionStorage.setItem('detect-update-store', JSON.stringify(json))
        return {
          shouldUpdate: false,
        }
      }
      const { version } = JSON.parse(store)
      const shouldUpdate = json?.version !== version
      if (shouldUpdate)
        sessionStorage.setItem('detect-update-store', JSON.stringify(json))
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
