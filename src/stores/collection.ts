import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { CollectionInfo, CollectionDetail, DouyinVideoInfo } from '@/types/collection'

export const useCollectionStore = defineStore('collection', () => {
  const collections = ref<CollectionInfo[]>([])
  const collectionDetails = ref<CollectionDetail[]>([])
  const douyinVideos = ref<DouyinVideoInfo[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

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
    setCollections,
    setCollectionDetails,
    setDouyinVideos,
    setLoading,
    setError,
    clearError,
    clearAll
  }
})