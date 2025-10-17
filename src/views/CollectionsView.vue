<template>
  <div class="collections-container">
    <div class="header">
      <el-button 
        type="primary" 
        @click="goBack"
        :icon="ArrowLeft"
        size="large"
      >
        返回
      </el-button>
      <h1>我的收藏内容</h1>
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
      <el-skeleton :rows="6" animated />
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
      v-else-if="!hasAnyData"
      description="暂无收藏内容，请先在首页获取数据"
      :image-size="200"
    >
      <el-button type="primary" @click="goBack">返回首页</el-button>
    </el-empty>
    
    <!-- 内容展示区域 -->
    <div v-else class="content-sections">
      <!-- B站收藏夹区域 -->
      <div v-if="collectionDetails.length > 0" class="platform-section bilibili-section">
        <div class="section-header">
          <div class="platform-badge bilibili-badge">
            <el-icon class="platform-icon"><VideoPlay /></el-icon>
            <span class="platform-name">哔哩哔哩收藏夹</span>
            <el-tag type="primary" size="small">{{ collectionDetails.length }} 个收藏夹</el-tag>
          </div>
        </div>
        
        <div class="collections-grid">
          <el-card 
            v-for="collection in collectionDetails" 
            :key="collection.collectionTitle"
            class="collection-card bilibili-card"
            shadow="hover"
            @click="goToCollectionDetail(collection)"
          >
            <div class="collection-cover">
              <img
                :src="getImageUrl(collection.collectionCover) || defaultCover"
                :alt="collection.collectionTitle"
                @error="handleImageError"
                @load="handleImageLoad"
                referrerpolicy="no-referrer"
                loading="lazy"
              />
              <div class="collection-overlay">
                <el-icon class="play-icon"><VideoPlay /></el-icon>
              </div>
              <div class="collection-badge">
                <el-tag size="small" type="primary">
                  {{ collection.videoInfoList?.length || 0 }} 个视频
                </el-tag>
              </div>
              <div class="platform-indicator bilibili-indicator">
                <el-icon><VideoPlay /></el-icon>
              </div>
            </div>
            
            <div class="collection-info">
              <h3 class="collection-title" :title="collection.collectionTitle">
                {{ collection.collectionTitle }}
              </h3>
              <p class="collection-meta">
                <el-icon><Collection /></el-icon>
                <span>{{ collection.videoInfoList?.length || 0 }} 个视频</span>
                <el-tag size="mini" type="primary" class="platform-tag">B站</el-tag>
              </p>
            </div>
          </el-card>
        </div>
      </div>
      
      <!-- 抖音收藏视频区域 -->
      <div v-if="douyinVideos.length > 0" class="platform-section douyin-section">
        <div class="section-header">
          <div class="platform-badge douyin-badge">
            <el-icon class="platform-icon"><Star /></el-icon>
            <span class="platform-name">抖音收藏视频</span>
            <el-tag type="warning" size="small">{{ douyinVideos.length }} 个视频</el-tag>
          </div>
        </div>
        
        <div class="videos-grid">
          <el-card 
            v-for="(video, index) in douyinVideos" 
            :key="`douyin-${index}`"
            class="video-card douyin-card"
            shadow="hover"
            @click="openVideoLink(video.link)"
          >
            <div class="video-cover">
              <img
                :src="getImageUrl(video.cover) || defaultCover"
                :alt="video.title"
                @error="handleImageError"
                @load="handleImageLoad"
                referrerpolicy="no-referrer"
                loading="lazy"
              />
              <div class="video-overlay">
                <el-icon class="play-icon"><VideoPlay /></el-icon>
              </div>
              <div class="platform-indicator douyin-indicator">
                <el-icon><Star /></el-icon>
              </div>
            </div>
            
            <div class="video-info">
              <h3 class="video-title" :title="video.title">
                {{ video.title }}
              </h3>
              <p class="video-meta">
                <el-icon><VideoPlay /></el-icon>
                <span>抖音视频</span>
                <el-tag size="mini" type="warning" class="platform-tag">抖音</el-tag>
              </p>
            </div>
          </el-card>
        </div>
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
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { ArrowLeft, VideoPlay, Collection, Refresh, Star } from '@element-plus/icons-vue'
import { ElMessage, ElNotification } from 'element-plus'
import { useCollectionStore } from '@/stores/collection'
import type { CollectionDetail, DouyinVideoInfo } from '@/types/collection'

const router = useRouter()
const route = useRoute()
const collectionStore = useCollectionStore()

// 状态管理
const refreshing = ref(false)
const isOnline = ref(navigator.onLine)
const defaultCover = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEyMCIgdmlld0JveD0iMCAwIDIwMCAxMjAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIyMDAiIGhlaWdodD0iMTIwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik04MCA0MEw5MCA1MEw4MCA2MEw3MCA1MEw4MCA0MFoiIGZpbGw9IiNEREREREQiLz4KPHN2Zz4K'

// 计算属性
const loading = computed(() => collectionStore.loading)
const error = computed(() => collectionStore.error)
const collectionDetails = computed(() => collectionStore.collectionDetails)
const douyinVideos = computed(() => collectionStore.douyinVideos)
const hasAnyData = computed(() => collectionDetails.value.length > 0 || douyinVideos.value.length > 0)

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
  
  // 检查store中是否有数据
  console.log('CollectionsView: B站收藏夹数据', collectionDetails.value.length, '个')
  console.log('CollectionsView: 抖音收藏视频数据', douyinVideos.value.length, '个')
  
  // 处理从首页传递的抖音数据
  const douyinDataStr = route.query.douyinData as string
  if (douyinDataStr && douyinVideos.value.length === 0) {
    try {
      const douyinData = JSON.parse(douyinDataStr)
      collectionStore.setDouyinVideos(douyinData)
      console.log('从路由参数加载抖音数据:', douyinData.length, '个视频')
    } catch (err) {
      console.error('解析抖音数据失败:', err)
    }
  }
})

onUnmounted(() => {
  window.removeEventListener('online', handleOnline)
  window.removeEventListener('offline', handleOffline)
})

// 返回首页
const goBack = () => {
  router.push('/')
}

// 清除错误
const clearError = () => {
  collectionStore.clearError()
}

// 重试加载数据
const retryLoad = async () => {
  try {
    // 使用正确的方法名，fetchCollections改为setCollections
    await import('@/api/collection').then(api => {
      return api.getBiliUserInfo({
        cookie: collectionStore.biliFormData.cookie,
        upMid: collectionStore.biliFormData.upMid
      });
    }).then((result: any) => {
      collectionStore.setCollections(result.collectionInfo || [])
    })
    
    ElNotification({
      title: '加载成功',
      message: `成功获取到收藏内容`,
      type: 'success',
      duration: 3000
    })
  } catch (err: any) {
    console.error('重新获取收藏内容失败:', err)
    ElMessage.error('重新获取失败，请稍后重试')
  }
}

// 刷新数据
const refreshData = async () => {
  if (refreshing.value) return
  
  refreshing.value = true
  
  try {
    // 使用正确的方法名，fetchCollections改为API调用和setCollections
    await import('@/api/collection').then(api => {
      return api.getBiliUserInfo({
        cookie: collectionStore.biliFormData.cookie,
        upMid: collectionStore.biliFormData.upMid
      });
    }).then((result: any) => {
      collectionStore.setCollections(result.collectionInfo || [])
    })
    
    ElMessage.success('刷新成功')
  } catch (err: any) {
    console.error('刷新失败:', err)
    ElMessage.error('刷新失败，请稍后重试')
  } finally {
    refreshing.value = false
  }
}

// 查看B站收藏夹详情
const goToCollectionDetail = (collection: CollectionDetail) => {
  if (!isOnline.value) {
    ElMessage.warning('网络连接已断开，无法查看详情')
    return
  }
  
  const encodedTitle = encodeURIComponent(collection.collectionTitle)
  router.push(`/collection/${encodedTitle}`)
}

// 打开抖音视频链接
const openVideoLink = (link: string) => {
  if (!isOnline.value) {
    ElMessage.warning('网络连接已断开，无法打开视频')
    return
  }
  
  // 使用no-referrer策略打开链接，避免防盗链机制
  const a = document.createElement('a')
  a.href = link
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
}

// 处理图片加载错误
const handleImageError = (event: Event) => {
  const img = event.target as HTMLImageElement
  console.error('封面加载失败:', img.src)
  img.src = defaultCover
}

// 处理图片加载成功
const handleImageLoad = (event: Event) => {
  const img = event.target as HTMLImageElement
  img.style.opacity = '1'
}

// 处理图片URL
const getImageUrl = (url: string) => {
  if (!url) return defaultCover
  return url
}
</script>

<style scoped>
.collections-container {
  padding: 20px;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
  background-color: #f5f7fa;
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

.header h1 {
  margin: 0;
  color: #303133;
  font-size: 28px;
  font-weight: 600;
  flex: 1;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.loading-container {
  margin-top: 20px;
}

.content-sections {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.platform-section {
  background: white;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}

.section-header {
  margin-bottom: 24px;
}

.platform-badge {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 600;
  font-size: 16px;
}

.bilibili-badge {
  background: linear-gradient(135deg, #00a1d6 0%, #0084c7 100%);
  color: white;
}

.douyin-badge {
  background: linear-gradient(135deg, #fe2c55 0%, #ff6b35 100%);
  color: white;
}

.platform-icon {
  font-size: 20px;
}

.platform-name {
  flex: 1;
}

.collections-grid, .videos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.collection-card, .video-card {
  cursor: pointer;
  transition: all 0.3s ease;
  border-radius: 12px;
  overflow: hidden;
  position: relative;
  border: 2px solid transparent;
}

.collection-card:hover, .video-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
}

.bilibili-card:hover {
  border-color: #00a1d6;
}

.douyin-card:hover {
  border-color: #fe2c55;
}

.collection-cover, .video-cover {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  background: #f5f5f5;
}

.collection-cover img, .video-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  opacity: 0;
}

.collection-card:hover .collection-cover img,
.video-card:hover .video-cover img {
  transform: scale(1.05);
}

.collection-overlay, .video-overlay {
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

.collection-card:hover .collection-overlay,
.video-card:hover .video-overlay {
  opacity: 1;
}

.play-icon {
  font-size: 48px;
  color: white;
}

.collection-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  z-index: 2;
}

.platform-indicator {
  position: absolute;
  top: 10px;
  left: 10px;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 16px;
  z-index: 2;
}

.bilibili-indicator {
  background: #00a1d6;
}

.douyin-indicator {
  background: #fe2c55;
}

.collection-info, .video-info {
  padding: 16px;
}

.collection-title, .video-title {
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

.collection-meta, .video-meta {
  margin: 0;
  display: flex;
  align-items: center;
  gap: 8px;
  color: #909399;
  font-size: 14px;
}

.platform-tag {
  margin-left: auto;
}

.bilibili-section {
  border-left: 4px solid #00a1d6;
}

.douyin-section {
  border-left: 4px solid #fe2c55;
}

@media (max-width: 768px) {
  .collections-container {
    padding: 15px;
  }
  
  .header {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .header h1 {
    font-size: 24px;
  }
  
  .collections-grid, .videos-grid {
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 15px;
  }
  
  .platform-section {
    padding: 16px;
  }
  
  .content-sections {
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .collections-grid, .videos-grid {
    grid-template-columns: 1fr;
  }
  
  .header-actions {
    width: 100%;
    justify-content: flex-end;
  }
  
  .platform-badge {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
}
</style>