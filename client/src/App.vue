<template>
  <NavBar />
  <main class="container" style="padding-top: 1.5rem; padding-bottom: 3rem; min-height: calc(100vh - 64px)">
    <RouterView />
  </main>
</template>

<script setup>
import NavBar from '@/components/NavBar.vue'
import { useAuthStore } from '@/store'
import { onMounted } from 'vue'

const auth = useAuthStore()
onMounted(() => { if (auth.isLoggedIn) auth.fetchMe() })
</script>
