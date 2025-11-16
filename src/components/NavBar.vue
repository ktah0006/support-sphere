<!-- Component adapted from ShadCN UI -->
<template>
  <pre>{{ JSON.stringify(allowedRoutes.value, null, 2) }}</pre>
  <nav class="bg-white w-full inset-x-0 fixed top-0">
    <div class="flex h-16 items-center justify-between px-5">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button @click="menuOpen = !menuOpen" class="md:hidden" variant="outline"> Menu </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <!-- Nav Links in Dropdown -->
          <DropdownMenuItem v-for="link in allowedRoutes" :key="link.path" as-child>
            <RouterLink
              :to="link.path"
              class="w-full block py-1.5 text-sm"
              :class="{ 'text-primary font-semibold': route.path === link.path }"
            >
              {{ link.name }}
            </RouterLink>
          </DropdownMenuItem>

          <hr class="my-2 border-t border-muted" />

          <!-- Buttons in Dropdown -->
          <DropdownMenuItem as-child>
            <Button
              variant="outline"
              class="w-full"
              @click="router.push('/member-login')"
              v-if="!isAuthenticated"
            >
              Login
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem as-child>
            <Button class="w-full" @click="router.push('/member-signup')" v-if="!isAuthenticated">
              Sign up
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem as-child>
            <Button
              role="button"
              aria-label="lougout of account"
              variant="destructive"
              @click="logout"
              v-if="isAuthenticated"
            >
              Logout
            </Button></DropdownMenuItem
          >
        </DropdownMenuContent>
      </DropdownMenu>

      <NavigationMenu class="hidden md:block">
        <NavigationMenuList class="">
          <NavigationMenuItem v-for="link in allowedRoutes" :key="link.path">
            <NavigationMenuLink as-child>
              <RouterLink :to="link.path">
                <Button
                  :key="link.path"
                  :variant="route.path === link.path ? 'bold' : 'outline'"
                  @click="router.push(link.path)"
                  :aria-current="route.path === link.path ? 'page' : false"
                  role="link"
                >
                  {{ link.name }}
                </Button>
              </RouterLink>
            </NavigationMenuLink>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <div class="flex flex-row justify-center items-center gap-4">
        <Button
          role="button"
          aria-label="sign into account"
          variant="bold"
          @click="router.push('/member-login')"
          v-if="!isAuthenticated"
          >Login
        </Button>
        <Button
          role="button"
          aria-label="sign up for account"
          variant="bold"
          @click="router.push('/member-signup')"
          v-if="!isAuthenticated"
        >
          Sign up
        </Button>
        <Button
          role="button"
          aria-label="lougout of account"
          variant="destructive"
          @click="logout"
          v-if="isAuthenticated"
        >
          Logout
        </Button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="js">
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from '@/components/ui/navigation-menu'

import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { useRouter, useRoute } from 'vue-router'
const router = useRouter()
const route = useRoute()
import { routes } from '@/router/index.js'
import { ref, computed } from 'vue'
import { signOut } from 'firebase/auth'
import { auth } from '@/firebase/init.js'
const menuOpen = ref(false)

import { userStore } from '../store/store'
const user = userStore()
const isAuthenticated = computed(() => !!user.userState)
const isAdmin = computed(() => user.isAdmin)

const allowedRoutes = computed(() =>
  routes.filter((allowedRoute) => {
    if (allowedRoute.meta?.authOnly && !isAuthenticated.value) {
      return false
    }
    if (allowedRoute.meta?.adminOnly && !isAdmin.value) {
      return false
    }
    return true
  }),
)

const logout = async () => {
  try {
    await signOut(auth)
    console.log('signed out of firebase')
    router.push('/member-login')
    console.log(auth.currentUser)
  } catch (error) {
    console.log('error during logout', error.code)
  }
}
</script>
