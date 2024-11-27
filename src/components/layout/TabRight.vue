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
            :key="item.id"
          >
            <RouterLink
              :to="`/blogs/category/${item.id}`"
              class="flex items-center gap-2 w-full rounded cursor-pointer hover:bg-secondary mb-3 p-2"
            >
              <Icon
                name="IconTag"
                class="object-contain text-primary h-6 w-6 flex justify-center items-center"
              />
              <div class="flex w-[calc(100%-2.5rem)] items-center gap-0.5">
                {{ item.categoryName }}
              </div>
            </RouterLink>
          </template>
        </template>
      </ScrollArea>
    </div>
  </div>
</template>
