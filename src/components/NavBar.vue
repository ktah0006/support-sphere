<!-- Component adapted from ShadCN UI -->
<template>
  <nav class="bg-white shadow fixed top-0 inset-x-0 z-50">
    <div class="flex h-16 items-center justify-between px-5">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button @click="menuOpen = !menuOpen" class="md:hidden" variant="outline"> Menu </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56 ml-5">
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
        <Badge variant="adminLabel" v-if="isAdmin"> Admin </Badge>
        <Button
          role="button"
          aria-label="sign into account"
          variant="bold"
          @click="router.push('/user-login')"
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

        <Popover v-if="isAuthenticated">
          <PopoverTrigger as-child>
            <!-- <Button variant="outline"> Open popover </Button> -->
            <!-- svg taken from figma -->
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="36"
              height="36"
              viewBox="0 0 50 50"
              fill="none"
            >
              <rect width="50" height="50" rx="25" fill="#EADDFF" />
              <path
                fill-rule="evenodd"
                clip-rule="evenodd"
                d="M32.5003 20C32.5003 24.1421 29.1424 27.5 25.0003 27.5C20.8582 27.5 17.5003 24.1421 17.5003 20C17.5003 15.8579 20.8582 12.5 25.0003 12.5C29.1424 12.5 32.5003 15.8579 32.5003 20ZM30.0003 20C30.0003 22.7614 27.7617 25 25.0003 25C22.2389 25 20.0003 22.7614 20.0003 20C20.0003 17.2386 22.2389 15 25.0003 15C27.7617 15 30.0003 17.2386 30.0003 20Z"
                fill="#4F378A"
              />
              <path
                d="M25.0003 31.25C16.9073 31.25 10.0119 36.0355 7.38525 42.7401C8.02512 43.3754 8.69918 43.9765 9.40441 44.5401C11.3603 38.3846 17.4962 33.75 25.0003 33.75C32.5044 33.75 38.6403 38.3846 40.5962 44.5401C41.3014 43.9765 41.9755 43.3755 42.6154 42.7401C39.9887 36.0355 33.0933 31.25 25.0003 31.25Z"
                fill="#4F378A"
              />
            </svg>
          </PopoverTrigger>
          <PopoverContent class="w-auto p-7 mx-5">
            <div class="grid gap-4 text-center">
              <h1 class="font-semibold text-lg">Account Information</h1>
              <div class="space-y-2">
                <h4 class="font-medium leading-none">{{ user.name }}</h4>
                <p class="text-sm">{{ user.email }}</p>
              </div>
              <div class="flex justify-center">
                <Badge variant="adminLabel" v-if="isAdmin"> Admin Acccount </Badge>
                <Badge variant="adminLabel" v-if="!isAdmin"> Member Acccount </Badge>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { Badge } from '@/components/ui/badge'
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
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
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
    // don't display anything except login, signup and home page is not logged in
    if (allowedRoute.meta?.authOnly && !isAuthenticated.value) {
      return false
    }
    // don't display admin only pages if the user isn't an admin
    if (allowedRoute.meta?.adminOnly && !isAdmin.value) {
      return false
    }
    // don't display login and signup links on the LHS of the navbar
    if (!allowedRoute.meta?.mainNav) {
      return false
    }
    return true
  }),
)

const logout = async () => {
  try {
    await signOut(auth)
    console.log('signed out of firebase')
    router.push('/user-login')
    console.log(auth.currentUser)
  } catch (error) {
    console.log('error during logout', error.code)
  }
}
</script>
