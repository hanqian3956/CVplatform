import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types'

export const useUserStore = defineStore('user', () => {
  const token = ref<string>(localStorage.getItem('token') || '')
  const userInfo = ref<Omit<User, 'password'> | null>(null)
  const permissions = ref<string[]>([])

  const isLoggedIn = computed(() => !!token.value && !!userInfo.value)

  function setToken(val: string) {
    token.value = val
    localStorage.setItem('token', val)
  }

  function setUserInfo(info: Omit<User, 'password'>) {
    userInfo.value = info
  }

  function setPermissions(perms: string[]) {
    permissions.value = perms
  }

  function hasPermission(code: string): boolean {
    return permissions.value.includes(code)
  }

  function hasAnyPermission(codes: string[]): boolean {
    return codes.some(code => permissions.value.includes(code))
  }

  function logout() {
    token.value = ''
    userInfo.value = null
    permissions.value = []
    localStorage.removeItem('token')
  }

  return {
    token,
    userInfo,
    permissions,
    isLoggedIn,
    setToken,
    setUserInfo,
    setPermissions,
    hasPermission,
    hasAnyPermission,
    logout,
  }
})
