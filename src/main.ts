import { QuillEditor } from '@vueup/vue-quill'
import { createPinia } from 'pinia'
import { Calendar, DatePicker, setupCalendar } from 'v-calendar'
import { createApp } from 'vue'
import VueLazyload from 'vue-lazyload'
import vue3GoogleLogin from 'vue3-google-login'
import App from './App.vue'
import router from './router'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import './assets/index.css'
import './assets/custom/quill.css'
import './utils/zodLocale'
import 'v-calendar/style.css'

const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(VueLazyload)
  .use(setupCalendar, {})
  .use(vue3GoogleLogin, {
    clientId: import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID as string,
  })

app.component('QuillEditor', QuillEditor)
app.component('VCalendar', Calendar)
app.component('VDatePicker', DatePicker)

router.isReady().then(() => {
  app.mount('#app')
})
