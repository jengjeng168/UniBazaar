<template>
  <div class="auth-wrap">
    <div class="card auth-card">
      <h2>Create account 🎓</h2>
      <p class="sub">Join your UniBazaar today</p>

      <div v-if="error"   class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <form @submit.prevent="handleRegister">
        <div class="form-group">
          <label>Username</label>
          <input v-model="form.username" class="form-control" required placeholder="yourname" />
        </div>

        <div class="form-group">
          <label>Email</label>
          <input v-model="form.email" class="form-control" type="email" required placeholder="you@email.com" />
        </div>

        <!-- Password -->
        <div class="form-group">
          <label>Password <small>(min 6 characters)</small></label>
          <input
            v-model="form.password"
            class="form-control"
            :type="showPassword ? 'text' : 'password'"
            required
            minlength="6"
            placeholder="••••••••"
          />
          <span class="eye" @click="showPassword = !showPassword">
            {{ showPassword ? '🙈' : '👁️' }}
          </span>
        </div>

        <!-- Confirm Password -->
        <div class="form-group">
          <label>Confirm Password</label>
          <input
            v-model="form.confirmPassword"
            class="form-control"
            :type="showConfirm ? 'text' : 'password'"
            required
            placeholder="••••••••"
          />
          <span class="eye" @click="showConfirm = !showConfirm">
            {{ showConfirm ? '🙈' : '👁️' }}
          </span>
        </div>

        <button class="btn btn-primary" style="width:100%" :disabled="loading">
          {{ loading ? 'Creating account…' : 'Register' }}
        </button>
      </form>

      <p class="auth-footer">
        Already have an account? <RouterLink to="/login">Login</RouterLink>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/store'
import { useRouter } from 'vue-router'

const auth    = useAuthStore()
const router  = useRouter()

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error   = ref('')
const success = ref('')
const loading = ref(false)

const showPassword = ref(false)
const showConfirm  = ref(false)

async function handleRegister() {
  error.value = ''
  success.value = ''

  // ✅ check password match
  if (form.value.password !== form.value.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }

  loading.value = true
  try {
    await auth.register(form.value)
    router.push('/')
  } catch (err) {
    error.value = err.response?.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.auth-wrap {
  display: flex;
  justify-content: center;
  padding-top: 4rem;
}

.auth-card {
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
}

h2 {
  font-size: 1.6rem;
  margin-bottom: .25rem;
}

.sub {
  color: var(--gray-600);
  margin-bottom: 1.5rem;
}

.auth-footer {
  text-align: center;
  margin-top: 1.25rem;
  font-size: .9rem;
}

/* ✅ eye icon */
.form-group {
  position: relative;
}

.eye {
  position: absolute;
  right: 10px;
  top: 38px;
  cursor: pointer;
  user-select: none;
}
</style>