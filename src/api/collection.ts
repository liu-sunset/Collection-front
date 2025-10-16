import axios from 'axios'
import type { 
  ApiResponse, 
  UserCollectionResponse, 
  CollectionDetailResponse,
  GetUserInfoParams,
  GetCollectionInfoParams,
  VideoInfoExtended,
  DouyinCollectionParams,
  DouyinVideoInfo
} from '@/types/collection'
import { handleError, ErrorType } from '@/utils/errorHandler'
import { ElMessage } from 'element-plus'
import { logInfo, logError } from '@/utils/logger'

// 创建axios实例
const api = axios.create({
  baseURL: '',  // 使用空字符串，让Vite代理处理请求
  timeout: 30000, // 增加超时时间到30秒
  headers: {
    'Content-Type': 'application/json'
  }
})

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    logInfo('发送API请求', { 
      url: config.url,
      method: config.method,
      params: config.params
    })
    return config
  },
  (error) => {
    logError('API请求错误', error)
    handleError(error)
    return Promise.reject(error)
  }
)

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    logInfo('收到API响应', { 
      url: response.config.url,
      status: response.status,
      statusText: response.statusText
    })
    
    // 检查业务状态码
    if (response.data && response.data.code !== undefined) {
      if (response.data.code !== 1) {
        const errorMessage = response.data.msg || '请求失败'
        logError('API业务错误', { 
          code: response.data.code,
          message: errorMessage,
          url: response.config.url
        })
        ElMessage.error(errorMessage)
        throw new Error(errorMessage)
      }
    }
    
    return response
  },
  (error) => {
    console.error('响应错误:', error)
    handleError(error, true) // 显示通知
    return Promise.reject(error)
  }
)

// 获取用户收藏夹信息
export const getBiliUserInfo = async (params: GetUserInfoParams): Promise<UserCollectionResponse> => {
  try {
    const response = await api.post<ApiResponse<UserCollectionResponse>>('/getBiliUserInfo', params)
    
    if (!response.data || !response.data.data) {
      throw new Error('服务器返回数据格式错误')
    }
    
    return response.data.data
  } catch (error: any) {
    // 特殊处理一些业务错误
    if (error.response?.status === 401) {
      throw new Error('Cookie已过期或无效，请重新获取')
    } else if (error.response?.status === 404) {
      throw new Error('用户不存在或收藏夹为空')
    } else if (error.message?.includes('timeout')) {
      throw new Error('请求超时，请检查网络连接或稍后重试')
    }
    
    throw error
  }
}

// 获取抖音收藏视频信息
export const getDouyinCollection = async (params: DouyinCollectionParams): Promise<DouyinVideoInfo[]> => {
  try {
    const response = await api.post<ApiResponse<DouyinVideoInfo[]>>('/getdouallcollection', params)
    
    if (!response.data || !response.data.data) {
      throw new Error('服务器返回数据格式错误')
    }
    
    return response.data.data
  } catch (error: any) {
    // 特殊处理一些业务错误
    if (error.response?.status === 401) {
      throw new Error('Cookie已过期或无效，请重新获取')
    } else if (error.response?.status === 404) {
      throw new Error('收藏视频不存在或已被删除')
    } else if (error.message?.includes('timeout')) {
      throw new Error('请求超时，请检查网络连接或稍后重试')
    }
    
    throw error
  }
}

// 从B站视频链接中提取bvid
const extractBvidFromLink = (link: string): string | null => {
  try {
    // 匹配 https://www.bilibili.com/video/BV... 格式
    const match = link.match(/\/video\/(BV[a-zA-Z0-9]+)/)
    return match ? match[1] : null
  } catch (error) {
    console.error('提取bvid失败:', error)
    return null
  }
}

// 处理视频数据，添加bvid和pic字段
const processVideoData = (videoList: any[]): VideoInfoExtended[] => {
  return videoList.map(video => ({
    ...video,
    bvid: extractBvidFromLink(video.link),
    pic: video.cover // 添加pic字段作为cover的别名
  }))
}

// 获取收藏夹详细信息
export const getBiliCollectionInfo = async (params: GetCollectionInfoParams): Promise<CollectionDetailResponse> => {
  try {
    const response = await api.post<ApiResponse<CollectionDetailResponse>>('/getBiliCollectionInfo', params)
    
    if (!response.data || !response.data.data) {
      throw new Error('服务器返回数据格式错误')
    }
    
    // 处理返回的数据，为每个视频添加bvid字段
    const processedData = response.data.data.map(collection => ({
      ...collection,
      videoInfoList: processVideoData(collection.videoInfoList || [])
    }))
    
    return processedData
  } catch (error: any) {
    // 特殊处理一些业务错误
    if (error.response?.status === 401) {
      throw new Error('Cookie已过期或无效，请重新获取')
    } else if (error.response?.status === 404) {
      throw new Error('收藏夹不存在或已被删除')
    } else if (error.message?.includes('timeout')) {
      throw new Error('请求超时，请检查网络连接或稍后重试')
    }
    
    throw error
  }
}