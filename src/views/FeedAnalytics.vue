<template>
  <div class="flex gap-5 mt-20 px-10">
    <Card class="w-60 flex px-4">
      <div class="flex flex-col ml-2 py-0 gap-2">
        <p class="font-medium text-xl">Total Users</p>
        <p class="text-4xl font-medium text-[#6929FF]">
          {{ totalUsers }}
        </p>
        <CardFooter class="pl-0 text-sm">Regular Members </CardFooter>
      </div>
    </Card>
    <Card class="w-60 flex px-4">
      <div class="flex flex-col ml-2 py-0 gap-2">
        <p class="font-medium text-xl">Total Posts</p>
        <p class="text-4xl font-medium text-[#6929FF]">
          {{ totalPosts }}
        </p>
        <CardFooter class="pl-0 text-sm">Posts on Support Sphere</CardFooter>
      </div>
    </Card>
  </div>

  <Card class="flex mx-10 px-5">
    <CardTitle>List of Users (Admins and Regular Members)</CardTitle>
    <Table>
      <TableHeader class="bg-white">
        <TableRow>
          <TableHead class="font-bold"> Username </TableHead>
          <TableHead class="font-bold">Email</TableHead>
          <TableHead class="font-bold">Date Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <TableRow class="bg-white" v-for="u in usersList" :key="u.id">
          <TableCell>{{ u.fullName }}</TableCell>
          <TableCell>{{ u.email }}</TableCell>
          <TableCell>{{ new Date(u.createdAt.seconds * 1000).toLocaleDateString() }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>
  </Card>
</template>

<script setup>
import { Card, CardFooter } from '@/components/ui/card'
import { db } from '../firebase/init.js'
import { getDoc, doc, getDocs, collection } from 'firebase/firestore'
import { ref, onMounted } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CardTitle from '@/components/ui/card/CardTitle.vue'

const totalPosts = ref(null)
const totalUsers = ref(null)
const usersList = ref([])
onMounted(async () => {
  const postStatsRef = doc(db, 'AdminStats', 'postStats')
  const postStatSnap = await getDoc(postStatsRef)

  if (postStatSnap.exists()) {
    // console.log('total posts: ', postStatSnap.data().totalPosts)
    totalPosts.value = postStatSnap.data().totalPosts
  }

  const userStatsRef = doc(db, 'AdminStats', 'userStats')
  const userStatSnap = await getDoc(userStatsRef)
  if (userStatSnap.exists()) {
    totalUsers.value = userStatSnap.data().totalUsers
  }

  const userListRef = collection(db, 'Users')
  const userListSnap = await getDocs(userListRef)
  usersList.value = userListSnap.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
})
</script>
