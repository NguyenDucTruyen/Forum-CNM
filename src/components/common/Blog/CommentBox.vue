<script setup lang="ts">
import type { CommentData, CommentReply } from '@/types'
import { toast } from '@/components/ui/toast'
import { useCommentStore } from '@/stores/comment'
import { useUserStore } from '@/stores/user'

interface Emit {
  (event: 'updateComment', data: CommentData): void
  (event: 'delete', id: string): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const userStore = useUserStore()
const commentStore = useCommentStore()

interface Props {
  comment: CommentData | null
}
const itemComment = ref(props.comment)
const isReplying = ref(false)
function hanldeEmitUpdateComment(data: CommentData) {
  emit('updateComment', data)
}
function changeStatusReply() {
  isReplying.value = !isReplying.value
}
async function postCommentReply(content: string) {
  const response = await commentStore.createReplyComment(itemComment.value?._id as string, { content })
  const newComment = {
    ...response,
    userId: {
      _id: userStore.user?._id as string,
      email: userStore.user?.email as string,
    },
  } as CommentReply
  itemComment.value?.reply.push(newComment)
  toast({
    title: 'Success',
    description: 'Comment posted successfully.',
  })
}
async function deleteComment(id: string) {
  emit('delete', id)
}
</script>

<template>
  <Comment
    :item="itemComment"
    @update-comment="hanldeEmitUpdateComment"
    @change-status-reply="changeStatusReply"
    @delete="deleteComment"
  />

  <!-- Write comment reply -->

  <div class="flex flex-col pl-12 mb-6">
    <template v-if="isReplying">
      <span class="my-4 text-sm">What do you want to reply the above comment?</span>
      <Comment
        @comment="postCommentReply"
      />
    </template>

    <!-- List comment reply -->

    <template
      v-for="commentReply in itemComment?.reply"
      :key="commentReply._id"
    >
      <Separator label="Comment reply" class="my-4" />
      <Comment
        :item="commentReply"
        @update-comment="hanldeEmitUpdateComment"
      />
    </template>
  </div>
</template>
