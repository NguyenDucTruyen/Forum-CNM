<!-- eslint-disable no-console -->
<route>
  {
      meta: {
      layout: "empty",
      title: "Create",
      }
  }
</route>

<script setup lang="ts">
import type { RequestCreateBlog } from '@/types'
import { uploadImage } from '@/api/upload'
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from '@/components/ui/toast'
import { useBlogStore } from '@/stores/blog'
import { useCategoryStore } from '@/stores/category'
import { toTypedSchema } from '@vee-validate/zod'
import { BookText, CloudUpload, X } from 'lucide-vue-next'
import { ErrorMessage, Field, Form, useForm } from 'vee-validate'

import { z } from 'zod'

const categoryStore = useCategoryStore()
const blogStore = useBlogStore()
onMounted(async () => {
  if (!categoryStore.categories) {
    await categoryStore.getCategories()
  }
})

const isLoading = ref(false)
const fileInput = useTemplateRef('refInput')
const refQuillContent = useTemplateRef('refQuillContent')
const file = ref<File | null>(null)
const previewImage = ref<string | null>(null)
const titleSchema = z.string().min(2).max(255)
const categorySchema = z.string()
const contentSchema = z.string().min(20)

const MAX_FILE_SIZE = 3 * 1024 * 1024
const ACCEPTED_IMAGE_TYPES = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
const fileSchema = z
  .any()
  .refine((file: File) => !!file, 'Require a thumbnail image')
  .refine(file => !!file && file.size < MAX_FILE_SIZE, 'File must be less than 3MB')
  .refine(
    file => !!file && ACCEPTED_IMAGE_TYPES.includes(file.type),
    'File must be a valid image format (.jpg, .jpeg, .png and .webp)',
  )

const content = ref<string>('')
const { handleSubmit, setFieldValue, resetForm } = useForm({
  validationSchema: toTypedSchema(z.object(
    { title: titleSchema, category: categorySchema, content: contentSchema, file: fileSchema,
    },
  )),
})

const onSubmit = handleSubmit(async (values) => {
  try {
    if (!file.value) {
      return
    }
    isLoading.value = true
    const response = await uploadImage(file.value as File)
    const body = {
      title: values.title,
      category_id: values.category,
      content: content.value,
      blogImage: response.url,
    }
    await blogStore.createBlog(body as RequestCreateBlog)
    toast({
      title: 'Success',
      description: 'Blog created successfully.',
    })
    resetData()
  }
  catch (error: Error | any) {
    const data = error?.response?.data
    const errorMessage = data?.error || data?.message || 'Some thing went wrong'
    if (errorMessage) {
      toast({
        title: 'Error',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      })
    }
  }
  finally {
    isLoading.value = false
  }
})

function resetData() {
  resetForm()
  clearImage()
  refQuillContent.value?.clearContent()
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
  file.value = null
  previewImage.value = null
  setFieldValue('file', undefined)
}
function updateContent(newContent: string) {
  content.value = newContent
}
</script>

<template>
  <form class="p-8 max-w-4xl flex-1 rounded-md" @submit.prevent="onSubmit">
    <div class="flex flex-col items-center mb-8">
      <h1 class="text-2xl font-semibold mb-2 flex items-center gap-2">
        <BookText />  Create Blog
      </h1>
      <p>
        Fill in the form below to create a new blog.
      </p>
    </div>
    <div class="grid grid-cols-3 gap-4 mb-6">
      <div class="col-span-1 flex flex-col justify-center relative items-center">
        <Avatar class="h-28 w-28 sm:h-40 sm:w-40 rounded-lg cursor-pointer relative" @click="() => fileInput?.click()">
          <div v-if="file" class="flex justify-center items-center rounded-sm absolute right-1 top-1 hover:bg-muted-foreground bg-secondary p-1 cursor-pointer" @click.stop="clearImage">
            <X />
          </div>
          <AvatarImage v-if="previewImage" :src="previewImage" />
          <div v-else class="rounded-lg p-1 flex flex-col items-center gap-2">
            <CloudUpload :size="32" />
            <span class="font-semibold">Upload thumbnail</span>
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
        <InputValidator
          id="title"
          type="text"
          label="Title"
          placeholder="Title blog"
          required
          name="title"
          autocomplete="off"
        />
        <InputValidator id="category" label="Category" name="category">
          <template #default="{ componentField }">
            <Select v-bind="componentField">
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem
                    v-for="category in categoryStore.categories"
                    :key="category.id"
                    :value="category.id.toString()"
                  >
                    {{ category.categoryName }}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </template>
        </InputValidator>
      </div>
    </div>
    <Label class="text-lg">What are the details of your blog?</Label>
    <p class=" flex mb-4 font-normal">
      Expand on what you put in the title. Minimum 20 characters.
    </p>
    <ContentEditor ref="refQuillContent" @update-content="updateContent" />
    <div class="mt-8">
      <InputValidator
        :model-value="content"
        label=""
        name="content"
        :style="{ height: '0' }"
      >
        <template #default="{ componentField }">
          <Input
            id="content"
            v-bind="componentField"
            class="pr-9 hidden"
            autocomplete="off"
          />
        </template>
      </InputValidator>
    </div>
    <Button variant="secondary">
      <RouterLink to="/home">
        Cancel
      </RouterLink>
    </Button>
    <Button type="submit" :disabled="isLoading" class="mt-4 ml-4">
      <template v-if="isLoading">
        <Icon name="IconLoading" />
        Please wait
      </template>
      <template v-else>
        Create Blog
      </template>
    </Button>
  </form>
</template>
