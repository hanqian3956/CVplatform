import type { Directive } from 'vue'
import { useUserStore } from '@/stores/user'

export const permission: Directive = {
  mounted(el, binding) {
    const userStore = useUserStore()
    const code = binding.value as string
    if (!userStore.hasPermission(code)) {
      el.parentNode?.removeChild(el)
    }
  },
}
