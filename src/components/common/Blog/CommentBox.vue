<script setup lang="ts">
import type { CommentData, Reply } from '@/types'
import { toast } from '@/components/ui/toast'
import { useCommentStore } from '@/stores/comment'

interface Emit {
  (event: 'updateComment', data: CommentData): void
  (event: 'delete', id: string): void
  (event: 'deleteReplyComment', data: { idComment: string, idReplyComment: string }): void
  (event: 'updateReplyComment', data: Reply): void
}
const props = defineProps<Props>()
const emit = defineEmits<Emit>()

const commentStore = useCommentStore()

interface Props {
  comment: CommentData | null
}
const itemComment = ref(props.comment)
const isReplying = ref(false)
const isShowReply = ref(false)
function handleUpdateComment(data: CommentData) {
  emit('updateComment', data)
}

function changeStatusReply() {
  isReplying.value = !isReplying.value
}

async function postCommentReply(content: string) {
  const newReply = await commentStore.createReplyComment({ comment_id: itemComment.value?.id as string, content })
  itemComment.value?.replies.push(newReply)
}
async function deleteComment(id: string) {
  emit('delete', id)
}

async function handleUpdateReplyComment(data: Reply) {
  try {
    const { data: newReplyComment } = await commentStore.updateReplyComment(data.id, { content: data.content })
    const index = itemComment.value?.replies.findIndex(reply => reply.id === newReplyComment.id)
    if (index !== undefined && index !== -1 && itemComment.value?.replies) {
      itemComment.value.replies[index] = newReplyComment
    }
  }
  catch {
    toast({
      title: 'Error',
      description: 'Can not update the comment',
      variant: 'destructive',
    })
  }
}
async function handleDeleteReplyComment(idReplyComment: string) {
  try {
    await commentStore.deleteReplyComment(idReplyComment)
    const index = itemComment.value?.replies.findIndex(reply => reply.id === idReplyComment)
    if (index !== undefined && index !== -1)
      itemComment.value?.replies.splice(index, 1)
  }
  catch {
    toast({
      title: 'Error',
      description: 'Can not delete the comment',
      variant: 'destructive',
    })
  }
}
</script>

<template>
  <Comment
    :item="itemComment"
    @update-comment="handleUpdateComment"
    @change-status-reply="changeStatusReply"
    @delete="deleteComment"
  />
  <Button
    v-if="itemComment?.replies.length"
    variant="link"
    class="ml-10"
    @click="isShowReply = !isShowReply"
  >
    {{ isShowReply ? 'Hide all' : `Show ${itemComment?.replies.length} replies ` }}
  </Button>
  <div
    v-if="itemComment"
    class="flex flex-col pl-12 mb-6"
  >
    <template v-if="isReplying">
      <span class="my-4 text-sm">What do you want to reply the above comment?</span>
      <Comment
        @comment="postCommentReply"
      />
    </template>
    <div
      v-show="isShowReply"
      class="grid"
    >
      <template
        v-for="commentReply in itemComment?.replies"
        :key="commentReply.id"
      >
        <Separator label="Comment reply" class="my-4" />
        <Comment
          :item="commentReply"
          @update-comment="handleUpdateReplyComment"
          @delete="handleDeleteReplyComment"
        />
      </template>
    </div>
  </div>
</template>
