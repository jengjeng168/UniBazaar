<template>
  <div class="review-card">
    <div class="review-header">
      <strong>{{ review.reviewer_name }}</strong>
      <span class="stars">{{ stars }}</span>
    </div>
    <p v-if="review.comment" class="review-comment">{{ review.comment }}</p>
    <p class="review-date">{{ formatDate(review.created_at) }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'
const props = defineProps({ review: { type: Object, required: true } })

const stars = computed(() => {
  const n = props.review.rating || 0
  return '★'.repeat(n) + '☆'.repeat(5 - n)
})

function formatDate(d) {
  return new Date(d).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })
}
</script>

<style scoped>
.review-card { background: var(--gray-50); border-radius: var(--radius); padding: .9rem 1rem; margin-bottom: .75rem; }
.review-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: .3rem; }
.review-comment { margin-bottom: .3rem; }
.review-date { font-size: .8rem; color: var(--gray-600); }
</style>
