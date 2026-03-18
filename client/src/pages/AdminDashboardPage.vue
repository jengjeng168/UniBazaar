<template>
  <div>
    <h1 style="margin-bottom:1.5rem">Admin Dashboard 🛡️</h1>

    <!-- Stats -->
    <div class="stats-grid" v-if="stats">
      <div class="stat-card card">
        <div class="stat-num">{{ stats.total_users }}</div>
        <div class="stat-label">Total Users</div>
      </div>
      <div class="stat-card card">
        <div class="stat-num">{{ stats.total_products }}</div>
        <div class="stat-label">Products Listed</div>
      </div>
      <div class="stat-card card">
        <div class="stat-num">{{ stats.total_sold }}</div>
        <div class="stat-label">Items Sold</div>
      </div>
      <div class="stat-card card">
        <div class="stat-num">{{ stats.total_reviews }}</div>
        <div class="stat-label">Reviews</div>
      </div>
      <div class="stat-card card danger">
        <div class="stat-num">{{ stats.banned_users }}</div>
        <div class="stat-label">Banned Users</div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button :class="{ active: tab === 'users' }"    @click="tab = 'users'">Users</button>
      <button :class="{ active: tab === 'products' }" @click="tab = 'products'">Products</button>
    </div>

    <!-- Users table -->
    <div v-if="tab === 'users'" class="card table-card">
      <div v-if="usersLoading" class="center-msg">Loading…</div>
      <table v-else>
        <thead>
          <tr>
            <th>ID</th><th>Username</th><th>Email</th><th>Role</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="u in users" :key="u.id">
            <td>{{ u.id }}</td>
            <td>{{ u.username }}</td>
            <td>{{ u.email }}</td>
            <td><span class="badge" :class="u.role === 'admin' ? 'badge-admin' : 'badge-user'">{{ u.role }}</span></td>
            <td><span :class="['badge', u.is_banned ? 'badge-sold' : 'badge-available']">{{ u.is_banned ? 'Banned' : 'Active' }}</span></td>
            <td>
              <button
                v-if="u.role !== 'admin'"
                :class="['btn btn-sm', u.is_banned ? 'btn-success' : 'btn-danger']"
                @click="toggleBan(u)"
              >{{ u.is_banned ? 'Unban' : 'Ban' }}</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Products table -->
    <div v-if="tab === 'products'" class="card table-card">
      <div v-if="prodsLoading" class="center-msg">Loading…</div>
      <table v-else>
        <thead>
          <tr>
            <th>ID</th><th>Title</th><th>Seller</th><th>Price</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in adminProducts" :key="p.id">
            <td>{{ p.id }}</td>
            <td>{{ p.title }}</td>
            <td>{{ p.seller_name }}</td>
            <td>฿{{ Number(p.price).toFixed(2) }}</td>
            <td><span :class="['badge', p.status === 'sold' ? 'badge-sold' : 'badge-available']">{{ p.status }}</span></td>
            <td>
              <button class="btn btn-sm btn-danger" @click="removeProduct(p)">Remove</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { adminAPI } from '@/services/api'

const stats         = ref(null)
const tab           = ref('users')
const users         = ref([])
const adminProducts = ref([])
const usersLoading  = ref(false)
const prodsLoading  = ref(false)

async function fetchStats() {
  const { data } = await adminAPI.getStats()
  stats.value = data
}

async function fetchUsers() {
  usersLoading.value = true
  const { data } = await adminAPI.getUsers()
  users.value = data.rows
  usersLoading.value = false
}

async function fetchProducts() {
  prodsLoading.value = true
  const { data } = await adminAPI.getProducts()
  adminProducts.value = data.rows
  prodsLoading.value = false
}

async function toggleBan(user) {
  const action = user.is_banned ? 'Unban' : 'Ban'
  if (!confirm(`${action} user "${user.username}"?`)) return
  try {
    if (user.is_banned) await adminAPI.unbanUser(user.id)
    else                await adminAPI.banUser(user.id)
    fetchUsers(); fetchStats()
  } catch (e) { alert(e.response?.data?.message || 'Action failed') }
}

async function removeProduct(product) {
  if (!confirm(`Remove "${product.title}"?`)) return
  try {
    await adminAPI.deleteProduct(product.id)
    fetchProducts(); fetchStats()
  } catch (e) { alert(e.response?.data?.message || 'Delete failed') }
}

watch(tab, (val) => { if (val === 'products') fetchProducts() })

onMounted(() => { fetchStats(); fetchUsers() })
</script>

<style scoped>
.stats-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); gap: 1rem; margin-bottom: 2rem; }
.stat-card { padding: 1.25rem 1rem; text-align: center; }
.stat-card.danger .stat-num { color: var(--danger); }
.stat-num { font-size: 2rem; font-weight: 800; color: var(--primary); }
.stat-label { font-size: .85rem; color: var(--gray-600); margin-top: .25rem; }

.tabs { display: flex; gap: .5rem; margin-bottom: 1rem; }
.tabs button { padding: .5rem 1.25rem; border: 2px solid var(--gray-200); background: #fff; border-radius: var(--radius); cursor: pointer; font-weight: 600; }
.tabs button.active { border-color: var(--primary); color: var(--primary); }

.table-card { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; }
th, td { padding: .75rem 1rem; text-align: left; border-bottom: 1px solid var(--gray-100); font-size: .9rem; }
th { background: var(--gray-50); font-weight: 700; }
tr:last-child td { border-bottom: none; }

.badge-admin { background: #dbeafe; color: #1e40af; }
.badge-user  { background: var(--gray-100); color: var(--gray-600); }
.center-msg { text-align: center; padding: 2rem; color: var(--gray-600); }
</style>
