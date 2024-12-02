<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import { X } from 'lucide-vue-next'

interface Message {
  role: 'user' | 'bot'
  content: string
}

const userStore = useUserStore()
// Reactive state
const messages = ref<Message[]>([
  { role: 'bot', content: 'Hello! How can I help you today?' },
  { role: 'user', content: 'I need some information about your services hgshsh asdhslkjhjskjlghsdg.' },
  { role: 'bot', content: 'Sure! We offer a variety of services including web development, mobile app development, and more.' },
  { role: 'user', content: 'That sounds great! Can you tell me more about your web development services?' },
  { role: 'bot', content: 'Of course! We specialize in creating responsive and user-friendly websites using the latest technologies.' },
  { role: 'user', content: 'Thank you for the information!' },
  { role: 'bot', content: 'You\'re welcome! If you have any more questions, feel free to ask.' },
])

const newMessage = ref<string>('')
const chatContainer = ref<HTMLDivElement | null>(null)
const isChatVisible = ref<boolean>(false) // State to toggle chat box visibility

// Function to handle sending messages
function sendMessage() {
  if (newMessage.value.trim() !== '') {
    messages.value.push({ role: 'user', content: newMessage.value })
    newMessage.value = ''
    nextTick(() => {
      if (chatContainer.value) {
        chatContainer.value.scrollTop = chatContainer.value.scrollHeight
      }
    })
  }
}

// Scroll to the bottom on mount
onMounted(() => {
  if (chatContainer.value) {
    chatContainer.value.scrollTop = chatContainer.value.scrollHeight
  }
})
</script>

<template>
  <!-- Button to toggle chat box -->
  <Button
    class="fixed bottom-12 right-12 p-3 rounded-full shadow-lg "
    @click="isChatVisible = !isChatVisible"
  >
    <Icon name="IconChat" />
    Chat
  </Button>

  <!-- Chat Box -->
  <div
    v-if="isChatVisible"
    class="fixed bottom-28 bg-gray-50 right-4 w-full max-w-md rounded-lg shadow-lg"
  >
    <!-- Header -->
    <div class="p-4 border-b">
      <h2 class="text-xl text-black font-semibold flex justify-between items-center ">
        AI Assistant
        <Button
          variant="ghost"
          @click="isChatVisible = false"
        >
          <X />
        </Button>
      </h2>
    </div>

    <!-- Chat Messages -->
    <div ref="chatContainer" class="p-4 h-96 overflow-y-auto">
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
          <div class="bg-slate-200 text-black p-2 rounded-lg">
            {{ message.content }}
          </div>
        </div>
      </div>
    </div>

    <!-- Input Field -->
    <div class="p-4 border-t border-gray-200">
      <form class="flex items-center" @submit.prevent="sendMessage">
        <input
          v-model="newMessage"
          type="text"
          placeholder="Type a message"
          class="flex-1 p-2 border text-black border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
        <Button
          type="submit"
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
