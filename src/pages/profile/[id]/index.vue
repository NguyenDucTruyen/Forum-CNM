<route>
    {
        meta: {
            title: 'Profile',
            layout: 'profile'
        }
    }
</route>

<script setup lang="ts">
import type { UserData } from '@/types'
import { uploadImage } from '@/api/upload'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { toast } from '@/components/ui/toast'
import { useConfirmStore } from '@/stores/confirm'
import { useThemeStore } from '@/stores/theme'
import { useUserStore } from '@/stores/user'
import { updateProfileValidator } from '@/utils/validation'
import { toTypedSchema } from '@vee-validate/zod'
import { formatISO } from 'date-fns'

import { BookText, CloudUpload, Trash2 } from 'lucide-vue-next'
import { ErrorMessage, Field, useForm } from 'vee-validate'

const router = useRouter()
const themeStore = useThemeStore()
const userStore = useUserStore()
const route = useRoute()
const confirmStore = useConfirmStore()
const user = ref<UserData | null>(null)
try {
  user.value = await userStore.getUserData(route.params.id as string)
}
catch (error) {
  console.error(error)
  toast({
    title: 'Error',
    description: 'User not found',
    variant: 'destructive',
  })
  router.push('/home')
}

const isAuthor = computed(() => user.value?.id === userStore.user?.id)

const isLoading = ref(false)
const fileInput = useTemplateRef('refInput')
const file = ref<File | null>(null)
const previewImage = ref<string | null>(user.value?.profileImage || null)
const date = ref<Date | null>(user.value?.dayOfBirth ? new Date(user.value.dayOfBirth) : null)
const { handleSubmit, setFieldValue, resetForm } = useForm({
  validationSchema: toTypedSchema(updateProfileValidator),
})
const genderInitial = computed(() => {
  return user.value?.gender ?? ''
})

const onSubmit = handleSubmit(async (values) => {
  try {
    isLoading.value = true
    let url = user.value?.profileImage || ''
    if (file.value) {
      const res = await uploadImage(file.value as File)
      url = res.url
    }
    const body = {
      ...values,
      phone: 0,
      profileImage: url,
    }
    const data = await userStore.updateUserData(body)

    user.value = data
    toast({
      title: 'Success',
      description: 'Profile updated successfully',
    })

    resetData()
  }
  catch (error: Error | any) {
    const data = error?.response?.data
    const errorMessage = data?.error || 'Some thing went wrong'
    toast({
      title: 'Error',
      description: errorMessage,
      variant: 'destructive',
      duration: 5000,
    })
  }
  finally {
    isLoading.value = false
  }
})

function resetData() {
  resetForm()
  date.value = user.value?.dayOfBirth ? new Date(user.value.dayOfBirth) : null
}
function handleUploadImage(e: Event, field: any) {
  const target = e.target as HTMLInputElement
  const files = target.files
  if (!files?.length) {
    return
  }
  file.value = files[0]
  setFieldValue(field.name, file.value)
  const blob = URL.createObjectURL(file.value)
  previewImage.value = blob
}
function clearImage() {
  if (user.value) {
    user.value.profileImage = ''
  }
  if (fileInput.value)
    fileInput.value.value = ''
  file.value = null
  previewImage.value = user.value?.profileImage || null
}
const dateFormat = computed(() => {
  return date.value ? formatISO(date.value, { representation: 'date' }) : ''
})
async function confirmDeletePhoto() {
  const result = await confirmStore.showConfirmDialog({
    title: 'Confirm delete',
    message: 'Are you sure you want to delete this photo?',
  })
  if (result) {
    clearImage()
  }
}
</script>

<template>
  <form v-if="user" class="p-8 max-w-4xl flex-1 rounded-md" @submit.prevent="onSubmit">
    <div class="flex flex-col items-center mb-8">
      <h1 class="text-2xl font-semibold mb-2 flex items-center gap-2">
        Profile
      </h1>
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
      <div class="col-span-1 flex flex-col relative items-center">
        <Avatar class="h-28 w-28 sm:h-40 sm:w-40 rounded-lg cursor-pointer relative mt-8" @click="() => fileInput?.click()">
          <template v-if="previewImage">
            <div class="flex justify-center items-center rounded-sm absolute right-1 top-1 hover:bg-muted-foreground bg-secondary p-1 cursor-pointer" @click.stop="confirmDeletePhoto">
              <Trash2 />
            </div>
            <AvatarImage :src="previewImage" />
          </template>
          <div class="rounded-lg p-1 flex flex-col items-center gap-2 absolute">
            <CloudUpload :size="32" />
            <span class="font-semibold">Upload avatar</span>
          </div>
        </Avatar>
        <Field v-slot="{ field }" name="file">
          <input
            id="file"
            ref="refInput"
            type="file"
            accept="image/*"
            class="hidden"
            @change="handleUploadImage($event, field)"
          >
        </Field>
        <ErrorMessage name="file" class="absolute w-full text-center left-1/2 translate-x-[-50%] bottom-0 text-sm font-normal text-destructive" />
      </div>
      <div class="col-span-2 grid gap-2 py-4">
        <Label>Email</Label>
        <Input :model-value="user?.email ?? ''" label="Email" disabled />
        <InputValidator
          id="firstName"
          :model-value="user?.firstName ?? ''"
          type="text"
          label="First Name"
          placeholder="Enter your first name"
          :disabled="!isAuthor"
          name="firstName"
        />
        <InputValidator
          id="lastName"
          :model-value="user?.lastName ?? ''"
          type="text"
          label="Last Name"
          placeholder="Enter your last name"
          :disabled="!isAuthor"
          name="lastName"
        />
        <InputValidator
          id="gender"
          label="Gender"
          :model-value="genderInitial"
          name="gender"
          :style="{ height: '5rem' }"
        >
          <template v-if="isAuthor" #default="{ componentField }">
            <FormControl>
              <RadioGroup
                class="grid grid-cols-2 space-y-1"
                v-bind="componentField"
              >
                <FormItem class="flex col-span-1 items-center space-y-0 gap-x-3">
                  <FormControl>
                    <RadioGroupItem value="male" />
                  </FormControl>
                  <FormLabel class="font-normal">
                    Male
                  </FormLabel>
                </FormItem>
                <FormItem class="flex col-span-1 items-center space-y-0 gap-x-3">
                  <FormControl>
                    <RadioGroupItem value="female" />
                  </FormControl>
                  <FormLabel class="font-normal">
                    Female
                  </FormLabel>
                </FormItem>
              </RadioGroup>
            </FormControl>
          </template>
          <span v-if="!isAuthor">
            {{ genderInitial.charAt(0).toUpperCase() + genderInitial.slice(1) }}
          </span>
        </InputValidator>
        <div class="flex flex-col justify-center gap-4">
          <Label>Date of birth</Label>
          <input
            v-model="dateFormat"
            type="text"
            placeholder="Select date"
            class="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 pr-9"
            disabled
          >
          <VDatePicker
            v-if="isAuthor"
            v-model="date"
            :color="themeStore.color"
            locale="en"
          >
            <template #default="{ togglePopover }">
              <Button
                type="button"
                @click="togglePopover"
              >
                Select date
              </Button>
            </template>
          </VDatePicker>
        </div>
        <div class="mt-4">
          <InputValidator
            id="dayOfBirth"
            :model-value="dateFormat"
            placeholder="Select date"
            label=""
            name="dayOfBirth"
            :style="{ height: '0' }"
          >
            <template #default="{ componentField }">
              <Input
                id="dayOfBirth"
                v-bind="componentField"
                class="pr-9 hidden"
                autocomplete="off"
              />
            </template>
          </InputValidator>
        </div>
      </div>
    </div>

    <div v-if="isAuthor" class="flex gap-4">
      <Button variant="secondary" type="button" @click="resetData">
        Reset
      </Button>
      <Button type="submit" :disabled="isLoading">
        <template v-if="isLoading">
          <Icon name="IconLoading" />
          Please wait
        </template>
        <template v-else>
          Update Profile
        </template>
      </Button>
    </div>
  </form>
</template>
