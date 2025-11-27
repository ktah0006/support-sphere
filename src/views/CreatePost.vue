<template>
  <main>
    <div class="flex justify-end w-full">
      <Dialog v-model:open="postModalOpen">
        <DialogTrigger as-child>
          <Button
            variant="bold"
            aria-label="Create new post"
            class="px-5 py-5 flex items-center gap-2"
          >
            <!-- svg taken from figma -->
            <svg
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="23"
              height="23"
              viewBox="0 0 23 23"
              fill="none"
            >
              <path
                d="M10.25 3.37132H3.25C2.71957 3.37132 2.21086 3.58203 1.83579 3.95711C1.46071 4.33218 1.25 4.84089 1.25 5.37132V19.3713C1.25 19.9018 1.46071 20.4105 1.83579 20.7855C2.21086 21.1606 2.71957 21.3713 3.25 21.3713H17.25C17.7804 21.3713 18.2891 21.1606 18.6642 20.7855C19.0393 20.4105 19.25 19.9018 19.25 19.3713V12.3713M17.75 1.87132C18.1478 1.4735 18.6874 1.25 19.25 1.25C19.8126 1.25 20.3522 1.4735 20.75 1.87132C21.1478 2.26915 21.3713 2.80871 21.3713 3.37132C21.3713 3.93393 21.1478 4.4735 20.75 4.87132L11.25 14.3713L7.25 15.3713L8.25 11.3713L17.75 1.87132Z"
                stroke="white"
                stroke-width="2.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            Create New Post
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px] bg-[#efeaf8]" role="dialog">
          <form @submit.prevent="submitPost">
            <DialogHeader>
              <DialogTitle class="flex justify-center text-2xl">Create New Post</DialogTitle>
              <DialogDescription> </DialogDescription>
            </DialogHeader>
            <div class="grid gap-4">
              <div class="grid gap-3">
                <Label class="text-md">Post Title</Label>
                <Input
                  class="border border-black"
                  aria-required="true"
                  v-model="postTitle"
                  @blur="titleValidation"
                />
                <p v-if="titleErrorMessage" role="alert" class="text-red-700 text-sm">
                  {{ titleErrorMessage }}
                </p>
              </div>
              <!-- Taken from ShadCN -->
              <Label class="text-md">Category</Label>
              <Popover v-model:open="catListOpen">
                <PopoverTrigger as-child>
                  <Button
                    variant="outline"
                    role="combobox"
                    :aria-expanded="catListOpen"
                    class="w-[200px] justify-between border border-black"
                  >
                    {{
                      categoryValue
                        ? categories.find((framework) => framework.value === categoryValue)?.label
                        : 'Select Category...'
                    }}
                    <ChevronsUpDownIcon class="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent class="w-[200px] p-0" role="combobox">
                  <Command>
                    <CommandList>
                      <CommandEmpty>No Categories found.</CommandEmpty>
                      <CommandGroup>
                        <CommandItem
                          v-for="cat in categories"
                          :key="cat.value"
                          :value="cat.value"
                          @select="
                            () => {
                              categoryValue = categoryValue === cat.value ? '' : cat.value
                              catListOpen = false
                            }
                          "
                        >
                          <CheckIcon
                            :class="
                              cn(
                                'mr-2 h-4 w-4',
                                categoryValue === cat.value ? 'opacity-100' : 'opacity-0',
                              )
                            "
                          />
                          {{ cat.label }}
                        </CommandItem>
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <div class="grid gap-3">
                <Label class="text-md">Body</Label>
                <Textarea
                  class="border border-black"
                  placeholder="Type your message here..."
                  v-model="postBody"
                  @blur="bodyValidation"
                  aria-required="true"
                  role="alert"
                />
                <p v-if="bodyErrorMessage" class="text-red-700 text-sm">{{ bodyErrorMessage }}</p>
              </div>
            </div>

            <DialogFooter class="mt-6">
              <DialogClose as-child>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" variant="bold">Post</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  </main>
</template>

<script setup>
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { ref, computed } from 'vue'
import { db } from '../firebase/init.js'
import { collection, addDoc, Timestamp, increment, doc, updateDoc } from 'firebase/firestore'
import { userStore } from '../store/store.js'
import { CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import DOMPurify from 'dompurify'

const categories = [
  { value: 'General', label: 'General' },
  // { value: 'Ask the Community', label: 'Ask the Community' },
  { value: 'Mental Health', label: 'Mental Health' },
  { value: 'Career Growth', label: 'Career Growth' },
  { value: 'Life Hacks', label: 'Life Hacks' },
  { value: 'Social', label: 'Social' },
]
const catListOpen = ref(false)
const categoryValue = ref('')

const currentUser = userStore()

const postTitle = ref('')
const postBody = ref('')
const postModalOpen = ref(false)

const titleErrorMessage = ref('')
const bodyErrorMessage = ref('')
const titleValidation = () => {
  if (!postTitle.value) {
    titleErrorMessage.value = 'Please enter a title'
  } else if (postTitle.value.trim().length > 50) {
    titleErrorMessage.value = 'Title should be shorter than 50 characters'
  } else {
    titleErrorMessage.value = ''
  }
}
const bodyValidation = () => {
  if (!postBody.value || postBody.value.trim().length < 10) {
    bodyErrorMessage.value = 'Message should be longer than 10 characters'
  } else if (postBody.value.trim().length > 500) {
    bodyErrorMessage.value = 'Message should be shorter than 500 characters'
  } else {
    bodyErrorMessage.value = ''
  }
}

const errorExists = computed(() => {
  return titleErrorMessage.value || bodyErrorMessage.value
})

const submitPost = async () => {
  // prevent submission if error exists
  titleValidation()
  bodyValidation()
  if (errorExists.value) return

  try {
    const allPostsRef = collection(db, 'Feed')

    const safeTitle = DOMPurify.sanitize(postTitle.value)
    const safeBody = DOMPurify.sanitize(postBody.value)

    // create new post
    await addDoc(allPostsRef, {
      author: currentUser.name || '-',
      authorId: currentUser.userState.uid,
      category: categoryValue.value || 'General',
      // content: postBody.value,
      content: safeBody,
      datetime: Timestamp.now(),
      rating: 0,
      // title: postTitle.value,
      title: safeTitle,
      usersMarkedBy: [],
    })
    console.log('currentUser.name: ', currentUser.name)
    console.log('Notice Saved by ', currentUser.userState.uid)

    // update admin statistics
    const adminStatsRef = doc(db, 'AdminStats', 'postStats')
    await updateDoc(adminStatsRef, {
      totalPosts: increment(1),
    })
  } catch (error) {
    console.error('Could not write to database: ', error)
  } finally {
    categoryValue.value = ''
    postTitle.value = ''
    postBody.value = ''
  }
  postModalOpen.value = false
}
</script>
