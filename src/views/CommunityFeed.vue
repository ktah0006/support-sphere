<template>
  <div class="flex flex-col gap-4 mt-20 px-10 pb-8">
    <CreatePost />
    <!-- <Card
      v-for="post in allPosts"
      :key="post.id"
      class="relative inline-block w-full rounded-lg bg-white p-6"
      role="region"
      aria-label="single post"
    > -->
    <div class="flex flex-col sm:flex-col md:flex-row gap-4 px-2">
      <div class="flex flex-col sm:flex-col md:flex-row md:items-center gap-2">
        <Label class="font-semibold">Sort: </Label>
        <Select v-model="sortedby">
          <SelectTrigger class="bg-[#6929FF] text-white">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="recent"> Newest First </SelectItem>
            <SelectItem value="oldest"> Oldest First </SelectItem>
            <SelectItem value="rated most helpful"> Most Helpful </SelectItem>
            <SelectItem value="rated least helpful"> Least Helpful </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div class="flex flex-col sm:flex-col md:flex-row md:items-center gap-2">
        <Label class="font-semibold">Category: </Label>
        <Select v-model="filterCategory">
          <SelectTrigger class="bg-[#6929FF] text-white">
            <SelectValue placeholder="Filter by Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All"> All </SelectItem>
            <SelectItem value="General"> General </SelectItem>
            <SelectItem value="Mental Health"> Mental Health </SelectItem>
            <SelectItem value="Career Growth"> Career Growth </SelectItem>
            <SelectItem value="Life Hacks"> Life Hacks </SelectItem>
            <SelectItem value="Social"> Social </SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>

    <Card
      v-for="post in paginatedList"
      :key="post.id"
      class="relative inline-block w-full rounded-lg bg-white p-6"
      role="region"
      aria-label="single post"
    >
      <CardHeader class="flex items-center justify-start p-1 space-x-3">
        <CardTitle class="text-lg">{{ post.title }}</CardTitle>
        <Badge class="text-[#6929FF] border border-[#6929FF] px-3 bg-purple-50">
          Rating: {{ post.rating }}
        </Badge>

        <Button
          v-if="deletionAllowed(post)"
          @click="deletePost(post)"
          class="absolute top-2 right-4 bg-white hover:bg-transparent text-xs py-3 px-2 mt-2 mr-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M3 6H5M5 6H21M5 6V20C5 20.5304 5.21071 21.0391 5.58579 21.4142C5.96086 21.7893 6.46957 22 7 22H17C17.5304 22 18.0391 21.7893 18.4142 21.4142C18.7893 21.0391 19 20.5304 19 20V6M8 6V4C8 3.46957 8.21071 2.96086 8.58579 2.58579C8.96086 2.21071 9.46957 2 10 2H14C14.5304 2 15.0391 2.21071 15.4142 2.58579C15.7893 2.96086 16 3.46957 16 4V6M10 11V17M14 11V17"
              stroke="#1E1E1E"
              stroke-width="2.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </Button>
      </CardHeader>
      <CardContent class="p-1 gap-1">
        <p :class="expandedPost === post.id ? '' : 'line-clamp-1'">{{ post.content }}</p>
        <Button class="text-[#6929FF] p-0" variant="link" @click="expandPost(post.id)">
          {{ expandedPost === post.id ? 'Read Less' : 'Read More' }}
        </Button>
      </CardContent>

      <CardFooter class="flex justify-between text-gray-600 text-sm mt-3 p-1">
        <div class="flex gap-3">
          <!-- <Button variant="rate">Rate?</Button> -->
          <Toggle
            variant="outline"
            class="px-4 py-4"
            :model-value="currentUserMarkedPost(post)"
            @click="toggleHelpful(post.id)"
            aria-label="Rate Helpful"
          >
            Helpful
          </Toggle>
        </div>
        <div class="flex gap-3">
          <Badge variant="categoryLabel"> {{ post.category }} </Badge>
          {{ post.author }} &bull; {{ post.datetime?.toDate().toLocaleDateString() }}
        </div>
      </CardFooter>
    </Card>

    <!-- adapted from ShadCN -->
    <Pagination v-model="activePage" :items-per-page="10" :total="pagesCount" :default-page="1">
      <PaginationContent>
        <PaginationItem :value="Math.min(pagesCount, activePage - 1)" class="mr-6">
          <PaginationPrevious
            href="#"
            :disabled="false"
            @click.prevent="activePage = Math.max(1, activePage - 1)"
          />
        </PaginationItem>
        <PaginationItem v-for="p in pagesCount" :key="p" :value="p">
          <!-- <PaginationItem :value="p" @click="activePage = p"> -->
          <Button
            variant="pagination"
            @click="activePage = p"
            :aria-current="p === activePage ? 'page' : undefined"
          >
            {{ p }}
          </Button>
          <!-- </PaginationItem> -->
        </PaginationItem>

        <PaginationItem :value="Math.min(pagesCount, activePage + 1)" class="ml-4">
          <PaginationNext
            href="#"
            :disabled="false"
            @click.prevent="activePage = Math.min(pagesCount, activePage + 1)"
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { db } from '../firebase/init.js'
import {
  collection,
  increment,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
  deleteDoc,
} from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/button/Button.vue'
import { Toggle } from '@/components/ui/toggle'
import { userStore } from '../store/store.js'
import CreatePost from './CreatePost.vue'
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Label } from '@/components/ui/label'

const allPosts = ref([])
const store = userStore()
const currentUserId = computed(() => store.userState?.uid)

const deletionAllowed = (post) => {
  const userIsAdmin = store.isAdmin
  const userOwnsPost = post.authorId === currentUserId.value
  return userIsAdmin || userOwnsPost
}

const deletePost = async (post) => {
  if (!post?.id) return
  try {
    const postRef = doc(db, 'Feed', post.id)
    await deleteDoc(postRef)
    console.log('post deleted successfully: ', post.id)
  } catch (e) {
    console.error('Error deleting notice: ', e)
  }
}

const currentUserMarkedPost = (p) => {
  // console.log('currentUserMarkedPost: ', p.usersMarkedBy?.includes(currentUserId.value))
  return p.usersMarkedBy?.includes(currentUserId.value) || false
}

const toggleHelpful = async (postId) => {
  const post = allPosts.value.find((p) => p.id === postId)
  const postIsMarkedByUser = post.usersMarkedBy?.includes(currentUserId.value)
  const singlePostRef = doc(db, 'Feed', postId)

  if (!postIsMarkedByUser) {
    await updateDoc(singlePostRef, {
      usersMarkedBy: arrayUnion(currentUserId.value),
      rating: increment(1),
    })
    post.rating += 1
    post.usersMarkedBy.push(currentUserId.value)
  } else {
    await updateDoc(singlePostRef, {
      usersMarkedBy: arrayRemove(currentUserId.value),
      rating: increment(-1),
    })
    post.rating -= 1
    post.usersMarkedBy = post.usersMarkedBy.filter((id) => id !== currentUserId.value)
  }
  console.log('Updating post:', postId, 'with rating:', post.rating)
}

const expandedPost = ref(null)
const expandPost = (postId) => {
  if (expandedPost.value === postId) {
    // collapse the expanded post
    expandedPost.value = null
  } else {
    // expand the collapsed post
    expandedPost.value = postId
  }
}

onMounted(async () => {
  // fetch all posts from database
  const allPostsRef = collection(db, 'Feed')

  onSnapshot(allPostsRef, (allPostsSnapshot) => {
    allPosts.value = allPostsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  })
})

const activePage = ref(1)
const pagesCount = computed(() => Math.ceil(presentedPosts.value.length / 10))
const paginatedList = computed(() => {
  const start = (activePage.value - 1) * 10
  // const activePosts = allPosts.value.slice(start, start + 10)
  const activePosts = presentedPosts.value.slice(start, start + 10)
  return activePosts
})

// sorting and filtering
const sortedby = ref('recent')
const filterCategory = ref('All')

// reset page to one whenever user changes filter or sorting preferences
const updateListWatcher = computed(() => ({
  selectedFilter: filterCategory.value,
  selectedSort: sortedby.value,
}))
watch(updateListWatcher, () => {
  activePage.value = 1
})

// determine which posts and order in which they are displayed
const presentedPosts = computed(() => {
  let allPostList = [...allPosts.value]

  if (filterCategory.value !== 'All') {
    allPostList = allPostList.filter((p) => p.category === filterCategory.value)
  }

  if (sortedby.value === 'recent') {
    allPostList.sort((post1, post2) => post2.datetime?.toMillis() - post1.datetime?.toMillis())
  } else if (sortedby.value === 'oldest') {
    allPostList.sort((post1, post2) => post1.datetime?.toMillis() - post2.datetime?.toMillis())
  } else if (sortedby.value === 'rated most helpful') {
    allPostList.sort((post1, post2) => post2.rating - post1.rating)
  } else if (sortedby.value === 'rated least helpful') {
    allPostList.sort((post1, post2) => post1.rating - post2.rating)
  }

  return allPostList
})
</script>
