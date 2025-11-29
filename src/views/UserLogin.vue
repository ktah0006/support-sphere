<template>
  <main class="min-h-screen flex justify-center items-center" id="main-content">
    <!-- adapted from ShadCN -->
    <Card class="w-[350px]" role="region" aria-label="log in form">
      <CardHeader>
        <div class="flex justify-center">
          <img :src="logo" alt="SupportSphere logo" class="w-32" aria-hidden="true" />
        </div>
        <CardTitle class="hidden sm:flex justify-center text-3xl text-[#6929FF]"
          >Welcome Back</CardTitle
        >
        <CardDescription class="flex justify-center text-black"
          >Admin and Member Login</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid w-full gap-4">
            <p v-if="credentialError" role="alert" class="text-red-700 text-sm">
              {{ credentialError }}
            </p>
            <div class="flex flex-col space-y-2">
              <Label for="email">Email</Label>
              <Input
                type="text"
                id="email"
                placeholder="e.g. example@mail.com"
                aria-required="true"
                aria-describedby="credential-error"
                v-model="email"
              />
            </div>
            <div class="flex flex-col space-y-2">
              <Label for="password">Password</Label>
              <Input
                type="password"
                id="password"
                aria-required="true"
                aria-describedby="credential-error"
                v-model="password"
              />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col justify-center items-center gap-4 w-full">
        <Button variant="bold" @click="signin">Login</Button>
        <p class="hidden sm:flex justify-center text-center text-xs max-w-[245px] mt-3">
          Please contact the Database Administrator if you have forgotten your password
        </p>
      </CardFooter>
    </Card>
  </main>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logo from '@/assets/ss_logo.png'
import { ref } from 'vue'

import { signInWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/init.js'

const email = ref('')
const password = ref('')
const credentialError = ref('')

const router = useRouter()

const signin = () => {
  credentialError.value = ''

  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Firebase Login Successful!')
      router.push('/')
      console.log(auth.currentUser)
    })
    .catch((error) => {
      console.log(error.code)

      if (error.code == 'auth/invalid-email') {
        credentialError.value = 'Invalid email or password. Please try again.'
      }
      if (error.code == 'auth/missing-email') {
        credentialError.value = 'Please enter an email'
      }
      if (error.code == 'auth/missing-password') {
        credentialError.value = 'Please enter a password'
      }
      if (error.code == 'auth/invalid-credential') {
        credentialError.value = 'Invalid email or password. Please try again.'
      }
    })
}
</script>
