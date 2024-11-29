<!-- eslint-disable prefer-promise-reject-errors -->
<script setup lang="ts">
import type { CommentData, Reply, UserData } from '@/types'

import { uploadImage } from '@/api/upload'
import { toast } from '@/components/ui/toast'
import { useCommentStore } from '@/stores/comment'
import { useConfirmStore } from '@/stores/confirm'
import { useUserStore } from '@/stores/user'
import { MoreHorizontal } from 'lucide-vue-next'
import BlotFormatter from 'quill-blot-formatter'
import ImageUploader from 'quill-image-uploader'

interface Emit {
  (event: 'updateComment', data: CommentData | Reply): void
  (event: 'comment', title: string): void
  (event: 'changeStatusReply', status: boolean): void
  (event: 'delete', id: string): void
}

interface Props {
  item?: CommentData | Reply
}

const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const userStore = useUserStore()
const confirmStore = useConfirmStore()
const edit = defineModel('edit')

const isLoading = ref(false)
const itemComment = ref<CommentData | Reply | undefined>(props.item)
const title = ref('')
const quill = ref(null)
const focus = ref(false)
const enableSave = ref(false)
const isReply = ref(false)
const authorComment = ref<UserData | null>(null)

async function fetchData() {
  if (itemComment.value) {
    isLoading.value = true
    authorComment.value = await userStore.getUserData(itemComment.value?.user_id as string)
    isLoading.value = false
  }
}

fetchData()

const toolbar = [
  [{ header: [false, 1, 2, 3, 4, 5, 6] }],
  ['bold', 'italic', 'strike'],
  [{ align: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['blockquote', 'code-block'],
  ['link', 'image'],
  ['clean'],
]
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

function switchToEditMode() {
  if (itemComment.value?.content) {
    title.value = itemComment.value.content
  }
  edit.value = true
}
function handleFocus() {
  focus.value = true
}
function handleBlur() {
  focus.value = false
}
function save() {
  if (itemComment.value) {
    itemComment.value.content = title.value
    emit('updateComment', itemComment.value)
    edit.value = false
  }
  else {
    emit('comment', title.value)
    title.value = ''
    quill.value?.setContents('')
  }
}
function cancelChange() {
  title.value = itemComment.value?.content || ''
  edit.value = false
}
watch(edit, (val) => {
  if (val) {
    nextTick(() => {
      quill.value?.focus()
    })
  }
})
watch(title, async () => {
  await nextTick()
  if (!quill.value) {
    return
  }
  enableSave.value = quill.value.getText().trim() !== ''
})
function getDate(date: string) {
  const dmy = date.split('T')[0]
  const times = date.split('T')[1].split(':')
  return `${dmy}, ${times[0]}:${times[1]}`
}
function emitReply() {
  isReply.value = !isReply.value
  emit('changeStatusReply', isReply.value)
}
async function confirmDeleteComment(id: string) {
  const confirm = await confirmStore.showConfirmDialog({
    title: 'Confirm delete',
    message: 'Are you sure you want to delete this comment?',
  })
  if (confirm) {
    emit('delete', id)
  }
}
</script>

<template>
  <div class="comment-editor" :class="{ 'pl-10': itemComment }">
    <img
      v-if="itemComment"
      v-lazy="authorComment?.profileImage ?? 'https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small_2x/simple-user-default-icon-free-png.png'"
      alt=""
      class="comment-creator"
    >
    <div v-if="!edit && itemComment" class="preview-comment relative">
      <template v-if="itemComment">
        <div class="comment-author">
          <span class="comment-author-name max-w-60 truncate">{{ authorComment?.email }}</span>
          <span class="comment-author-time">{{ getDate(itemComment.created_at) }}</span>
        </div>
        <div class="preview-comment-body ql-snow w-[calc(100%-3rem)]">
          <div class="content ql-editor" v-html="itemComment.content" />
          <div v-if="itemComment?.replies" class="preview-comment-body-action">
            <Button variant="link" type="info" class="file-action relative" @click="emitReply">
              {{ isReply ? 'Cancel reply' : 'Write a reply' }}
            </Button>
          </div>
        </div>
        <DropdownMenu
          v-if="
            (authorComment?.id === userStore.user?.id
              || userStore.user?.roleName === 'ADMIN')"
        >
          <DropdownMenuTrigger
            class="cursor-pointer"
            as-child
          >
            <Button variant="outline" class="w-8 h-8 p-0 absolute right-0 top-5">
              <span class="sr-only">Open menu</span>
              <MoreHorizontal class="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent class="">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              @click="switchToEditMode"
            >
              Edit comment
            </DropdownMenuItem>
            <DropdownMenuItem class="cursor-pointer" @click="confirmDeleteComment(itemComment.id)">
              Delete comment
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </template>
      <div v-else class="preview-comment-placeholder" @click="switchToEditMode()">
        Viết bình luận...
      </div>
    </div>
    <div v-else>
      <div class="editor-container" :class="{ focus }">
        <quill-editor
          ref="quill"
          v-model:content="title"
          content-type="html"
          :toolbar="toolbar"
          :modules="modules"
          placeholder="Viết bình luận..."
          @focus="handleFocus"
          @blur="handleBlur"
        />
      </div>
      <div class="editor-footer">
        <Button :disabled="!enableSave" @click="save">
          Save
        </Button>
        <Button v-if="itemComment" variant="secondary" type="info" @click="cancelChange">
          Cancel
        </Button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.comment-editor {
  position: relative;
  margin-bottom: 8px;
}
.preview-comment-placeholder {
  padding: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091e4240, 0px 0px 1px #091e424f);
  border-radius: 8px;
}
.preview-comment-placeholder:hover {
  box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091e4240, 0px 0px 1px #091e424f);
  cursor: pointer;
}
.comment-author {
  display: flex;
  align-items: center;
  margin-bottom: 4px;
}
.comment-author-name {
  font-size: 14px;
  font-weight: 600;
  line-height: 18px;
  margin-right: 8px;
}
.comment-author-time {
  font-size: 12px;
  font-weight: 400;
  line-height: 16px;
}
.comment-creator {
  position: absolute;
  left: 0;
  top: 4px;
  object-fit: contain;
  width: 32px;
  height: 32px;
  border-radius: 50%;
}
.preview-comment-body-action {
  margin-top: 4px;
  display: flex;
}

.file-action::before {
  @apply absolute top-2 left-0 text-primary;
  content: '•';
}
.editor-footer {
  @apply mt-4 gap-2 flex;
}
.editor-container {
  border-radius: 2px;
  box-shadow: 0 0 0 1px #dbdbdb;
  min-height: 56px;
}
.editor-container.focus {
  box-shadow: 0 0 0 2px hsl(var(--primary));
}
.ql-toolbar.ql-snow {
  border: none;
  border-radius: 2px 2px 0 0;
}
.ql-editor.content {
  padding: 0;
  padding: 8px;
  padding: 8px 12px;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: var(--ds-shadow-raised, 0px 1px 1px #091e4240, 0px 0px 1px #091e424f);
  border-radius: 8px;
}

:deep() {
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
    min-height: 56px;
  }
  .button-confirm-delete-comment {
    @apply w-full mt-4;
  }
  .ql-snow.ql-toolbar button,
  .ql-toolbar.ql-snow .ql-picker-label {
    @apply rounded-sm;
  }
  .ql-snow.ql-toolbar button.ql-active {
    color: #333 !important;
    background-color: #e9ecf1;
  }
}
</style>
