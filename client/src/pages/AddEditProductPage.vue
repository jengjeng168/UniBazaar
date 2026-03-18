<template>
  <div class="page-wrap">
    <div class="card form-card">
      <h2>{{ isEdit ? 'Edit Product ✏️' : 'List a Product 📦' }}</h2>

      <div v-if="error"   class="alert alert-error">{{ error }}</div>
      <div v-if="success" class="alert alert-success">{{ success }}</div>

      <form @submit.prevent="handleSubmit" enctype="multipart/form-data">
        <div class="form-group">
          <label>Title</label>
          <input v-model="form.title" class="form-control" required placeholder="e.g. Calculus Textbook 8th Edition" />
        </div>

        <div class="form-group">
          <label>Category</label>
          <select v-model="form.category_id" class="form-control" required>
            <option value="" disabled>Select a category</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.name }}</option>
          </select>
        </div>

        <div class="form-group">
          <label>Price (฿)</label>
          <input v-model.number="form.price" class="form-control" type="number" min="0" step="0.01" required placeholder="0.00" />
        </div>

        <div class="form-group">
          <label>Description</label>
          <textarea v-model="form.description" class="form-control" rows="4" required placeholder="Describe condition, edition, included accessories…" />
        </div>

        <div v-if="isEdit" class="form-group">
          <label>Status</label>
          <select v-model="form.status" class="form-control">
            <option value="available">Available</option>
            <option value="sold">Sold</option>
          </select>
        </div>

        <div class="form-group">
          <label>Product Image (optional)</label>
          <input type="file" accept="image/*" @change="onFileChange" class="form-control" />
          <div v-if="preview || currentImage" class="img-preview">
            <img :src="preview || `/uploads/${currentImage}`" alt="Preview" />
          </div>
        </div>

        <div class="form-actions">
          <RouterLink to="/" class="btn btn-outline">Cancel</RouterLink>
          <button class="btn btn-primary" type="submit" :disabled="loading">
            {{ loading ? 'Saving…' : (isEdit ? 'Update Product' : 'List Product') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter }      from 'vue-router'
import { productAPI }               from '@/services/api'

const route  = useRoute()
const router = useRouter()

const isEdit     = computed(() => !!route.params.id && route.path.includes('/edit'))
const categories = ref([])
const form       = ref({ title: '', category_id: '', price: '', description: '', status: 'available' })
const imageFile  = ref(null)
const preview    = ref('')
const currentImage = ref('')
const loading    = ref(false)
const error      = ref('')
const success    = ref('')

function onFileChange(e) {
  imageFile.value = e.target.files[0]
  if (imageFile.value) preview.value = URL.createObjectURL(imageFile.value)
}

async function fetchCategories() {
  const { data } = await productAPI.getCategories()
  categories.value = data
}

async function fetchProduct() {
  if (!isEdit.value) return
  try {
    const { data } = await productAPI.getById(route.params.id)
    form.value = {
      title:       data.title,
      category_id: data.category_id,
      price:       data.price,
      description: data.description,
      status:      data.status,
    }
    currentImage.value = data.image || ''
  } catch {
    error.value = 'Failed to load product'
  }
}

async function handleSubmit() {
  error.value = ''; success.value = ''
  loading.value = true

  const fd = new FormData()
  fd.append('title',       form.value.title)
  fd.append('category_id', form.value.category_id)
  fd.append('price',       form.value.price)
  fd.append('description', form.value.description)
  if (isEdit.value) fd.append('status', form.value.status)
  if (imageFile.value) fd.append('image', imageFile.value)

  try {
    if (isEdit.value) {
      await productAPI.update(route.params.id, fd)
      success.value = 'Product updated!'
    } else {
      const { data } = await productAPI.create(fd)
      router.push(`/products/${data.id}`)
    }
  } catch (err) {
    error.value = err.response?.data?.message || 'Failed to save product'
  } finally {
    loading.value = false
  }
}

onMounted(() => { fetchCategories(); fetchProduct() })
</script>

<style scoped>
.page-wrap { display: flex; justify-content: center; }
.form-card { padding: 2rem; width: 100%; max-width: 640px; }
h2 { font-size: 1.5rem; margin-bottom: 1.5rem; }
.img-preview { margin-top: .75rem; }
.img-preview img { max-width: 260px; border-radius: var(--radius); }
.form-actions { display: flex; gap: 1rem; justify-content: flex-end; margin-top: 1.5rem; }
</style>
