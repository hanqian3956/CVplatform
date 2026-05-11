<template>
  <el-container class="main-layout">
    <el-aside :width="collapsed ? '64px' : '220px'" class="sidebar">
      <div class="logo">
        <span v-if="!collapsed">算法运营后台</span>
        <span v-else>算</span>
      </div>
      <el-menu
        :default-active="route.path"
        :collapse="collapsed"
        :collapse-transition="false"
        router
        background-color="#001529"
        text-color="#bfcbd9"
        active-text-color="#409eff"
      >
        <el-menu-item v-if="hasMenuPermission('algorithm:list')" index="/algorithm/list">
          <el-icon><Cpu /></el-icon>
          <template #title>算法管理</template>
        </el-menu-item>
        <el-menu-item v-if="hasMenuPermission('category:list')" index="/category/list">
          <el-icon><Folder /></el-icon>
          <template #title>分类管理</template>
        </el-menu-item>
        <el-menu-item v-if="hasMenuPermission('user-algorithm:list')" index="/user-algorithm/config">
          <el-icon><User /></el-icon>
          <template #title>租户算法</template>
        </el-menu-item>
        <el-sub-menu v-if="hasSystemMenu" index="/system">
          <template #title>
            <el-icon><Setting /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item v-if="hasMenuPermission('system:user:list')" index="/system/user">用户管理</el-menu-item>
          <el-menu-item v-if="hasMenuPermission('system:role:list')" index="/system/role">角色管理</el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <el-header class="header">
        <div class="header-left">
          <el-icon class="collapse-btn" @click="toggleCollapse">
            <Fold v-if="!collapsed" />
            <Expand v-else />
          </el-icon>
          <breadcrumb />
        </div>
        <div class="header-right">
          <el-dropdown @command="handleCommand">
            <span class="user-info">
              <el-icon><UserFilled /></el-icon>
              {{ userStore.userInfo?.nickname || '管理员' }}
              <el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="logout">
                  <el-icon><SwitchButton /></el-icon>退出登录
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main class="main-content">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { Cpu, Folder, User, Fold, Expand, Setting, UserFilled, ArrowDown, SwitchButton } from '@element-plus/icons-vue'
import { useAppStore } from '@/stores/app'
import { useUserStore } from '@/stores/user'
import Breadcrumb from '@/components/Breadcrumb.vue'

const route = useRoute()
const router = useRouter()
const { collapsed, toggleCollapse } = useAppStore()
const userStore = useUserStore()

const hasSystemMenu = computed(() => {
  return userStore.hasPermission('system:user:list') || userStore.hasPermission('system:role:list')
})

function hasMenuPermission(code: string): boolean {
  return userStore.hasPermission(code)
}

function handleCommand(cmd: string) {
  if (cmd === 'logout') {
    userStore.logout()
    ElMessage.success('已退出登录')
    router.push('/login')
  }
}
</script>

<style scoped lang="scss">
.main-layout {
  height: 100vh;
}

.sidebar {
  background-color: #001529;
  transition: width 0.3s;
}

.logo {
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 18px;
  font-weight: 600;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.collapse-btn {
  font-size: 20px;
  cursor: pointer;
  color: #606266;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 16px;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #606266;
  font-size: 14px;
  cursor: pointer;
}

.main-content {
  background: #f0f2f5;
  padding: 20px;
  overflow-y: auto;
}
</style>
