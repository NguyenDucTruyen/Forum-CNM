<script setup lang="ts">
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'

interface InputProps {
  modelValue?: string
  id?: string
  type?: string
  placeholder?: string
  label?: string
  name?: string
  style?: any
  disabled?: boolean
}
const props = withDefaults(defineProps<InputProps>(), {
  id: 'text',
  type: 'text',
  label: '',
  name: 'text',
  disabled: false,
})
const isShowPassword = ref(false)
function toggleShowIcon() {
  isShowPassword.value = !isShowPassword.value
}
const typeInputComputed = computed(() => {
  return props.type === 'password' && isShowPassword.value ? 'text' : props.type
})
</script>

<template>
  <FormField v-slot="{ componentField }" :model-value="props.modelValue" :name="props.name" :validate-on-blur="true">
    <div class="space-y-2 h-24 relative" :style="props.style">
      <Label v-if="props.label" :for="props.id">{{ props.label }}</Label>
      <FormItem>
        <FormControl>
          <slot :component-field="componentField">
            <Input
              :id="props.id"
              :type="typeInputComputed"
              :placeholder="props.placeholder"
              :disabled="props.disabled"
              v-bind="componentField"
              class="pr-9"
              autocomplete="off"
            />
          </slot>
          <div
            v-if="props.type === 'password'"
            class="w-10 h-10 absolute right-0 top-8 cursor-pointer flex items-center justify-center"
            @click="toggleShowIcon"
          >
            <Icon v-if="!isShowPassword" name="IconEyeOff" class="w-6 h-6" />
            <Icon v-else name="IconEyeOn" class="w-6 h-6" />
          </div>
          <FormMessage class="error-message absolute bottom-0" />
        </FormControl>
      </FormItem>
    </div>
  </FormField>
</template>

<style scoped>
.error-message {
  margin-top: 4px !important;
}
</style>
