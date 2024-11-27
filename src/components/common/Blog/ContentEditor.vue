<!-- eslint-disable prefer-promise-reject-errors -->
<script setup lang="ts">
import { uploadImage } from '@/api/upload'
import { toast } from '@/components/ui/toast'
import { sleep } from '@/utils/common'
import BlotFormatter from 'quill-blot-formatter'
import ImageUploader from 'quill-image-uploader'

interface Emit {
  (event: 'updateContent', value: string): void
}
const emit = defineEmits<Emit>()
defineExpose({ clearContent })
const modules = [{
  name: 'blotFormatter',
  module: BlotFormatter,
  options: {},
}, {
  name: 'imageUploader',
  module: ImageUploader,
  options: { upload: async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: 'Error',
        description: 'Only image files are allowed.',
        variant: 'destructive',
      })
      return Promise.reject('Only image files are allowed.')
    }
    const response = await uploadImage(file)
    return Promise.resolve(response.url)
  },
  },
}]
const content = ref<string>('')
const quill = ref(null)
const focus = ref(false)
const toolbar = [
  [{ header: [false, 1, 2, 3, 4, 5, 6] }],
  ['bold', 'italic', 'strike'],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  ['clean'],
]
watch(content, (value) => {
  emit('updateContent', value)
})
function clearContent() {
  content.value = ''
  quill.value?.setContents('')
}
</script>

<template>
  <div class="description-editor">
    <div>
      <div class="editor-container" :class="{ focus }">
        <quill-editor
          ref="quill"
          content-type="html"
          :toolbar="toolbar"
          :modules="modules"
          @update:content="content = $event"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.preview-description {
  cursor: pointer;
}
.editor-container {
  border-radius: 4px;
  box-shadow: 0 0 0 1px #dbdbdb;
  min-height: 200px;
}
.editor-container.focus {
  box-shadow: 0 0 0 2px #388bff;
}
.ql-toolbar.ql-snow {
  border: none;
  border-radius: 4px 4px 0 0;
  background-color: #fff;
}
.ql-editor.content {
  padding: 0;
}

:deep() {
  .ql-snow.ql-toolbar button,
  .ql-toolbar.ql-snow .ql-picker-label {
    @apply rounded-sm;
  }
  .ql-snow.ql-toolbar button.ql-active {
    color: #333 !important;
    background-color: #e9ecf1;
  }
  .ql-container {
    font-size: 14px;
    line-height: 20px;
  }
  .ql-toolbar {
    border: none;
    border-bottom: 2px solid #dfdfdf;
  }
  .ql-container.ql-snow {
    border: none;
  }
  .ql-container.ql-snow .ql-editor {
    min-height: 100px;
  }
}
</style>
