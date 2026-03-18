<template>
  <div v-if="loading" class="center-msg">Loading…</div>
  <div v-else-if="error" class="alert alert-error">{{ error }}</div>

  <div v-else-if="product" class="detail-layout">
    <!-- Image -->
    <div class="detail-image">
      <img :src="product.image ? `/uploads/${product.image}` : '/placeholder.png'" :alt="product.title" />
    </div>

    <!-- Info -->
    <div class="detail-info">
      <div class="detail-top">
        <span class="category-chip">{{ product.category_name }}</span>
        <span :class="['badge', product.status === 'sold' ? 'badge-sold' : 'badge-available']">{{ product.status }}</span>
      </div>
      <h1>{{ product.title }}</h1>
      <p class="price">฿{{ Number(product.price).toFixed(2) }}</p>
      <p class="description">{{ product.description }}</p>

      <div class="seller-box">
        <strong>Sold by:</strong> {{ product.seller_name }}
        <span v-if="product.avg_rating" class="stars">
          {{ starStr(product.avg_rating) }} ({{ product.review_count }} reviews)
        </span>
      </div>

      <!-- Owner actions -->
      <div v-if="isOwner || auth.isAdmin" class="owner-actions">
        <RouterLink :to="`/products/${product.id}/edit`" class="btn btn-outline">Edit</RouterLink>
        <button class="btn btn-danger" @click="handleDelete">Delete</button>
      </div>
    </div>

    <!-- Reviews section -->
    <div class="reviews-section card">
      <h2>Reviews for {{ product.seller_name }}</h2>

      <!-- Submit review -->
      <div v-if="auth.isLoggedIn && !isOwner" class="review-form">
        <div v-if="reviewError"   class="alert alert-error">{{ reviewError }}</div>
        <div v-if="reviewSuccess" class="alert alert-success">{{ reviewSuccess }}</div>
        <div class="form-group">
          <label>Your rating</label>
          <select v-model="reviewForm.rating" class="form-control" style="width:auto">
            <option v-for="n in 5" :key="n" :value="n">{{ '★'.repeat(n) }}</option>
          </select>
        </div>
        <div class="form-group">
          <label>Comment (optional)</label>
          <textarea v-model="reviewForm.comment" class="form-control" rows="3" />
        </div>
        <button class="btn btn-primary" @click="submitReview" :disabled="submitting">
          {{ submitting ? 'Submitting…' : 'Submit Review' }}
        </button>
      </div>

      <!-- Review list -->
      <div v-if="reviews.length" style="margin-top:1rem">
        <ReviewCard v-for="r in reviews" :key="r.id" :review="r" />
      </div>
      <p v-else class="center-msg">No reviews yet.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter }      from 'vue-router'
import { productAPI, reviewAPI }    from '@/services/api'
import { useAuthStore }             from '@/store'
import ReviewCard                   from '@/components/ReviewCard.vue'

const route   = useRoute()
const router  = useRouter()
const auth    = useAuthStore()

const product       = ref(null)
const reviews       = ref([])
const loading       = ref(true)
const error         = ref('')
const reviewForm    = ref({ rating: 5, comment: '' })
const reviewError   = ref('')
const reviewSuccess = ref('')
const submitting    = ref(false)

const isOwner = computed(() => auth.user?.id === product.value?.seller_id)

function starStr(avg) {
  const n = Math.round(avg || 0)
  return '★'.repeat(n) + '☆'.repeat(5 - n)
}

async function fetchProduct() {
  try {
    const { data } = await productAPI.getById(route.params.id)
    product.value = data
    const rev = await reviewAPI.getBySeller(data.seller_id)
    reviews.value = rev.data.reviews
  } catch {
    error.value = 'Product not found'
  } finally {
    loading.value = false
  }
}

async function handleDelete() {
  if (!confirm('Delete this product?')) return
  try {
    await productAPI.delete(product.value.id)
    router.push('/')
  } catch (e) {
    alert(e.response?.data?.message || 'Delete failed')
  }
}

async function submitReview() {
  reviewError.value = ''; reviewSuccess.value = ''
  submitting.value = true
  try {
    await reviewAPI.create(product.value.seller_id, reviewForm.value)
    reviewSuccess.value = 'Review submitted!'
    fetchProduct()
  } catch (e) {
    reviewError.value = e.response?.data?.message || 'Failed to submit'
  } finally {
    submitting.value = false
  }
}

onMounted(fetchProduct)
</script>

<style scoped>
.detail-layout { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
.detail-image { grid-row: 1; }
.detail-image img { width: 100%; border-radius: var(--radius); max-height: 420px; object-fit: cover; }
.detail-info { display: flex; flex-direction: column; gap: .75rem; }
.detail-top { display: flex; gap: .5rem; align-items: center; }
.category-chip { background: var(--gray-100); padding: .2rem .6rem; border-radius: 999px; font-size: .8rem; }
h1 { font-size: 1.7rem; }
.price { font-size: 1.8rem; font-weight: 800; color: var(--primary); }
.description { color: var(--gray-600); line-height: 1.7; }
.seller-box { background: var(--gray-50); padding: .8rem 1rem; border-radius: var(--radius); }
.owner-actions { display: flex; gap: .75rem; }
.reviews-section { grid-column: 1 / -1; padding: 1.5rem; }
.review-form { border-bottom: 1px solid var(--gray-200); padding-bottom: 1.25rem; margin-bottom: 1rem; }
.center-msg { text-align: center; color: var(--gray-600); padding: 1.5rem; }

@media (max-width: 700px) {
  .detail-layout { grid-template-columns: 1fr; }
}
</style>
