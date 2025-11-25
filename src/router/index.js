import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import UserLogin from '@/views/UserLogin.vue'
import CommunityFeed from '@/views/CommunityFeed.vue'
import FeedAnalytics from '@/views/FeedAnalytics.vue'
import MemberSignUp from '@/views/MemberSignUp.vue'
import UserManager from '@/views/UserManager.vue'
import { userStore } from '../store/store'

export const routes = [
  {
    path: '/',
    name: 'Home',
    component: HomeView,
    meta: { authOnly: false, adminOnly: false, noAuthOnly: false, mainNav: true },
  },
  // {
  //   path: '/admin-login',
  //   name: 'adminLogin',
  //   component: AdminLogin,
  //   meta: { authOnly: false, adminOnly: false },
  // },
  {
    path: '/user-login',
    name: 'Login',
    component: UserLogin,
    meta: { authOnly: false, adminOnly: false, noAuthOnly: true, mainNav: false },
  },

  {
    path: '/member-signup',
    name: 'Sign Up',
    component: MemberSignUp,
    meta: { authOnly: false, adminOnly: false, noAuthOnly: true, mainNav: false },
  },

  {
    path: '/community-feed',
    name: 'Community Feed',
    component: CommunityFeed,
    meta: { authOnly: true, adminOnly: false, noAuthOnly: false, mainNav: true },
  },

  {
    path: '/feed-analytics',
    name: 'Admin Dashboard',
    component: FeedAnalytics,
    meta: { authOnly: true, adminOnly: true, noAuthOnly: false, mainNav: true },
  },

  {
    path: '/user-manager',
    name: 'User Manager',
    component: UserManager,
    meta: { authOnly: true, adminOnly: true, noAuthOnly: false, mainNav: true },
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

// only allow login and signup pages if user is not logged in
router.beforeEach((to, from, next) => {
  const user = userStore()

  if (!user.isAuthReady()) {
    return next()
  }

  const isAuthenticated = !!user.userState
  const isAdmin = user.isAdmin
  console.log('isAuthenticated: ', isAuthenticated, ' isAdmin: ', isAdmin)

  // try to access pages while logged out
  if (to.meta.authOnly && !isAuthenticated) {
    return next('/user-login')
  }
  // try to access admin pages while logged in as a regular member
  if (to.meta.adminOnly && !isAdmin) {
    return next('/')
  }
  // try to access login page when logged in
  if (to.meta.noAuthOnly && isAuthenticated) {
    return next('/')
  }

  next()
})

export default router
