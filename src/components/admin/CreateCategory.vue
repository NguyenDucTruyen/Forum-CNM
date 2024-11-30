<script lang="ts" setup>
import type { Category, RequestCreateCategory } from '@/types'
import { toTypedSchema } from '@vee-validate/zod'
import { X } from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { z } from 'zod'

interface EmitType {
  (event: 'save', data: RequestCreateCategory): void
  (event: 'cancel'): void
}
const props = defineProps<{ value?: Category }>()

const emit = defineEmits<EmitType>()

const nameValidation = z.object({
  categoryName: z.string(),
})
const form = useForm({
  validationSchema: toTypedSchema(nameValidation),
})
const onSubmit = form.handleSubmit(async (values) => {
  emit('save', values)
})
const isLoading = ref(false)

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
        {{ props.value ? 'Update' : 'Create' }} Category
      </h1>
      <X class="w-4 h-4 absolute right-8 top-8 cursor-pointer" @click="cancel" />
      <form class="sm:min-w-[25rem]" @submit.prevent="onSubmit">
        <div class="grid gap-4">
          <div class="grid gap-2">
            <InputValidator
              id="categoryName"
              :model-value="props?.value?.categoryName"
              type="text"
              label="Category Name"
              placeholder="Enter category name"
              name="categoryName"
            />
          </div>
          <Button type="submit" :disabled="isLoading" class="ml-4">
            <template v-if="isLoading">
              <Icon name="IconLoading" />
              Please wait
            </template>
            <template v-else>
              {{ props.value ? 'Update' : 'Create' }}
            </template>
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
