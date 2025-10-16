import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

import App from './App.vue'
import router from './router'
import logger, { logError, logInfo } from './utils/logger'

// 记录应用启动信息
logInfo('应用启动', { 
  timestamp: new Date().toISOString(),
  environment: import.meta.env.MODE
})

const app = createApp(App)

// 全局错误处理
app.config.errorHandler = (err, instance, info) => {
  logError('Vue应用错误', {
    error: err,
    componentInfo: instance?.$options?.name || '未知组件',
    errorInfo: info
  })
}

app.use(createPinia())
app.use(router)
app.use(ElementPlus)

// 记录路由变化
router.beforeEach((to, from) => {
  logInfo('路由变化', { 
    from: from.path, 
    to: to.path 
  })
  return true
})

app.mount('#app')

// 记录应用成功挂载
logInfo('应用成功挂载到DOM')