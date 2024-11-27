<script setup lang="ts">
import { useCategoryStore } from '@/stores/category'

const categoryStore = useCategoryStore()
</script>

<template>
  <div class="flex flex-col items-start gap-5">
    <div class="bg-muted rounded-lg flex flex-col items-start gap-2 w-72 p-2">
      <h2 class="text-foreground font-medium text-2xl p-2 leading-5">
        Categories
      </h2>
      <Separator class="w-full bg-muted-foreground" />
      <ScrollArea class="w-full overflow-auto custom-scroll mb-5 pr-4">
        <template v-if="categoryStore.categories">
          <template
            v-for="item in categoryStore.categories"
            :key="item._id"
          >
            <RouterLink
              :to="`/blogs/category/${item.slug}`"
              class="flex items-start gap-2 w-full rounded cursor-pointer hover:bg-secondary mb-3 p-2"
            >
              <Icon
                name="IconTag"
                class="object-contain text-primary h-8 w-8 flex justify-center items-center"
              />
              <div class="flex flex-col w-[calc(100%-2.5rem)] items-start gap-0.5">
                <span class="text-foreground font-medium text-sm leading-4">{{ item.name }}</span>
                <span class="text-foreground truncate font-normal w-full text-xs leading-[1.4]">{{ item.description }}</span>
              </div>
            </RouterLink>
          </template>
        </template>
      </ScrollArea>
    </div>
  </div>
</template>
