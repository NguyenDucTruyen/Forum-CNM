<script setup lang="ts">
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const router = useRouter()
router.push(`/profile/${userStore.user?.id}/plans`)
</script>

<template>
  Cancel purchase
</template>
