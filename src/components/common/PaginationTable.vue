<script setup lang="ts">
import {
  Button,
} from '@/components/ui/button'
import {
  Pagination,
  PaginationEllipsis,
  PaginationFirst,
  PaginationLast,
  PaginationList,
  PaginationListItem,
  PaginationNext,
  PaginationPrev,
} from '@/components/ui/pagination'

import { ref, watch } from 'vue'

interface Props {
  total: number
  currentPage: number
  itemsPerPage: number
}
const props = defineProps<Props>()
const router = useRouter()
const currentPage = ref(props.currentPage)

function handlePageChange(newPage: number) {
  currentPage.value = newPage
  router.push({ query: { page: newPage } })
}
</script>

<template>
  <Pagination
    v-slot="{ page }"
    :total="props.total"
    :sibling-count="1"
    :items-per-page="props.itemsPerPage"
    show-edges
    :default-page="props.currentPage"
    @update:page="handlePageChange"
  >
    <PaginationList v-slot="{ items }" class="flex items-center gap-1 justify-center p-4">
      <PaginationFirst />
      <PaginationPrev />

      <template v-for="(item, index) in items" :key="index">
        <PaginationListItem
          v-if="item.type === 'page'"
          :value="item.value"
          as-child
        >
          <Button
            class="w-10 h-10 p-0"
            :variant="item.value === page ? 'default' : 'outline'"
          >
            {{ item.value }}
          </Button>
        </PaginationListItem>
        <PaginationEllipsis v-else :index="index" />
      </template>

      <PaginationNext />
      <PaginationLast />
    </PaginationList>
  </Pagination>
</template>
