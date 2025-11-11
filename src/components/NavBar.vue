<!-- <template>
  <nav
    class="navbar navbar-expand-lg navbar-fixed-top my-navbar"
    :class="{ 'menu-open': menuOpen }"
    role="navigation"
  >
    <div class="navbar-inner container-fluid">
      <div class="d-flex justify-content-end">
        <button
          type="button"
          class="navbar-toggler"
          data-bs-toggle="collapse"
          data-bs-target="#navbarLinks"
          aria-controls="navbarLinks"
          aria-expanded="false"
          aria-label="Toggle Navigation Links"
          @click="switchMenu"
        >
          <span class="navbar-toggler-icon"></span>
        </button>
      </div>

      <div class="collapse navbar-collapse justify-content-center" id="navbarLinks">
        <ul class="navbar-nav">
          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/member-login" class="button" active-class="active"
              >Member Login</router-link
            >
          </li>

          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/admin-login" class="button" active-class="active"
              >Admin Login</router-link
            >
          </li>
          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/community-feed" class="button" active-class="active"
              >Community Feed</router-link
            >
          </li>

          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/feed-analytics" class="button" active-class="active"
              >Feed Analytics</router-link
            >
          </li>

          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/member-signup" class="button" active-class="active"
              >Member Sign Up</router-link
            >
          </li>

          <li class="nav-item mx-2 my-lg-0 my-2">
            <router-link to="/user-manager" class="button" active-class="active"
              >User Manager</router-link
            >
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.my-navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1030;
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  width: 100vw;
}

.my-navbar.menu-open {
  background-color: #ffffff;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

@media (max-width: 991.98px) {
  .my-navbar {
    background-color: transparent;
    box-shadow: none;
  }
}
</style>

<script setup>
import { ref } from 'vue'

const menuOpen = ref(false)
const switchMenu = () => {
  menuOpen.value = !menuOpen.value
}
</script> -->
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
import { ref } from 'vue'
const menuOpen = ref(false)
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
