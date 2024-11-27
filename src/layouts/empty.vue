<script setup>
const inputSearch = useTemplateRef('input-search')
const searchValue = ref('')
const route = useRoute()
onMounted(() => {
  if (route.query.q) {
    searchValue.value = route.query.q
  }
  if (Object.keys(route.query).includes('q'))
    inputSearch.value.focus()
})
</script>

<template>
  <div class="flex flex-col h-full bg-background justify-between">
    <div class="flex flex-col items-center gap-4 h-full w-full">
      <header class="flex w-full h-20 items-center">
        <AppHeader />
      </header>
      <ScrollArea class="w-full h-[calc(100%-6.5rem)]">
        <div class="flex justify-center gap-8  pb-6">
          <div class="flex flex-col gap-4 h-full rounded-xl max-w-4xl flex-1 overflow-auto">
            <Suspense>
              <router-view />
              <template #fallback>
                <div class="flex w-full p-8 justify-center items-center">
                  <Icon name="IconLoading" />
                </div>
              </template>
            </Suspense>
          </div>
        </div>
        <AppFooter />
      </ScrollArea>
    </div>
  </div>
</template>
