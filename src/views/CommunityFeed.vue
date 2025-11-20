<template>
  <div class="flex flex-col gap-4 mt-20 px-10 pb-8">
    <CreatePost />
    <Card
      v-for="post in allPosts"
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { db } from '../firebase/init.js'
import {
  collection,
  increment,
  updateDoc,
  doc,
  arrayUnion,
  arrayRemove,
  onSnapshot,
} from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/button/Button.vue'
import { Toggle } from '@/components/ui/toggle'
import { userStore } from '../store/store.js'
import CreatePost from './CreatePost.vue'

const allPosts = ref([])
const store = userStore()
const currentUserId = computed(() => store.userState?.uid)

const currentUserMarkedPost = (p) => {
  console.log('currentUserMarkedPost: ', p.usersMarkedBy?.includes(currentUserId.value))
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
  //  const allPostsSnapshot = await getDocs(allPostsRef)

  onSnapshot(allPostsRef, (allPostsSnapshot) => {
    allPosts.value = allPostsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }))
  })
})
</script>
