import { defineStore } from 'pinia'

interface ParamMessage {
  title: string
  message: string
}
export const useConfirmStore = defineStore('confirm', () => {
  const title = ref('')
  const message = ref('')
  const visible = ref(false)
  let resolveFn: (value: boolean) => void

  function showConfirmDialog(params: ParamMessage): Promise<boolean> {
    visible.value = true
    title.value = params.title
    message.value = params.message
    return new Promise<boolean>((resolve) => {
      resolveFn = resolve
    })
  }

  function cancel() {
    visible.value = false
    resolveFn(false)
  }

  function confirm() {
    visible.value = false
    resolveFn(true)
  }
  return { title, message, visible, showConfirmDialog, cancel, confirm }
})
