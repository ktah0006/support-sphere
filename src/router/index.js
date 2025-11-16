import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import MemberLogin from '@/views/MemberLogin.vue'
import CommunityFeed from '@/views/CommunityFeed.vue'
import FeedAnalytics from '@/views/FeedAnalytics.vue'
import MemberSignUp from '@/views/MemberSignUp.vue'
import UserManager from '@/views/UserManager.vue'
import { userStore } from '../store/store'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { authOnly: false, adminOnly: false },
  },
  {
    path: '/admin-login',
    name: 'adminLogin',
    component: AdminLogin,
    meta: { authOnly: false, adminOnly: false },
  },
  {
    path: '/member-login',
    name: 'memberLogin',
    component: MemberLogin,
    meta: { authOnly: false, adminOnly: false },
  },

  {
    path: '/member-signup',
    name: 'memberSignUp',
    component: MemberSignUp,
    meta: { authOnly: false, adminOnly: false },
  },

  {
    path: '/community-feed',
    name: 'communityFeed',
    component: CommunityFeed,
    meta: { authOnly: true, adminOnly: false },
  },

  {
    path: '/feed-analytics',
    name: 'feedAnalytics',
    component: FeedAnalytics,
    meta: { authOnly: true, adminOnly: true },
  },

  {
    path: '/user-manager',
    name: 'userManager',
    component: UserManager,
    meta: { authOnly: true, adminOnly: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// only allow login and signup pages if user is not logged in
router.beforeEach((to, from, next) => {
  const user = userStore()
  const isAuthenticated = !!user.userState
  const isAdmin = user.isAdmin
  console.log('isAuthenticated: ', isAuthenticated, ' isAdmin: ', isAdmin)

  if (to.meta.authOnly && !isAuthenticated) {
    return next('/member-login')
  }
  if (to.meta.adminOnly && !isAdmin) {
    return next('/')
  }

  next()
})

export default router
