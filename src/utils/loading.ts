import { ElLoading } from 'element-plus'
import type { LoadingInstance } from 'element-plus/es/components/loading/src/loading'

// 全局加载实例
let loadingInstance: LoadingInstance | null = null

// 加载配置接口
export interface LoadingConfig {
  text?: string
  background?: string
  target?: string | HTMLElement
  fullscreen?: boolean
}

// 显示全屏加载
export const showLoading = (config: LoadingConfig = {}): LoadingInstance => {
  const defaultConfig = {
    text: '加载中...',
    background: 'rgba(0, 0, 0, 0.7)',
    fullscreen: true,
    ...config
  }
  
  // 如果已有加载实例，先关闭
  if (loadingInstance) {
    loadingInstance.close()
  }
  
  loadingInstance = ElLoading.service(defaultConfig)
  return loadingInstance
}

// 隐藏加载
export const hideLoading = (): void => {
  if (loadingInstance) {
    loadingInstance.close()
    loadingInstance = null
  }
}

// 带超时的加载
export const showLoadingWithTimeout = (
  config: LoadingConfig = {},
  timeout: number = 30000
): Promise<void> => {
  return new Promise((resolve, reject) => {
    const loading = showLoading(config)
    
    const timer = setTimeout(() => {
      hideLoading()
      reject(new Error('请求超时'))
    }, timeout)
    
    // 返回一个可以手动关闭的Promise
    const originalClose = loading.close
    loading.close = () => {
      clearTimeout(timer)
      originalClose.call(loading)
      resolve()
    }
  })
}

// 异步操作包装器
export const withLoading = async <T>(
  asyncFn: () => Promise<T>,
  config: LoadingConfig = {}
): Promise<T> => {
  showLoading(config)
  try {
    const result = await asyncFn()
    return result
  } finally {
    hideLoading()
  }
}

// 页面级加载状态管理
export class PageLoadingManager {
  private loadingStates: Map<string, boolean> = new Map()
  
  setLoading(key: string, loading: boolean): void {
    this.loadingStates.set(key, loading)
  }
  
  isLoading(key: string): boolean {
    return this.loadingStates.get(key) || false
  }
  
  isAnyLoading(): boolean {
    return Array.from(this.loadingStates.values()).some(loading => loading)
  }
  
  clearAll(): void {
    this.loadingStates.clear()
  }
}

// 导出全局实例
export const pageLoadingManager = new PageLoadingManager()