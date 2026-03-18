<template>
  <nav class="navbar">
    <div class="container nav-inner">
      <RouterLink to="/" class="nav-brand">UniBazaar</RouterLink>

      <div class="nav-links">
        <RouterLink to="/">Browse</RouterLink>

        <template v-if="auth.isLoggedIn">
          <RouterLink to="/products/new">+ Sell</RouterLink>
          <RouterLink v-if="auth.isAdmin" to="/admin">Admin</RouterLink>
          <span class="nav-user">{{ auth.user?.username }}</span>
          <button class="btn btn-outline btn-sm" @click="handleLogout">Logout</button>
        </template>

        <template v-else>
          <RouterLink to="/login">Login</RouterLink>
          <RouterLink to="/register" class="btn btn-primary btn-sm">Register</RouterLink>
        </template>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useAuthStore } from '@/store'
import { useRouter }    from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()

function handleLogout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.navbar {
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,0,0,.1);
  height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 100;
}
.nav-inner { display: flex; align-items: center; justify-content: space-between; width: 100%; }
.nav-brand { font-size: 1.2rem; font-weight: 800; color: var(--primary); }
.nav-links { display: flex; align-items: center; gap: 1.2rem; }
.nav-links a { color: var(--gray-800); font-weight: 500; }
.nav-links a.router-link-active { color: var(--primary); }
.nav-user { font-weight: 600; color: var(--gray-600); }
</style>
