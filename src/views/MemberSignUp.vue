<template>
  <main class="min-h-screen flex justify-center items-center">
    <Card class="w-[350px]" role="region" aria-label="sign up form">
      <CardHeader>
        <div class="flex justify-center">
          <img :src="logo" alt="SupportSphere logo" class="w-32" />
        </div>
        <CardTitle class="hidden sm:flex justify-center text-3xl text-[#6929FF]"
          >Create Account</CardTitle
        >
        <CardDescription class="text-black hidden md:block text-center"
          >Become a Member and join community to connect, share, and grow together</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid w-full gap-4">
            <p v-if="nameError" class="text-red-700 text-sm">{{ nameError }}</p>
            <div class="flex flex-col space-y-2">
              <Label for="name">Full Name</Label>
              <Input type="text" id="name" placeholder="" v-model="username" required />
            </div>
            <p v-if="credentialError" class="text-red-700 text-sm">{{ credentialError }}</p>
            <div class="flex flex-col space-y-2">
              <Label for="email">Email</Label>
              <Input type="text" id="email" placeholder="e.g. example@mail.com" v-model="email" />
              <!-- </div>
            <div class="flex flex-col space-y-2"> -->
              <Label for="password">Password</Label>
              <Input type="password" id="password" placeholder="" v-model="password" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
        <!-- <Button variant="outline"> Cancel </Button> -->
        <Button variant="bold" @click="register">Create Account</Button>
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
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/init'

const email = ref('')
const password = ref('')
const username = ref('')
const credentialError = ref('')
const nameError = ref('')

const router = useRouter()

const register = () => {
  credentialError.value = ''
  nameError.value = ''

  if (!username.value.trim()) {
    nameError.value = 'Please enter a name'
    return
  }
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Firebase Register Successful!')
      router.push('/')
    })
    .catch((error) => {
      console.log(error.code)
      // alert(error.code)

      if (error.code == 'auth/invalid-email') {
        credentialError.value = 'Invalid email or password. Please try again.'
      }
      if (error.code == 'auth/missing-email') {
        credentialError.value = 'Please enter an email'
      }
      if (error.code == 'auth/missing-password') {
        credentialError.value = 'Please enter a password'
      }
      if (error.code == 'auth/weak-password') {
        credentialError.value = 'Minimum password length should be 6'
      }
      if (error.code == 'auth/invalid-credential') {
        credentialError.value = 'Invalid email or password. Please try again.'
      }
      if (error.code == 'auth/email-already-in-use') {
        credentialError.value = 'Email already registered.'
      }
    })
}
</script>
