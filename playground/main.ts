import useDetectUpdate from '../dist/useDetectUpdate'

document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

const { onUpdate } = useDetectUpdate({
  ms: 10000,
})

onUpdate((json: any) => {
  console.log('update: ', json)
})
