import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import { usePermissStore } from './store/permiss';
import 'element-plus/dist/index.css'
import './assets/main.css';

const app = createApp(App)

app.use(router).use(ElementPlus).use(createPinia())

const permiss = usePermissStore();
app.directive('permiss', {
    mounted(el, binding) {
        if (!permiss.key.includes(String(binding.value))) {
            el['hidden'] = true
        }
    }
})

// console.log(import.meta.env.VITE_PORT);

app.mount('#app')
