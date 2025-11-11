<!-- <template>
  <div class="homeview">
    <h1>HOME</h1>
  </div>
</template> -->

<script setup>
import logo from '@/assets/ss_logo.png'
import { routes } from '@/router/index.js'
import { useRouter, useRoute } from 'vue-router'
import { Button } from '@/components/ui/button'
const router = useRouter()
const route = useRoute()
</script>

<template>
  <main class="min-h-screen flex flex-col items-center justify-center bg-white text-gray-900 px-4">
    <!-- Accessible logo and app name -->
    <header class="flex flex-col items-center mb-6 text-center">
      <img :src="logo" alt="SupportSphere logo" class="w-32 h-auto mb-4" />
      <h1 class="text-3xl md:text-4xl font-bold tracking-tight">
        Welcome to <span class="text-primary">SupportSphere</span>
      </h1>
      <p class="mt-2 text-gray-700 max-w-prose">
        Connecting members and communities through a responsive, accessible experience.
      </p>
    </header>

    <div class="hidden md:block flex items-center gap-2">
      <Button variant="outline" class="w-full" @click="router.push('/member-login')">Login </Button>
      <Button class="w-full" @click="router.push('/member-signup')"> Sign up </Button>
    </div>
  </main>
</template>
