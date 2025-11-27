import { defineStore } from 'pinia'

export const userStore = defineStore('userState', {
  state: () => ({
    isAdmin: false,
    userState: null,
    authComplete: false,
    name: null,
    email: null,
  }),

  actions: {
    setUserState(userState) {
      this.userState = userState
      this.email = userState?.email || null
    },
    setName(name) {
      this.name = name
    },
    setAdminStatus(isAdmin) {
      this.isAdmin = isAdmin
    },
    authenticationComplete() {
      this.authComplete = true
      if (this._authReadyResolver) {
        this._authReadyResolver()
        this._authReadyResolver = null
      }
    },
    isAuthReady() {
      if (this.authComplete) return Promise.resolve()
      return new Promise((resolve) => {
        this._authReadyResolver = resolve
      })
    },
  },
})
