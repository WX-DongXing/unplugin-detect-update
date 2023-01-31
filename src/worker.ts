interface Options {
  ms?: number
}

interface Order {
  signal: 'start' | 'cancel'
  options?: Options
}

let timer: ReturnType<typeof setInterval> | null = null

function start(options: Options = {}) {
  const { ms = 3 * 1000 } = options
  if (timer) clearInterval(timer)
  detect()
  timer = setInterval(() => detect(), ms)
}

/**
 * detect update
 */
async function detect() {
  try {
    const data = await fetch(`/version.json?t=${Date.now()}`)
    const json = await data.json()
    self.postMessage({ signal: 'version', json })
  } catch (error) {
    console.error(
      `[unplugin-detect-update:worker]: An error occurred during detect: ${error}`,
    )
  }
}

function cancel() {
  if (timer) clearTimeout(timer)
}

self.onmessage = ({ data }: MessageEvent<Order>) => {
  const { signal, options } = data
  if (signal === 'start') start(options)
  if (signal === 'cancel') cancel()
}

self.onerror = error => {
  console.error(`[unplugin-detect-update:worker]: An error occurred ${error}`)
}
