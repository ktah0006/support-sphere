<!-- Component adapted from ShadCN UI -->
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
const menuOpen = ref(false)

import { userStore } from '../store/store'
const user = userStore()
const isAuthenticated = computed(() => !!user.userState)
const isAdmin = computed(() => user.isAdmin)
</script>

<template>
  <nav class="bg-white w-full inset-x-0 fixed top-0">
    <div class="flex h-16 items-center justify-between px-5">
      <DropdownMenu>
        <DropdownMenuTrigger as-child>
          <Button @click="menuOpen = !menuOpen" class="md:hidden" variant="outline"> Menu </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent class="w-56">
          <!-- Nav Links in Dropdown -->
          <DropdownMenuItem v-for="link in routes" :key="link.path" as-child>
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
            <Button variant="outline" class="w-full" @click="router.push('/member-login')">
              Login
            </Button>
          </DropdownMenuItem>

          <DropdownMenuItem as-child>
            <Button class="w-full" @click="router.push('/member-signup')"> Sign up </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <NavigationMenu class="hidden md:block">
        <NavigationMenuList class="">
          <NavigationMenuItem v-for="link in routes" :key="link.path">
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
          >Login
        </Button>
        <Button
          role="button"
          aria-label="sign up for account"
          variant="bold"
          @click="router.push('/member-signup')"
        >
          Sign up
        </Button>
      </div>
    </div>
  </nav>
</template>
