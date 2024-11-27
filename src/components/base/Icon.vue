<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
    validator: (value: string) => {
      return value.startsWith('Icon')
    },
  },
})
const component = defineAsyncComponent(() => import(`@/assets/icons/${props.name}.vue`))
</script>

<template>
  <component
    :is="component"
    role="img"
    class="inline-block fill-current m-0 p-0"
  />
</template>
