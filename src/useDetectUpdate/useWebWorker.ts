import createEventHook from './createEventHook'
import type { EventHookOn } from './types'

export interface UseWebWorkerOptions {}

export interface UseWebWorkerReturn {
  post?: typeof Worker.prototype['postMessage']
  terminate?: () => void
  onMessage: EventHookOn
}

export default function useWebWorker(
  enable: boolean,
  url: string,
  workerOptions?: WorkerOptions,
): UseWebWorkerReturn {
  const event = createEventHook()

  const result: UseWebWorkerReturn = {
    onMessage: event.on,
  }

  if (enable && window) {
    const worker = new Worker(url, workerOptions)

    worker.onmessage = (messageEvent: MessageEvent<any>) => {
      event.trigger(messageEvent.data)
    }

    const post = (val: any) => {
      if (!worker) return
      worker.postMessage(val)
    }

    const terminate = () => {
      if (!worker) return
      worker.terminate()
    }

    Object.assign(result, { worker, post, terminate })
  }

  return result
}
