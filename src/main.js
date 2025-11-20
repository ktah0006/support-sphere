import './assets/main.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
const app = createApp(App)
app.use(createPinia())

import router from './router'
import './firebase/init'
import { auth, db } from '@/firebase/init.js'
import { userStore } from './store/store'
import { doc, getDoc } from 'firebase/firestore'

app.use(router)

let appMounted = false

auth.onAuthStateChanged(async (user) => {
  const store = userStore()

  if (user) {
    store.setUserState(user)

    const userFirestoreRef = doc(db, 'Users', user.uid)
    const userSnapshot = await getDoc(userFirestoreRef)

    if (userSnapshot.exists()) {
      store.setName(userSnapshot.data().fullName)
    }

    const token = await user.getIdTokenResult(true)
    const isAdmin = !!token.claims.admin
    store.setAdminStatus(isAdmin)
    user.isAdmin = !!token.claims.admin
    console.log('LOGGED IN')
  } else {
    store.setUserState(null)
    store.setAdminStatus(false)
    store.setName(null)
  }

  store.authenticationComplete()

  if (!appMounted) {
    app.mount('#app')
    appMounted = true
  }
})

// app.mount('#app')
