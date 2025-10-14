import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CollectionInfo, CollectionDetail, DouyinVideoInfo } from '@/types/collection'

// 表单数据类型定义
interface BiliFormData {
  cookie: string
  upMid: string
}

interface DouyinFormData {
  cookie: string
  max_cursor: number
  counts: number
  authorization: string
}

// 从localStorage获取保存的表单数据
const getSavedBiliForm = (): BiliFormData => {
  try {
    const saved = localStorage.getItem('biliFormData')
    return saved ? JSON.parse(saved) : { cookie: '', upMid: '' }
  } catch {
    return { cookie: '', upMid: '' }
  }
}

const getSavedDouyinForm = (): DouyinFormData => {
  try {
    const saved = localStorage.getItem('douyinFormData')
    return saved ? JSON.parse(saved) : { cookie: '', max_cursor: 0, counts: 20, authorization: '' }
  } catch {
    return { cookie: '', max_cursor: 0, counts: 20, authorization: '' }
  }
}

export const useCollectionStore = defineStore('collection', () => {
  const collections = ref<CollectionInfo[]>([])
  const collectionDetails = ref<CollectionDetail[]>([])
  const douyinVideos = ref<DouyinVideoInfo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)
  
  // 表单数据状态
  const biliFormData = ref<BiliFormData>(getSavedBiliForm())
  const douyinFormData = ref<DouyinFormData>(getSavedDouyinForm())

  const setCollections = (data: CollectionInfo[]) => {
    collections.value = data
  }

  const setCollectionDetails = (data: CollectionDetail[]) => {
    collectionDetails.value = data
  }

  const setDouyinVideos = (data: DouyinVideoInfo[]) => {
    douyinVideos.value = data
  }

  const setLoading = (status: boolean) => {
    loading.value = status
  }

  const setError = (message: string | null) => {
    error.value = message
  }

  const clearError = () => {
    error.value = null
  }

  // 表单数据操作方法
  const setBiliFormData = (data: Partial<BiliFormData>) => {
    biliFormData.value = { ...biliFormData.value, ...data }
    // 保存到localStorage
    localStorage.setItem('biliFormData', JSON.stringify(biliFormData.value))
  }

  const setDouyinFormData = (data: Partial<DouyinFormData>) => {
    douyinFormData.value = { ...douyinFormData.value, ...data }
    // 保存到localStorage
    localStorage.setItem('douyinFormData', JSON.stringify(douyinFormData.value))
  }

  const clearBiliFormData = () => {
    biliFormData.value = { cookie: '', upMid: '' }
    localStorage.removeItem('biliFormData')
  }

  const clearDouyinFormData = () => {
    douyinFormData.value = { cookie: '', max_cursor: 0, counts: 20, authorization: '' }
    localStorage.removeItem('douyinFormData')
  }

  const clearAll = () => {
    collections.value = []
    collectionDetails.value = []
    douyinVideos.value = []
    error.value = null
  }

  return {
    collections,
    collectionDetails,
    douyinVideos,
    loading,
    error,
    biliFormData,
    douyinFormData,
    setCollections,
    setCollectionDetails,
    setDouyinVideos,
    setLoading,
    setError,
    clearError,
    setBiliFormData,
    setDouyinFormData,
    clearBiliFormData,
    clearDouyinFormData,
    clearAll
  }
})