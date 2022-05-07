// 上一个版本使用的是VueRouter,const router = new VueRouter({ routes: [] })，export default router
// 这个版本使用的是createRouter
import { createRouter, createWebHashHistory } from 'vue-router'
import store from '@/vuex'
// 路由规则
const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login/index.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import('@/views/Home/index.vue')
  },
  {
    path: '/category',
    name: 'category',
    component: () => import('@/views/Category/index.vue')
  },
  {
    path: '/category-detail/:categoryId',
    name: 'category-detail',
    component: () => import('@/views/CategoryDetail/index.vue'),
    props: true
  },
  {
    path: '/order-confirm',
    name: 'order-confirm',
    component: () => import('@/views/OrderConfirm/index.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/address',
    name: 'address',
    component: () => import('@/views/Address/index.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/order',
    name: 'order',
    component: () => import('@/views/Order/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/order-detail/:orderId',
    name: 'order-detail',
    component: () => import('@/views/OrderDetail/index.vue'),
    props: true,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/pay',
    name: 'pay',
    component: () => import('@/views/Pay/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/product/:productId',
    name: 'product',
    component: () => import('@/views/Product/index.vue'),
    props: true
  },
  {
    path: '/comment/:productId',
    name: 'comment',
    component: () => import('@/views/Comment/index.vue'),
    props: true
  },
  {
    path: '/recommend',
    name: 'recommend',
    component: () => import('@/views/Recommend/index.vue')
  },
  {
    path: '/cart',
    name: 'cart',
    component: () => import('@/views/Cart/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/search',
    name: 'search',
    component: () => import('@/views/Search/index.vue')
  },
  {
    path: '/user',
    name: 'user',
    component: () => import('@/views/User/index.vue'),
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'page-error',
    component: () => import('@/views/PageError/index.vue')
  }
]

// 修改原型
// const originalPush = createRouter.prototype.push
// createRouter.prototype.push = function push (location, onResolve, onReject) {
//   if (onResolve || onReject) return originalPush.call(this, location, onResolve, onReject)
//   return originalPush.call(this, location).catch(err => err)
// }
//  --------------
// const routerPush = createRouter.prototype.push
// createRouter.prototype.push = function push (location) {
//   return routerPush.call(this, location).catch(error => error)
// }

// 创建router实例
const router = createRouter({
  // 上一个版本采用 mode指定hash/history
  // 两种模式：通过history指定：[hash：createWebHashHistory  history: createWebHistory]
  history: createWebHashHistory(),
  routes
})

router.beforeEach((to) => {
  if (!to.meta.requiresAuth) {
    return true
  }
  if (!store.state.user.token || !window.localStorage.getItem('USER_TOKEN')) {
    return {
      name: 'login',
      query: {
        // 通过query参数传递当前路径,path
        redirect: to.fullPath
      }
    }
  }
})
export default router
