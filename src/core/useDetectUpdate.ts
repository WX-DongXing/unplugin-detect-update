import type { UseDetectUpdateOptions, UseDetectUpdateReturn } from './types'

export default function useDetectUpdate(options: UseDetectUpdateOptions = {}): UseDetectUpdateReturn {
  const {
    worker = false,
    time = 30 * 60 * 1000,
  } = options

  function detect() { }

  function execute() { }

  function onUpdate() { }

  return {
    detect,
    execute,
    onUpdate,
  }
}
