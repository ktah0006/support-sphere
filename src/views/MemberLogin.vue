<template>
  <main class="min-h-screen flex justify-center items-center">
    <Card class="w-[350px]">
      <CardHeader>
        <div class="flex justify-center">
          <img :src="logo" alt="SupportSphere logo" class="w-32" />
        </div>
        <CardTitle class="flex justify-center text-3xl text-[#6929FF]">Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <form>
          <div class="grid w-full gap-4">
            <div class="flex flex-col space-y-2">
              <Label for="email">Email</Label>
              <Input id="email" placeholder="e.g. example@mail.com" />
            </div>
            <div class="flex flex-col space-y-2">
              <Label for="password">Password</Label>
              <Input id="password" placeholder="" />
            </div>
          </div>
        </form>
      </CardContent>
      <CardFooter class="flex flex-col sm:flex-row justify-center items-center gap-4 w-full">
        <Button variant="outline"> Cancel </Button>
        <Button variant="bold">Login</Button>
      </CardFooter>
    </Card>
  </main>
</template>

<script setup>
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import logo from '@/assets/ss_logo.png'
</script>
