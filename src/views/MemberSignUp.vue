<template>
  <main class="min-h-screen flex justify-center items-center">
    <Card class="w-[350px]">
      <CardHeader>
        <div class="flex justify-center">
          <img :src="logo" alt="SupportSphere logo" class="w-32" />
        </div>
        <CardTitle class="flex justify-center text-3xl text-[#6929FF]">Create Account</CardTitle>
        <CardDescription class="text-black hidden md:block text-center"
          >Become a Member and join community to connect, share, and grow together</CardDescription
        >
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid w-full gap-4">
            <div class="flex flex-col space-y-2">
              <Label for="name">Full Name</Label>
              <Input type="text" id="name" placeholder="" />
            </div>
            <div class="flex flex-col space-y-2">
              <Label for="email">Email</Label>
              <Input type="text" id="email" placeholder="e.g. example@mail.com" v-model="email" />
            </div>
            <div class="flex flex-col space-y-2">
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
// import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth'
import { createUserWithEmailAndPassword } from 'firebase/auth'
import { useRouter } from 'vue-router'
import { auth } from '@/firebase/init'

const email = ref('')
const password = ref('')
const router = useRouter()
// const auth = getAuth()
const register = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      console.log('Firebase Register Successful!')
      router.push('/member-login')
    })
    .catch((error) => {
      console.log(error.code)
      alert(error.code)
    })
}
</script>
