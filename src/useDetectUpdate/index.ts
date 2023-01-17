import type {
  CheckUpdateReturn,
  UseDetectUpdateOptions,
  UseDetectUpdateReturn,
} from './types'
import createEventHook from './createEventHook'
import useDocumentVisibility from './useDocumentVisibility'
import useWindowFocus from './useWindowFoucs'

let timer: ReturnType<typeof setInterval> | null = null

export default function useDetectUpdate(
  options: UseDetectUpdateOptions = {},
): UseDetectUpdateReturn {
  const {
    autoStart = true,
    worker = false,
    ms = 3 * 1000,
    trigger = [],
  } = options

  let allowDetect = autoStart

  const event = createEventHook()

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
      console.log('use worker')
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
        `[unplugin-detect-update]: An error occurred during detect: ${String(
          error,
        )}`,
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
      localStorage.setItem('detect-update-store', JSON.stringify(json))
      return {
        shouldUpdate: json?.version !== version,
        json,
      }
    } catch (error) {
      console.error(
        `[unplugin-detect-update]: Fetch version error: ${String(error)}`,
      )
      return {
        shouldUpdate: false,
      }
    }
  }

  function cancel() {
    allowDetect = false
    if (timer) clearTimeout(timer)
  }

  autoStart && start()

  return {
    start,
    cancel,
    detect,
    onUpdate: event.on,
  }
}
