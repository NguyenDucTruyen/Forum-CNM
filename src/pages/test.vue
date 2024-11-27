<script setup lang="ts">
import { checkoutSession } from '@/api/stripe'

async function checkout() {
  const response = await checkoutSession()
  window.location.href = response.url
}
</script>

<template>
  <button @click="checkout">
    checkout
  </button>
</template>
