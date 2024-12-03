<route>
  {
    meta: {
      layout: 'profile',
      title: 'Billings & Plans'
    }
  }
</route>

<script setup lang="ts">
import { checkoutSession } from '@/api/stripe'
import { useUserStore } from '@/stores/user'

const userStore = useUserStore()
const isLoading = ref(false)
async function checkout() {
  isLoading.value = true
  const response = await checkoutSession()
  isLoading.value = false
  window.location.href = response.url
}
</script>

<template>
  <div class="flex flex-col  max-w-4xl m-auto border p-8 rounded-lg">
    <div class="flex flex-col">
      <h1 class="text-2xl font-semibold text-center">
        Billings & Plans
      </h1>
      <span class="text-sm max-w-2xl text-center mt-2 mb-8">Choose the best plan to fit your needs. All plans include its own feature or advance tools and features to boost your expirement</span>
    </div>
    <div class="grid grid-cols-1 sm:grid-cols-2 gap-2">
      <div class="flex justify-center p-4 rounded-lg border-input border flex-col max-w-72 bg-background mx-auto w-full">
        <h2 class="text-xl font-medium text-center">
          Basic
        </h2>
        <Button class="my-2" disabled>
          {{ userStore.user?.upgrade_at ? 'Using Premium' : 'Current' }}
        </Button>
        <div class="flex flex-col">
          <div class="text-sm font-semibold">
            Package Includes
          </div>
          <span class="my-1"><Icon name="IconCheck" class="text-primary w-10" />Basic action</span>
          <span class="my-1"><Icon name="IconCheck" class="text-primary w-10" />Limit of 5 posts</span>
          <span class="my-1"><Icon name="IconCheck" class="text-primary w-10" />Lower Priority</span>
        </div>
      </div>

      <div class="flex justify-center p-4 rounded-lg border-input border flex-col max-w-72 bg-background mx-auto w-full">
        <h2 class="text-xl font-medium text-center relative">
          Premium
          <Icon name="IconCrown" class="text-primary absolute top-0 rotate-12" />
        </h2>
        <Button
          class="my-2"
          :disabled="userStore.user?.upgrade_at || isLoading"
          @click="checkout"
        >
          <template v-if="isLoading">
            <Icon name="IconLoading" />
            Please wait
          </template>
          <template v-else>
            {{ userStore.user?.upgrade_at ? 'Current' : 'Upgrade' }}
          </template>
        </Button>
        <div class="flex flex-col">
          <div class="text-sm font-semibold">
            Package Includes
          </div>
          <span class="my-1"><Icon name="IconCheck" class="text-primary w-10" />Chat with AI assistant</span>
          <span class="my-1"><Icon name="IconCheck" class="text-primary w-10" />Unlimited posts</span>
          <span class="my-1"><Icon name="IconCheck" class="text-primary w-10" />Higher Priority</span>
        </div>
      </div>
    </div>
  </div>
</template>
