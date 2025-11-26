<template>
  <div class="flex flex-col sm:flex-row gap-5 mt-20 mx-30">
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

  <Card class="flex mx-30 px-5 mt-5">
    <CardTitle>List of Users (Admins and Regular Members)</CardTitle>
    <div class="flex flex-col sm:flex-col md:flex-row md:items-center gap-2">
      <Label class="font-semibold">Sort: </Label>
      <Select v-model="userSortedby">
        <SelectTrigger class="bg-[#6929FF] text-white">
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest user"> Newest First </SelectItem>
          <SelectItem value="oldest user"> Oldest First </SelectItem>
          <SelectItem value="alphabetical (ascending)"> Name (Ascending) </SelectItem>
          <SelectItem value="alphabetical (descending)"> Name (Dessceding) </SelectItem>
        </SelectContent>
      </Select>
    </div>
    <Table>
      <TableHeader class="bg-white">
        <TableRow>
          <TableHead class="font-bold text-[#6929FF]"> Username </TableHead>
          <TableHead class="font-bold text-[#6929FF]">Email</TableHead>
          <TableHead class="font-bold text-[#6929FF]">Date Created</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        <!-- <TableRow class="bg-white" v-for="u in presentedUsers" :key="u.id"> -->
        <TableRow class="bg-white" v-for="u in userPaginatedList" :key="u.id">
          <TableCell>{{ u.fullName }}</TableCell>
          <TableCell>{{ u.email }}</TableCell>
          <TableCell>{{ new Date(u.createdAt.seconds * 1000).toLocaleDateString() }}</TableCell>
        </TableRow>
      </TableBody>
    </Table>

    <!-- adapted from ShadCN -->
    <Pagination
      v-model="activeUserPage"
      :items-per-page="10"
      :total="userPagesCount"
      :default-page="1"
    >
      <PaginationContent>
        <PaginationItem :value="Math.min(userPagesCount, activeUserPage - 1)" class="mr-6">
          <PaginationPrevious
            href="#"
            :disabled="false"
            @click.prevent="activeUserPage = Math.max(1, activeUserPage - 1)"
          />
        </PaginationItem>
        <PaginationItem v-for="p in userPagesCount" :key="p" :value="p">
          <!-- <PaginationItem :value="p" @click="activePage = p"> -->
          <Button
            variant="pagination"
            @click="activeUserPage = p"
            :aria-current="p === activeUserPage ? 'page' : undefined"
          >
            {{ p }}
          </Button>
          <!-- </PaginationItem> -->
        </PaginationItem>

        <PaginationItem :value="Math.min(userPagesCount, activeUserPage + 1)" class="ml-4">
          <PaginationNext
            href="#"
            :disabled="false"
            @click.prevent="activeUserPage = Math.min(userPagesCount, activeUserPage + 1)"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </Card>
</template>

<script setup>
import { Card, CardFooter } from '@/components/ui/card'
import { db } from '../firebase/init.js'
import { getDoc, doc, getDocs, collection } from 'firebase/firestore'
import { ref, onMounted, computed, watch } from 'vue'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import CardTitle from '@/components/ui/card/CardTitle.vue'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Button } from '@/components/ui/button'

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

const userSortedby = ref('newest user')
const presentedUsers = computed(() => {
  let presentUsersLists = [...usersList.value]

  if (userSortedby.value === 'newest user') {
    presentUsersLists.sort(
      (user1, user2) => user2.createdAt?.toMillis() - user1.createdAt?.toMillis(),
    )
  } else if (userSortedby.value === 'oldest user') {
    presentUsersLists.sort(
      (user1, user2) => user1.createdAt?.toMillis() - user2.createdAt?.toMillis(),
    )
  } else if (userSortedby.value === 'alphabetical (ascending)') {
    presentUsersLists.sort((user1, user2) => user1.fullName.localeCompare(user2.fullName))
  } else if (userSortedby.value === 'alphabetical (descending)') {
    presentUsersLists.sort((user1, user2) => user2.fullName.localeCompare(user1.fullName))
  }

  return presentUsersLists
})

const activeUserPage = ref(1)
const userPagesCount = computed(() => Math.ceil(presentedUsers.value.length / 10))
const userPaginatedList = computed(() => {
  const start = (activeUserPage.value - 1) * 10
  // const activePosts = allPosts.value.slice(start, start + 10)
  const activePosts = presentedUsers.value.slice(start, start + 10)
  return activePosts
})

// reset page to one whenever user changes filter or sorting preferences
const updateListWatcher = computed(() => ({
  selectedSort: userSortedby.value,
}))
watch(updateListWatcher, () => {
  activeUserPage.value = 1
})
</script>
