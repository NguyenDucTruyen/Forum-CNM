<script setup>
</script>

<template>
  <div class="flex flex-col h-full bg-background justify-between">
    <div class="flex flex-col items-center gap-4 h-full w-full">
      <header class="flex w-full h-20 items-center">
        <AppHeader />
      </header>
      <div class="w-full h-[calc(100%-6rem)] flex flex-col justify-between overflow-auto custom-scroll container-default">
        <div class="flex justify-center gap-8 w-[calc(100%-4rem)] pb-6 mx-auto">
          <AppSideBar class="max-lg:hidden" />
          <div class="flex flex-col gap-4 h-full rounded-xl max-w-4xl flex-1">
            <Suspense>
              <router-view />
              <template #fallback>
                <div class="flex w-full p-8 justify-center items-center">
                  <Icon name="IconLoading" />
                </div>
              </template>
            </Suspense>
          </div>
          <TabRight class="max-lg:hidden" />
        </div>
        <AppFooter />
      </div>
    </div>
  </div>
</template>
