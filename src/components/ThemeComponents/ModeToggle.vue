<script setup lang="ts">
import type { ThemeType } from '@/types/theme-type'
import { Button } from '@/components/ui/button'
import { useThemeStore } from '@/stores/theme'

const themeStore = useThemeStore()
function setTheme(theme: ThemeType) {
  themeStore.setTheme(theme)
}
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger as-child>
      <Button variant="outline">
        {{ themeStore.theme === 'dark' ? 'Dark' : 'Light' }}
        <span class="sr-only">Toggle theme</span>
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem @click="setTheme('light')">
        Light
      </DropdownMenuItem>
      <DropdownMenuItem @click="setTheme('dark')">
        Dark
      </DropdownMenuItem>
      <DropdownMenuItem @click="setTheme('system')">
        System
      </DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</template>
