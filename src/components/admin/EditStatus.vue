<script lang="ts" setup>
import type { UserData } from '@/types'
import { X } from 'lucide-vue-next'

interface EmitType {
  (event: 'save', id: string, status: string): void
  (event: 'cancel'): void
}
const props = defineProps<{
  user: UserData
}>()
const emit = defineEmits<EmitType>()
const selectedStatus = ref<string>(props.user.isActive.toUpperCase())
onMounted(() => {
  selectedStatus.value = props.user.isActive.toUpperCase()
})

async function save() {
  emit('save', props.user._id, selectedStatus.value.toLowerCase())
}

function cancel() {
  emit('cancel')
}
</script>

<template>
  <div class="main" @click="cancel">
    <div
      class="container bg-background relative p-8 py-12 rounded border"
      @click.stop
    >
      <h1
        class="font-medium text-3xl"
      >
        Edit Status
      </h1>
      <X class="w-4 h-4 absolute right-8 top-8 cursor-pointer" />
      <form>
        <div class="flex justify-center w-full">
          <div class="w-full">
            <div class="form">
              <div class="w-full flex flex-col text-foreground items-center">
                <select
                  v-model="selectedStatus"
                  class="p-2 rounded-sm bg-background text-foreground cursor-pointer border border-primary"
                >
                  <option value="ACTIVE">
                    Active
                  </option>
                  <option value="BANNER">
                    Banner
                  </option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div class="button-group space-x-4 mt-8">
          <Button
            variant="outline"
            @click="cancel"
          >
            Cancel
          </Button>
          <Button
            @click="save"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.main {
  position: fixed;
  inset: 0;
  background: rgba(71, 79, 98, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;
}

.container {
  max-width: 600px;

  h1 {
    margin-bottom: 40px;
    text-align: center;
  }
}

.button-group {
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
}
select option:hover {
  @apply bg-primary text-white;
}
</style>
