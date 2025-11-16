import { defineStore } from 'pinia'

export const userStore = defineStore('userState', {
  state: () => ({
    isAdmin: false,
    userState: null,
  }),

  actions: {
    setUserState(userState) {
      this.userState = userState
    },
    setAdminStatus(isAdmin) {
      this.isAdmin = isAdmin
    },
  },
})
