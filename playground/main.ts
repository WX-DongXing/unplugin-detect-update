import { useDetectUpdate } from '../dist/hooks'

document.getElementById('app')!.innerHTML = '__UNPLUGIN__'

const { onUpdate } = useDetectUpdate({
  ms: 3000,
  trigger: ['visibility'],
})

onUpdate((json: any) => {
  console.log('update: ', json)
})
