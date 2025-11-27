<template>
  <main
    class="min-h-screen flex flex-col items-center justify-center text-black px-4"
    id="main-content"
  >
    <Card
      role="region"
      aria-label="welcome message"
      class="w-full max-w-md md:max-w-lg lg:max-w-xl shadow-lg rounded-2xl p-6"
    >
      <CardHeader>
        <div class="flex justify-center">
          <img :src="logo" alt="SupportSphere logo" class="w-32" />
        </div>
        <CardTitle
          ><h1
            class="text-3xl font-bold tracking-tight text-center hidden md:block"
            id="welcome-message"
          >
            Welcome to SupportSphere
          </h1></CardTitle
        >
        <CardDescription class="text-black hidden md:block text-center"
          >Support Sphere is an online social platform for people living with disabilities. Join
          this supportive, and safe environment where members can build long-lasting emotional
          connections</CardDescription
        >
      </CardHeader>
      <CardContent>
        <div
          class="flex flex-col sm:flex-row justify-center items-center gap-4 w-full"
          v-if="!isAuthenticated"
        >
          <Button
            role="button"
            aria-label="sign into account"
            variant="bold"
            @click="router.push('/user-login')"
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
        <div
          class="flex flex-col sm:flex-row justify-center items-center gap-4 w-full"
          v-if="isAuthenticated"
        >
          <Button
            role="button"
            aria-label="go to community feed"
            variant="bold"
            @click="router.push('/community-feed')"
            >Community Feed
          </Button>
        </div>
      </CardContent>
      <CardFooter class="sr-only"> end of the welcome page </CardFooter>
    </Card>
  </main>
</template>

<script setup>
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import logo from '@/assets/ss_logo.png'
import { useRouter } from 'vue-router'
import { Button } from '@/components/ui/button'
import { userStore } from '../store/store'

const router = useRouter()

const user = userStore()
const isAuthenticated = !!user.userState
</script>
