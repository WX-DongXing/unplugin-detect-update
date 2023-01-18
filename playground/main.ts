import useDetectUpdate from '../dist/useDetectUpdate'

document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

const { onUpdate } = useDetectUpdate({
  immediate: false,
  worker: true,
  ms: 3000,
  trigger: ['visibility'],
})

onUpdate((json: any) => {
  console.log('update: ', json)
})
