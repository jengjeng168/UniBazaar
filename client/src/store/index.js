import { defineStore } from 'pinia'
import { authAPI } from '@/services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    user:  JSON.parse(localStorage.getItem('user') || 'null'),
    token: localStorage.getItem('token') || null,
  }),

  getters: {
    isLoggedIn: (state) => !!state.token,
    isAdmin:    (state) => state.user?.role === 'admin',
  },

  actions: {
    async login(credentials) {
      const { data } = await authAPI.login(credentials)
      this.token = data.token
      this.user  = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user',  JSON.stringify(data.user))
    },

    async register(payload) {
      const { data } = await authAPI.register(payload)
      this.token = data.token
      this.user  = data.user
      localStorage.setItem('token', data.token)
      localStorage.setItem('user',  JSON.stringify(data.user))
    },

    logout() {
      this.token = null
      this.user  = null
      localStorage.removeItem('token')
      localStorage.removeItem('user')
    },

    async fetchMe() {
      try {
        const { data } = await authAPI.me()
        this.user = data
        localStorage.setItem('user', JSON.stringify(data))
      } catch {
        this.logout()
      }
    },
  },
})
