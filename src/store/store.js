import { defineStore } from 'pinia'

export const userStore = defineStore('userState', {
  state: () => ({
    isAdmin: false,
    userState: null,
    authComplete: false,
  }),

  actions: {
    setUserState(userState) {
      this.userState = userState
    },
    setAdminStatus(isAdmin) {
      this.isAdmin = isAdmin
    },
    authenticationComplete() {
      this.authComplete = true
    },
    isAuthReady() {
      return this.authComplete
    },
  },
})
