<script setup lang="ts">
import type { BlogData, Reaction, UserData } from '@/types'

const props = defineProps<{
  value: BlogData
}>()
const like = computed(() => props.value.reaction?.filter((e: Reaction) => e.reaction === 'like').length)
const dislike = computed(() => props.value.reaction?.filter((e: Reaction) => e.reaction === 'dislike').length)
const formattedTime = computed(() => props.value.createdAt.split('T')[0])
</script>

<template>
  <div class="flex bg-card text-foreground gap-5 w-full p-5 mb-5 rounded-lg cursor-pointer shadow-lg">
    <img
      v-lazy="props.value.blogImage[0] ?? null"
      alt=""
      class="w-20 h-20 rounded-lg"
    >
    <div class="flex flex-col w-[calc(100%-100px)] justify-center h-24 gap-4">
      <div id="title" class="flex flex-col justify-between">
        <p class="font-medium truncate">
          {{ props.value.title }}
        </p>
        <p class="text-muted-foreground text-xs hidden sm:flex">
          Author: {{ props.value.userId.email }}
        </p>
      </div>

      <div class="flex flex-col gap-1 justify-between">
        <div class="flex gap-2 items-center">
          <span class="text-muted-foreground text-xs">
            Category:
          </span>
          <div class="bg-muted text-muted-foreground rounded-lg px-2 py-1 text-xs font-medium">
            {{ props.value.category?.name ?? 'Uncategorized' }}
          </div>
        </div>
        <div class="flex gap-5">
          <p class="text-muted-foreground text-xs">
            {{ like }} Likes
          </p>
          <p class="text-muted-foreground text-xs">
            {{ dislike }} Dislikes
          </p>
          <p class="text-muted-foreground text-xs hidden sm:flex">
            {{ formattedTime }}
          </p>
        </div>
      </div>
    </div>
  </div>
</template>
