<script setup lang="ts">
import { getDetailSession } from '@/api/stripe'
import { toast } from '@/components/ui/toast'
import { useUserStore } from '@/stores/user'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const sessionId = route.query.sessionId as string

onMounted(async () => {
  try {
    const response = await getDetailSession(sessionId)
    toast({
      title: 'Success',
      description: response.message,
    })
    userStore.setUser(response.data)
  }
  catch (error: Error | any) {
    const data = error?.response?.data
    const errorMessage = data?.error || data?.message || 'Some thing went wrong'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
      duration: 5000,
    })
  }
  finally {
    router.push(`/profile/${userStore.user?.id}/plans`)
  }
})
</script>

<template>
  <div>
    <h1 class="text-center">
      Checking your information...
    </h1>
    <div class="flex w-full justify-center items-center">
      <Icon name="IconLoading" />
    </div>
  </div>
</template>
