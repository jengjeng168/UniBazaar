import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/ProductListPage.vue'),
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/LoginPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/register',
    name: 'Register',
    component: () => import('@/pages/RegisterPage.vue'),
    meta: { guestOnly: true },
  },
  {
    path: '/products/:id',
    name: 'ProductDetail',
    component: () => import('@/pages/ProductDetailPage.vue'),
  },
  {
    path: '/products/new',
    name: 'AddProduct',
    component: () => import('@/pages/AddEditProductPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/products/:id/edit',
    name: 'EditProduct',
    component: () => import('@/pages/AddEditProductPage.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('@/pages/AdminDashboardPage.vue'),
    meta: { requiresAuth: true, adminOnly: true },
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to, _from, next) => {
  const auth = useAuthStore()

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next({ name: 'Login', query: { redirect: to.fullPath } })
  }
  if (to.meta.adminOnly && !auth.isAdmin) {
    return next({ name: 'Home' })
  }
  if (to.meta.guestOnly && auth.isLoggedIn) {
    return next({ name: 'Home' })
  }
  next()
})

export default router
