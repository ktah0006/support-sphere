<template>
  <div class="flex flex-col gap-4 mt-20 px-10">
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
        <Button class="text-[#6929FF] p-1" variant="link" @click="expandPost(post.id)">
          {{ expandedPost === post.id ? 'Read Less' : 'Read More' }}
        </Button>
      </CardContent>

      <CardFooter class="flex justify-between text-gray-600 text-sm mt-3 p-1">
        <div class="flex gap-3">
          <Popover class="p-8">
            <PopoverTrigger as-child>
              <Button variant="rate">Rate?</Button>
            </PopoverTrigger>
            <PopoverContent>
              <h4 class="flex justify-center font-medium mb-3">
                How helpful did you find this post?
              </h4>
              <RadioGroup default-value="1" class="flex space-x-4 justify-center">
                <div class="flex items-center space-x-1">
                  <RadioGroupItem id="r1" value="1" />
                  <Label for="r1">1</Label>
                </div>
                <div class="flex items-center space-x-1">
                  <RadioGroupItem id="r2" value="2" />
                  <Label for="r2">2</Label>
                </div>
                <div class="flex items-center space-x-1">
                  <RadioGroupItem id="r3" value="3" />
                  <Label for="r3">3</Label>
                </div>
                <div class="flex items-center space-x-1">
                  <RadioGroupItem id="r4" value="4" />
                  <Label for="r4">4</Label>
                </div>
                <div class="flex items-center space-x-1">
                  <RadioGroupItem id="r5" value="5" />
                  <Label for="r5">5</Label>
                </div>
              </RadioGroup>
            </PopoverContent>
          </Popover>
        </div>
        <div class="flex gap-3">
          <Badge variant="categoryLabel"> {{ post.category }} </Badge>
          {{ post.author }} &bull; {{ post.datetime?.toDate().toLocaleDateString() }}
        </div>
      </CardFooter>
    </Card>

    <!-- Modal only shows when a post is active -->
    <!-- <SinglePost v-if="currentPost" :post="currentPost" @close="currentPost = null" /> -->
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { db } from '../firebase/init.js'
import { collection, getDocs } from 'firebase/firestore'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Button from '@/components/ui/button/Button.vue'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Label } from '@/components/ui/label'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'

const allPosts = ref([])

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
  const allPostsRef = collection(db, 'Feed')
  const allPostsSnapshot = await getDocs(allPostsRef)

  allPosts.value = allPostsSnapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }))
})
</script>
