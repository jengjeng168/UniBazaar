<template>
  <div class="auth-wrap">
    <div class="card auth-card">
      <h2>Welcome UniBazaar 👋</h2>
      <p class="sub">Sign in to your UniBazaar account</p>

      <div v-if="error" class="alert alert-error">{{ error }}</div>

      <form @submit.prevent="handleLogin">
        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" class="form-control" type="email" required placeholder="you@email.com" />
        </div>
        <div class="form-group">
          <label>Password</label>
          <input v-model="form.password" class="form-control" type="password" required placeholder="••••••" />
        </div>
        <button class="btn btn-primary" style="width:100%" :disabled="loading">
          {{ loading ? 'Signing in…' : 'Login' }}
        </button>
      </form>

      <p class="auth-footer">Don't have an account? <RouterLink to="/register">Register</RouterLink></p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store'
import { useRouter, useRoute } from 'vue-router'

const auth   = useAuthStore()
const router = useRouter()
const route  = useRoute()

const form    = ref({ email: '', password: '' })
const error   = ref('')
const loading = ref(false)

async function handleLogin() {
  error.value   = ''
  loading.value = true
  try {
    await auth.login(form.value)
    router.push(route.query.redirect || '/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrap { display: flex; justify-content: center; align-items: flex-start; padding-top: 4rem; }
.auth-card { padding: 2.5rem; width: 100%; max-width: 420px; }
h2 { font-size: 1.6rem; margin-bottom: .25rem; }
.sub { color: var(--gray-600); margin-bottom: 1.5rem; }
.auth-footer { text-align: center; margin-top: 1.25rem; font-size: .9rem; }
</style>
