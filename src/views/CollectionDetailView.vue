<template>
  <div class="collection-detail-container">
    <div class="header">
      <el-button 
        type="primary" 
        @click="goBack"
        :icon="ArrowLeft"
        size="large"
      >
        返回
      </el-button>
      <h1 class="collection-title">{{ collectionTitle }}</h1>
      <div class="header-actions">
        <el-button 
          type="default" 
          @click="refreshData"
          :loading="refreshing"
          :icon="Refresh"
        >
          {{ refreshing ? '刷新中...' : '刷新' }}
        </el-button>
      </div>
    </div>
    
    <!-- 加载状态 -->
    <div v-if="loading && !refreshing" class="loading-container">
      <el-skeleton :rows="8" animated />
    </div>
    
    <!-- 错误提示 -->
    <el-alert
      v-else-if="error"
      :title="error"
      type="error"
      :closable="true"
      @close="clearError"
      style="margin-bottom: 20px;"
    >
      <template #default>
        <p>{{ error }}</p>
        <el-button 
          type="primary" 
          size="small" 
          @click="retryLoad"
          style="margin-top: 10px;"
        >
          重试
        </el-button>
      </template>
    </el-alert>
    
    <!-- 空数据提示 -->
    <el-empty 
      v-else-if="!videos.length"
      description="该收藏夹暂无视频"
      :image-size="200"
    >
      <el-button type="primary" @click="retryLoad">重新获取</el-button>
    </el-empty>
    
    <!-- 视频列表 -->
    <div v-else>
      <!-- 统计信息 -->
      <div class="stats-bar">
        <div class="stats-info">
          <el-icon><VideoPlay /></el-icon>
          <span>共 {{ videos.length }} 个视频</span>
        </div>
        <div class="view-options">
          <el-button-group>
            <el-button 
              :type="viewMode === 'grid' ? 'primary' : 'default'"
              @click="viewMode = 'grid'"
              :icon="Grid"
              size="small"
            >
              网格
            </el-button>
            <el-button 
              :type="viewMode === 'list' ? 'primary' : 'default'"
              @click="viewMode = 'list'"
              :icon="List"
              size="small"
            >
              列表
            </el-button>
          </el-button-group>
        </div>
      </div>
      
      <!-- 网格视图 -->
      <div v-if="viewMode === 'grid'" class="videos-grid">
        <el-card 
          v-for="video in videos" 
          :key="video.bvid"
          class="video-card"
          shadow="hover"
          @click="openVideo(video)"
        >
          <div class="video-cover">
            <img 
              :src="getImageUrl(video.pic || video.cover) || defaultCover" 
              :alt="video.title"
              @error="handleImageError"
              @load="handleImageLoad"
              referrerpolicy="no-referrer"
            />
            <div class="video-overlay">
              <el-icon class="play-icon"><VideoPlay /></el-icon>
            </div>
            <div class="video-duration" v-if="video.duration">
              {{ formatDuration(video.duration) }}
            </div>
          </div>
          
          <div class="video-info">
            <h3 class="video-title" :title="video.title">
              {{ video.title }}
            </h3>
            <p class="video-meta">
              <el-icon><User /></el-icon>
              <span>{{ video.owner?.name || '未知UP主' }}</span>
            </p>
            <div class="video-stats">
              <span class="stat-item">
                <el-icon><View /></el-icon>
                {{ formatNumber(video.stat?.view || 0) }}
              </span>
              <span class="stat-item">
                <el-icon><ChatDotRound /></el-icon>
                {{ formatNumber(video.stat?.danmaku || 0) }}
              </span>
            </div>
          </div>
        </el-card>
      </div>
      
      <!-- 列表视图 -->
      <div v-else class="videos-list">
        <el-card 
          v-for="video in videos" 
          :key="video.bvid"
          class="video-list-item"
          shadow="hover"
          @click="openVideo(video)"
        >
          <div class="list-content">
            <div class="list-cover">
              <img
                :src="getImageUrl(video.pic || video.cover) || defaultCover"
                :alt="video.title"
                @error="handleImageError"
                @load="handleImageLoad"
                referrerpolicy="no-referrer"
              />
              <div class="list-overlay">
                <el-icon class="play-icon"><VideoPlay /></el-icon>
              </div>
              <div class="list-duration" v-if="video.duration">
                {{ formatDuration(video.duration) }}
              </div>
            </div>
            
            <div class="list-info">
              <h3 class="list-title" :title="video.title">
                {{ video.title }}
              </h3>
              <p class="list-meta">
                <span class="meta-item">
                  <el-icon><User /></el-icon>
                  {{ video.owner?.name || '未知UP主' }}
                </span>
                <span class="meta-item">
                  <el-icon><View /></el-icon>
                  {{ formatNumber(video.stat?.view || 0) }} 播放
                </span>
                <span class="meta-item">
                  <el-icon><ChatDotRound /></el-icon>
                  {{ formatNumber(video.stat?.danmaku || 0) }} 弹幕
                </span>
              </p>
              <p class="list-desc" :title="video.desc">
                {{ video.desc || '暂无简介' }}
              </p>
            </div>
          </div>
        </el-card>
      </div>
    </div>
    
    <!-- 网络状态提示 -->
    <el-alert
      v-if="!isOnline"
      title="网络连接已断开"
      type="warning"
      :closable="false"
      style="position: fixed; top: 20px; right: 20px; z-index: 9999;"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { 
  ArrowLeft, 
  VideoPlay, 
  User, 
  View, 
  ChatDotRound, 
  Grid, 
  List,
  Refresh 
} from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import { useCollectionStore } from '@/stores/collection'
import { getBiliCollectionInfo } from '@/api/collection'
import { handleError } from '@/utils/errorHandler'
import { withLoading } from '@/utils/loading'

const router = useRouter()
const route = useRoute()
const collectionStore = useCollectionStore()

// 状态管理
const refreshing = ref(false)
const isOnline = ref(navigator.onLine)
const viewMode = ref<'grid' | 'list'>('grid')
const collectionTitle = ref('')
const defaultCover = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA0MEw5MCA1MEw4MCA2MEw3MCA1MEw4MCA0MFoiIGZpbGw9IiNEREREREQiLz4KPHN2Zz4K'

// 计算属性
const loading = computed(() => collectionStore.loading)
const error = computed(() => collectionStore.error)
const videos = computed(() => {
  const details = collectionStore.collectionDetails
  const targetCollection = details.find(
    collection => collection.collectionTitle === collectionTitle.value
  )
  return targetCollection?.videoInfoList || []
})

// 网络状态监听
const handleOnline = () => {
  isOnline.value = true
  ElMessage.success('网络连接已恢复')
}

const handleOffline = () => {
  isOnline.value = false
  ElMessage.warning('网络连接已断开')
}

onMounted(() => {
  window.addEventListener('online', handleOnline)
  window.addEventListener('offline', handleOffline)
  
  // 从路由参数获取收藏夹标题
  const encodedTitle = route.params.id as string
  collectionTitle.value = decodeURIComponent(encodedTitle)
  
  // 如果没有数据，尝试重新获取
  if (!videos.value.length && route.query.cookie && route.query.upMid) {
    retryLoad()
  }
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

// 监听路由变化
watch(() => route.params.id, (newId) => {
  if (newId) {
    collectionTitle.value = decodeURIComponent(newId as string)
  }
})

// 返回上一页
const goBack = () => {
  router.back()
}

// 清除错误
const clearError = () => {
  collectionStore.clearError()
}

// 重试加载数据
const retryLoad = async () => {
  const cookie = route.query.cookie as string
  const upMid = route.query.upMid as string
  
  if (!cookie || !upMid) {
    ElMessage.error('缺少必要参数，请返回重新输入')
    goBack()
    return
  }
  
  try {
    await withLoading(async () => {
      const result = await getBiliCollectionInfo({ cookie, upMid })
      collectionStore.setCollectionDetails(result.collectionDetails || [])
      
      ElNotification({
        title: '加载成功',
        message: `成功获取到收藏夹详情`,
        type: 'success',
        duration: 3000
      })
    }, {
      text: '正在重新获取收藏夹详情...'
    })
  } catch (err: any) {
    console.error('重新获取收藏夹详情失败:', err)
    handleError(err, true)
  }
}

// 刷新数据
const refreshData = async () => {
  if (refreshing.value) return
  
  const cookie = route.query.cookie as string
  const upMid = route.query.upMid as string
  
  if (!cookie || !upMid) {
    ElMessage.error('缺少必要参数，无法刷新')
    return
  }
  
  refreshing.value = true
  
  try {
    const result = await getBiliCollectionInfo({ cookie, upMid })
    collectionStore.setCollectionDetails(result.collectionDetails || [])
    
    ElMessage.success('刷新成功')
  } catch (err: any) {
    console.error('刷新失败:', err)
    handleError(err)
  } finally {
    refreshing.value = false
  }
}

// 打开视频
const openVideo = (video: any) => {
  if (!isOnline.value) {
    ElMessage.warning('网络连接已断开，无法打开视频')
    return
  }
  
  // 优先使用bvid，如果没有则尝试从link提取
  let bvid = video.bvid
  if (!bvid && video.link) {
    const match = video.link.match(/\/video\/(BV[a-zA-Z0-9]+)/)
    bvid = match ? match[1] : null
  }
  
  if (!bvid) {
    ElMessage.error('视频链接无效：无法获取视频ID')
    console.error('视频数据:', video)
    return
  }
  
  try {
    const videoUrl = `https://www.bilibili.com/video/${bvid}`
    window.open(videoUrl, '_blank', 'noopener,noreferrer')
    
    ElMessage.success('正在新窗口打开视频')
  } catch (err) {
    console.error('打开视频失败:', err)
    ElMessage.error('打开视频失败，请稍后重试')
  }
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.error('视频封面加载失败:', img.src)
  img.src = defaultCover
}

// 处理图片加载成功
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.log('视频封面加载成功:', img.src)
  img.style.opacity = '1'
}

// 格式化时长
const formatDuration = (seconds: number) => {
  if (!seconds) return '00:00'
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  const secs = seconds % 60
  
  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  } else {
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
}

// 格式化数字
const formatNumber = (num: number) => {
  if (num >= 100000000) {
    return (num / 100000000).toFixed(1) + '亿'
  } else if (num >= 10000) {
    return (num / 10000).toFixed(1) + '万'
  } else {
    return num.toString()
  }
}

// 处理图片URL，直接使用后端返回的链接
const getImageUrl = (url: string) => {
  if (!url) return defaultCover
  
  // 直接返回后端提供的封面链接
  return url
}
</script>

<style scoped>
.collection-detail-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
  min-height: 100vh;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
  flex-wrap: wrap;
  gap: 15px;
}

.collection-title {
  margin: 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.loading-container {
  margin-top: 20px;
}

.stats-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding: 15px 20px;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
  gap: 15px;
}

.stats-info {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #606266;
  font-size: 16px;
}

.view-options {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* 网格视图样式 */
.videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
}

.video-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
}

.video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.video-cover {
  position: relative;
  width: 100%;
  height: 160px;
  overflow: hidden;
  background: #f5f5f5;
}

.video-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  opacity: 0;
}

.video-card:hover .video-cover img {
  transform: scale(1.05);
}

.video-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-card:hover .video-overlay {
  opacity: 1;
}

.play-icon {
  font-size: 36px;
  color: white;
}

.video-duration {
  position: absolute;
  bottom: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 12px;
}

.video-info {
  padding: 12px;
}

.video-title {
  margin: 0 0 8px 0;
  font-size: 14px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  margin: 0 0 8px 0;
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 12px;
}

.video-stats {
  display: flex;
  gap: 12px;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 12px;
}

/* 列表视图样式 */
.videos-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.video-list-item {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 8px;
}

.video-list-item:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.list-content {
  display: flex;
  gap: 15px;
  padding: 15px;
}

.list-cover {
  position: relative;
  width: 160px;
  height: 90px;
  flex-shrink: 0;
  overflow: hidden;
  border-radius: 6px;
  background: #f5f5f5;
}

.list-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  opacity: 0;
}

.list-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.video-list-item:hover .list-overlay {
  opacity: 1;
}

.list-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  background: rgba(0, 0, 0, 0.8);
  color: white;
  padding: 2px 4px;
  border-radius: 3px;
  font-size: 11px;
}

.list-info {
  flex: 1;
  min-width: 0;
}

.list-title {
  margin: 0 0 8px 0;
  font-size: 16px;
  font-weight: 600;
  color: #303133;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.list-meta {
  margin: 0 0 8px 0;
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: #909399;
  font-size: 13px;
}

.list-desc {
  margin: 0;
  color: #606266;
  font-size: 14px;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@media (max-width: 768px) {
  .collection-detail-container {
    padding: 15px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .collection-title {
    font-size: 24px;
  }
  
  .stats-bar {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 15px;
  }
  
  .list-content {
    flex-direction: column;
    gap: 10px;
  }
  
  .list-cover {
    width: 100%;
    height: 120px;
  }
}

@media (max-width: 480px) {
  .videos-grid {
    grid-template-columns: 1fr;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .view-options {
    width: 100%;
    justify-content: center;
  }
}
</style>