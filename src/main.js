import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import './firebase/init'
import { auth } from '@/firebase/init.js'
import { userStore } from './store/store'

const app = createApp(App)

app.use(createPinia())
app.use(router)

auth.onAuthStateChanged(async (user) => {
  const store = userStore()

  if (user) {
    store.setUserState(user)
    const token = await user.getIdTokenResult(true)
    const isAdmin = !!token.claims.admin
    store.setAdminStatus(isAdmin)
    user.isAdmin = !!token.claims.admin
    console.log('LOGGED IN')
  } else {
    // logged out  ⬅️ THIS WAS MISSING
    store.setUserState(null)
    store.setAdminStatus(false)
  }
})

app.mount('#app')
