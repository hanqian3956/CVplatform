import { createRouter, createWebHistory } from 'vue-router'
import { ElMessage } from 'element-plus'
import MainLayout from '@/layouts/MainLayout.vue'
import { useUserStore } from '@/stores/user'
import { getUserInfo } from '@/api/auth'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/login/LoginView.vue'),
      meta: { public: true },
    },
    {
      path: '/',
      component: MainLayout,
      redirect: '/algorithm/list',
      children: [
        {
          path: '/algorithm/list',
          name: 'AlgorithmList',
          component: () => import('@/views/algorithm/AlgorithmList.vue'),
          meta: { title: '算法管理', permission: 'algorithm:list' },
        },
        {
          path: '/algorithm/create',
          name: 'AlgorithmCreate',
          component: () => import('@/views/algorithm/AlgorithmEdit.vue'),
          meta: { title: '新增算法', permission: 'algorithm:create' },
        },
        {
          path: '/algorithm/edit/:id',
          name: 'AlgorithmEdit',
          component: () => import('@/views/algorithm/AlgorithmEdit.vue'),
          meta: { title: '编辑算法', permission: 'algorithm:edit' },
        },
        {
          path: '/category/list',
          name: 'CategoryList',
          component: () => import('@/views/category/CategoryList.vue'),
          meta: { title: '分类管理', permission: 'category:list' },
        },
        {
          path: '/user-algorithm/config',
          name: 'UserAlgorithmConfig',
          component: () => import('@/views/user-algorithm/UserAlgorithmConfig.vue'),
          meta: { title: '用户管理', permission: 'user-algorithm:list' },
        },
        {
          path: '/system/user',
          name: 'SystemUser',
          component: () => import('@/views/system/UserList.vue'),
          meta: { title: '用户管理', permission: 'system:user:list' },
        },
        {
          path: '/system/role',
          name: 'SystemRole',
          component: () => import('@/views/system/RoleList.vue'),
          meta: { title: '角色管理', permission: 'system:role:list' },
        },
      ],
    },
  ],
})

router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // 公开页面直接放行
  if (to.meta.public) {
    next()
    return
  }

  // 未登录
  if (!userStore.token) {
    next('/login')
    return
  }

  // 已登录但无用户信息，尝试恢复
  if (!userStore.userInfo) {
    try {
      const res = await getUserInfo(userStore.token)
      if (res.code === 200 && res.data) {
        userStore.setUserInfo(res.data.user)
        userStore.setPermissions(res.data.permissions)
      } else {
        userStore.logout()
        ElMessage.error('登录已过期，请重新登录')
        next('/login')
        return
      }
    } catch {
      userStore.logout()
      next('/login')
      return
    }
  }

  // 权限校验
  if (to.meta.permission && !userStore.hasPermission(to.meta.permission as string)) {
    ElMessage.error('无权访问该页面')
    next('/')
    return
  }

  next()
})

export default router
