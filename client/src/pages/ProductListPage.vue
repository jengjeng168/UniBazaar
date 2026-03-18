<template>
  <div>
    <!-- Hero -->
    <div class="hero">
      <h1>Find deals on uni.</h1>
      <p>Buy and sell with fellow students — safe, and fast</p>
    </div>

    <!-- Search & Filter -->
    <div class="search-bar card">
      <input
        v-model="search"
        class="form-control"
        placeholder="Search for books, electronics, furniture…"
        @keyup.enter="doSearch"
      />
      <select v-model="category" class="form-control" @change="doSearch">
        <option value="">All categories</option>
        <option v-for="c in categories" :key="c.id" :value="c.name">{{ c.name }}</option>
      </select>
      <button class="btn btn-primary" @click="doSearch">Search</button>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="center-msg">Loading products…</div>
    <div v-else-if="error" class="alert alert-error">{{ error }}</div>

    <!-- Grid -->
    <div v-else class="products-grid">
      <ProductCard v-for="p in products" :key="p.id" :product="p" />
    </div>

    <p v-if="!loading && !products.length" class="center-msg">No products found.</p>

    <!-- Pagination -->
    <div class="pagination" v-if="totalPages > 1">
      <button :disabled="page === 1" @click="changePage(page - 1)">‹ Prev</button>
      <button
        v-for="n in totalPages" :key="n"
        :class="{ active: n === page }"
        @click="changePage(n)"
      >{{ n }}</button>
      <button :disabled="page === totalPages" @click="changePage(page + 1)">Next ›</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { productAPI } from '@/services/api'
import ProductCard from '@/components/ProductCard.vue'

const products   = ref([])
const categories = ref([])
const search     = ref('')
const category   = ref('')
const page       = ref(1)
const total      = ref(0)
const limit      = 12
const loading    = ref(false)
const error      = ref('')

const totalPages = computed(() => Math.ceil(total.value / limit))

async function fetchCategories() {
  const { data } = await productAPI.getCategories()
  categories.value = data
}

async function fetchProducts() {
  loading.value = true
  error.value   = ''
  try {
    const { data } = await productAPI.getAll({
      search: search.value,
      category: category.value,
      page: page.value,
      limit,
    })
    products.value = data.rows
    total.value    = data.total
  } catch {
    error.value = 'Failed to load products'
  } finally {
    loading.value = false
  }
}

function doSearch() { page.value = 1; fetchProducts() }
function changePage(n) { page.value = n; fetchProducts() }

onMounted(() => { fetchCategories(); fetchProducts() })
</script>

<style scoped>
.hero { text-align: center; padding: 2.5rem 1rem 2rem; }
.hero h1 { font-size: 2rem; margin-bottom: .5rem; }
.hero p  { color: var(--gray-600); }

.search-bar {
  display: flex; gap: .75rem; padding: 1rem; margin-bottom: 1.75rem; flex-wrap: wrap;
}
.search-bar .form-control:first-child { flex: 1 1 280px; }
.search-bar select { flex: 0 1 180px; }

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  gap: 1.25rem;
  margin-bottom: 1rem;
}

.center-msg { text-align: center; padding: 3rem; color: var(--gray-600); }
</style>
