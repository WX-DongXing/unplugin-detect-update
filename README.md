# unplugin-detect-update

[![NPM version](https://img.shields.io/npm/v/unplugin-detect-update?color=a1b858&label=)](https://www.npmjs.com/package/unplugin-detect-update)

Detect web app version update for Vite, Webpack and Rollup. Powered by [unplugin](https://github.com/unjs/unplugin).

---

## Install

```bash
npm i unplugin-detect-update -D
```

<details>
<summary>Vite</summary><br>

```ts
// vite.config.ts
import DetectUpdate from 'unplugin-detect-update/vite'

export default defineConfig({
  plugins: [
    DetectUpdate({
      /* options */
    }),
  ],
})
```

<br></details>

<details>
<summary>Rollup</summary><br>

```ts
// rollup.config.js
import DetectUpdate from 'unplugin-detect-update/rollup'

export default {
  plugins: [
    DetectUpdate({
      /* options */
    }),
  ],
}
```

<br></details>

<details>
<summary>Webpack</summary><br>

```ts
// webpack.config.js
module.exports = {
  /* ... */
  plugins: [
    require('unplugin-detect-update/webpack')({
      /* options */
    }),
  ],
}
```

> This module works for Webpack >= 3

<br></details>

<details>
<summary>Nuxt</summary><br>

```ts
// nuxt.config.js
export default {
  buildModules: [
    [
      'unplugin-detect-update/nuxt',
      {
        /* options */
      },
    ],
  ],
}
```

> This module works for both Nuxt 2 and [Nuxt Vite](https://github.com/nuxt/vite)

<br></details>

<details>
<summary>Vue CLI</summary><br>

```ts
// vue.config.js
module.exports = {
  configureWebpack: {
    plugins: [
      require('unplugin-detect-update/webpack')({
        /* options */
      }),
    ],
  },
}
```

<br></details>

## Usage

```ts
import useDetectUpdate from 'unplugin-detect-update/useDetectUpdate'

const { start, cancel, detect, onUpdate } = useDetectUpdate({
  immediate: true,
  worker: false,
  ms: 5 * 60000,
  trigger: ['visibility', 'focus'],
})

onUpdate(val => {
  console.log('update: ', val)
})
```

## Configuration

```ts
// plugin config
DetectUpdate({
  // the name of generated version record file
  fileName: 'version.json',
  // the type of generated version,
  type: 'commit',
  worker: {
    // whether to generate worker file
    enable: true,
    // worker file name
    fileName: 'worker.js',
  },
  // extra data in version.json
  extra: {},
})
```

## Types

**Plugin types**

```ts
/**
 * As type as version, package.json file version field or last commit id or current timestamp
 */
export type VersionType = 'package' | 'commit' | 'timestamp'

export interface WorkerOption {
  /**
   * Whether to generate worker file
   *
   * @default true
   */
  enable?: boolean
  /**
   * The name of generated worker file
   *
   * @default worker.js
   */
  fileName?: string
}

export interface Options {
  /**
   * The name of generated version record file
   *
   * @default version.json
   */
  fileName?: string
  /**
   * The type of generated version
   *
   * @default commit
   */
  type?: VersionType
  /**
   * Worker Options
   *
   * @default true
   */
  worker?: boolean | WorkerOption
  /**
   * extra data in version.json
   *
   * @default {}
   */
  extra?: Record<string, any>
}
```

**UseDetectUpdate types**

```ts
/**
 * Extra detect trigger type, trigger detection when window focused or visible
 */
export type Trigger = 'focus' | 'visibility'

export interface UseDetectUpdateOptions {
  /**
   * Execute the detect immediately on calling
   * @default true
   */
  immediate?: boolean
  /**
   * Whether use worker
   * @default false
   */
  worker?: boolean
  /**
   * cycle time, ms
   * @default 5 * 60000
   */
  ms?: number
  /**
   * Extra detect trigger types
   * @default []
   */
  trigger?: Trigger[]
}

export interface UseDetectUpdateReturn {
  /**
   * Cancel detect on calling
   */
  cancel: () => void
  /**
   * Start detect on calling
   */
  start: () => void
  /**
   * Active trigger version detection
   */
  detect: () => void
  /**
   * Called when version changed
   */
  onUpdate: EventHookOn<any>
}
```

## License

[MIT](./LICENSE) License © 2023 [Dong Xing](https://github.com/WX-DongXing)
