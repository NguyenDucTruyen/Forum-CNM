<script setup lang="ts">
import type { Message } from '@/types'
import { useGeminiStore } from '@/stores/gemini'
import { useUserStore } from '@/stores/user'
import { sleep } from '@/utils/common'
import { X } from 'lucide-vue-next'
import { v4 as uuidv4 } from 'uuid'

interface Prop {
  idBlog: string
}
const props = defineProps<Prop>()

const geminiStore = useGeminiStore()
const userStore = useUserStore()

// Reactive state
const messages = ref<Message[]>([])

const newMessage = ref<string>('')
const chatBoxBody = ref<HTMLDivElement | null>(null)
const chatContainer = ref<HTMLDivElement | null>(null)
const isChatVisible = ref<boolean>(false)
const visibleGoDownButton = ref<boolean>(false)
// Function to handle sending messages
async function sendMessage() {
  if (newMessage.value.trim() !== '') {
    messages.value.push({
      role: 'user',
      content: newMessage.value,
      id: uuidv4(),
      blog_id: props.idBlog,
      user_id: '',
      created_at: new Date().toISOString(),
    })
    const messageSend = newMessage.value
    newMessage.value = ''
    const botMessage = {
      role: 'bot',
      content: '',
      id: uuidv4(),
      blog_id: props.idBlog,
      user_id: '',
      created_at: new Date().toISOString(),
    }
    messages.value.push(botMessage)
    const { data: response } = await geminiStore.sendMessage(props.idBlog, messageSend)
    const index = messages.value.findIndex((message: Message) => message.id === botMessage.id)
    messages.value[index] = response
    nextTick(() => {
      goToBottom()
    })
  }
}

async function fetchData() {
  const { data } = await geminiStore.getConversation(props.idBlog)
  messages.value = data
}

// Scroll to the bottom on mount
onMounted(() => {
  goToBottom()
  fetchData()
})
async function goToBottom() {
  await sleep(500)
  if (chatBoxBody.value) {
    chatBoxBody.value.scrollTo({
      top: chatBoxBody.value.scrollHeight,
      behavior: 'smooth',
    })
  }
}
function openChat() {
  isChatVisible.value = true
  goToBottom()
}
function closeChat() {
  isChatVisible.value = false
}
function handleOpenChat() {
  if (isChatVisible.value) {
    closeChat()
  }
  else {
    openChat()
  }
}

function handleScroll() {
  if (chatBoxBody.value && chatContainer.value) {
    visibleGoDownButton.value = chatContainer.value.getBoundingClientRect().bottom - chatBoxBody.value.getBoundingClientRect().bottom > 100
  }
}
</script>

<template>
  <!-- Button to toggle chat box -->
  <Button
    class="fixed bottom-12 right-12 p-3 rounded-full shadow-lg "
    @click="handleOpenChat"
  >
    <Icon name="IconChat" />
    Chat with AI Assistant
  </Button>

  <!-- Chat Box -->
  <div
    v-show="isChatVisible"
    class="fixed bottom-28 bg-gray-50 right-4 w-full max-w-md rounded-lg shadow-lg"
  >
    <!-- Header -->
    <div class="p-4 border-b">
      <h2 class="text-xl text-black font-semibold flex justify-between items-center ">
        AI Assistant
        <Button
          variant="ghost"
          @click="closeChat"
        >
          <X />
        </Button>
      </h2>
    </div>

    <!-- Chat Messages -->
    <div class="relative">
      <div ref="chatBoxBody" class="p-4 h-96 overflow-y-auto chatBoxBody" @scroll="handleScroll">
        <div v-if="!userStore.user?.upgrade_at" class="flex flex-col gap-2 mb-10 ">
          <h2 class="text-black text-center text-xl font-semibold">
            You can't use this feature
          </h2>
          <h2 class="text-black text-center">
            You are using BASIC plan, upgrade to premium to use this feature
          </h2>
          <RouterLink to="/profile/{{ userStore.user.id }}/plans" class="flex justify-center">
            <Button>Upgrade Now</Button>
          </RouterLink>
        </div>
        <div v-else class="flex flex-col gap-2 mb-10 ">
          <h2 class="text-black text-center text-xl font-semibold">
            Welcome to our service! 🎉
          </h2>
          <h2 class="text-black text-center">
            I’m here to assist you with anything you need.
          </h2>
        </div>
        <div ref="chatContainer" class="chatContainer">
          <div v-for="(message, index) in messages" :key="index" class="mb-10">
            <div v-if="message.role === 'user'" class="flex justify-end gap-2">
              <div class="bg-primary text-white p-2 rounded-lg">
                {{ message.content }}
              </div>
              <img
                v-if="userStore.user"
                v-lazy="userStore.user.profileImage ?? 'https://static.vecteezy.com/system/resources/thumbnails/024/983/914/small_2x/simple-user-default-icon-free-png.png'"
                alt=""
                class="h-7 w-7 rounded-full object-cover"
              >
            </div>
            <div v-else class="flex justify-start gap-2">
              <img
                v-lazy="'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcThr7qrIazsvZwJuw-uZCtLzIjaAyVW_ZrlEQ&s'"
                alt="Bot"
                class="w-7 h-7 rounded-full"
              >
              <div v-if="message.content" class="bg-slate-200 text-black p-2 rounded-lg">
                {{ message.content }}
              </div>
              <div v-else class="bg-slate-200 text-black p-2 rounded-lg">
                <Icon name="IconTyping" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Button
        v-if="visibleGoDownButton"
        variant="secondary"
        class="absolute bottom-2 left-1/2 translate-x-[-50%]"
        @click="goToBottom"
      >
        <Icon name="IconArrowDown" />
      </Button>
    </div>

    <!-- Input Field -->
    <div class="p-4 border-t border-gray-200">
      <form class="flex items-center" @submit.prevent="sendMessage">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message"
          class="flex-1 p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
        >
        <Button
          type="submit"
          :disabled="!userStore.user?.upgrade_at"
          class="ml-2 p-2rounded-lg "
        >
          <Icon name="IconSend" />
        </Button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* You can add custom styles if necessary */
</style>
