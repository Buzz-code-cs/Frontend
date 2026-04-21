import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import '@/styles/variables.scss'
import '@/styles/reset.scss'
import '@/styles/dashboard.scss'

const app = createApp(App)

app.use(createPinia())
app.mount('#app')
