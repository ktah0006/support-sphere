import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import AdminLogin from '@/views/AdminLogin.vue'
import MemberLogin from '@/views/MemberLogin.vue'
import CommunityFeed from '@/views/CommunityFeed.vue'
import FeedAnalytics from '@/views/FeedAnalytics.vue'
import MemberSignUp from '@/views/MemberSignUp.vue'
import UserManager from '@/views/UserManager.vue'

export const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/admin-login',
    name: 'adminLogin',
    component: AdminLogin,
  },
  {
    path: '/member-login',
    name: 'memberLogin',
    component: MemberLogin,
  },

  {
    path: '/member-signup',
    name: 'memberSignUp',
    component: MemberSignUp,
  },

  {
    path: '/community-feed',
    name: 'communityFeed',
    component: CommunityFeed,
  },

  {
    path: '/feed-analytics',
    name: 'feedAnalytics',
    component: FeedAnalytics,
  },

  {
    path: '/user-manager',
    name: 'userManager',
    component: UserManager,
  },
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

export default router
