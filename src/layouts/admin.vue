<script setup>
</script>

<template>
  <div class="flex flex-col h-full bg-background justify-between">
    <div class="flex flex-col items-center gap-4 h-full w-full">
      <header class="flex w-full h-20 items-center">
        <AppHeader />
      </header>
      <ScrollArea class="w-full h-[calc(100%-6rem)]">
        <div class="w-full h-full flex flex-col justify-between overflow-auto custom-scroll container-default">
          <div class="grid grid-cols-1 lg:grid-cols-4 gap-8 w-[calc(100%-4rem)] pb-6 mx-auto">
            <div class="flex col-span-1 justify-center">
              <AppSideBarAdmin />
            </div>
            <div class="flex col-span-1 lg:col-span-3">
              <div class="flex flex-col gap-4 h-full rounded-xl flex-1">
                <Suspense>
                  <router-view :key="$route.fullPath"/>
                  <template #fallback>
                    <div class="flex w-full p-8 justify-center items-center">
                      <Icon name="IconLoading" />
                    </div>
                  </template>
                </Suspense>
              </div>
            </div>
          </div>
          <AppFooter />
        </div>
      </ScrollArea>
    </div>
  </div>
</template>
