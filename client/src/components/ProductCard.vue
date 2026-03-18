<template>
  <RouterLink :to="`/products/${product.id}`" class="product-card card">
    <div class="product-img-wrap">
      <img
        :src="product.image ? `/uploads/${product.image}` : '/placeholder.png'"
        :alt="product.title"
        loading="lazy"
      />
      <span :class="['badge', product.status === 'sold' ? 'badge-sold' : 'badge-available']">
        {{ product.status }}
      </span>
    </div>
    <div class="product-body">
      <p class="product-category">{{ product.category_name }}</p>
      <h3 class="product-title">{{ product.title }}</h3>
      <div class="product-footer">
        <span class="product-price">฿{{ Number(product.price).toFixed(2) }}</span>
        <span class="product-seller">
          <span class="stars">{{ starStr(product.avg_rating) }}</span>
          {{ product.seller_name }}
        </span>
      </div>
    </div>
  </RouterLink>
</template>

<script setup>
defineProps({ product: { type: Object, required: true } })

function starStr(avg) {
  if (!avg) return '☆☆☆☆☆'
  const full  = Math.round(avg)
  return '★'.repeat(full) + '☆'.repeat(5 - full)
}
</script>

<style scoped>
.product-card { display: block; text-decoration: none; color: inherit; transition: transform .15s, box-shadow .15s; }
.product-card:hover { transform: translateY(-3px); box-shadow: 0 6px 18px rgba(0,0,0,.12); }

.product-img-wrap { position: relative; }
.product-img-wrap img { width: 100%; height: 200px; object-fit: cover; display: block; }
.product-img-wrap .badge { position: absolute; top: .6rem; right: .6rem; }

.product-body { padding: .9rem 1rem; }
.product-category { font-size: .78rem; color: var(--gray-600); text-transform: uppercase; letter-spacing: .05em; margin-bottom: .25rem; }
.product-title { font-size: 1rem; font-weight: 700; margin-bottom: .6rem; display: -webkit-box; -webkit-line-clamp: 2; -webkit-box-orient: vertical; overflow: hidden; }
.product-footer { display: flex; justify-content: space-between; align-items: center; }
.product-price { font-size: 1.1rem; font-weight: 800; color: var(--primary); }
.product-seller { font-size: .8rem; color: var(--gray-600); text-align: right; }
</style>
