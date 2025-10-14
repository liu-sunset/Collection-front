<template>
  <div class="home-container">
    <!-- 页面标题区域 -->
    <div class="header-section">
      <h1 class="main-title">收藏夹查看器</h1>
      <p class="subtitle">轻松管理您的B站和抖音收藏内容</p>
    </div>

    <!-- 主要内容区域 -->
    <div class="content-wrapper">
      <el-row :gutter="24" class="cards-row">
        <!-- B站收藏夹卡片 -->
        <el-col :xs="24" :md="12" class="card-col">
          <el-card class="platform-card bilibili-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="platform-icon bilibili-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M17.813 4.653h.854c1.51.054 2.769.578 3.773 1.574 1.004.995 1.524 2.249 1.56 3.76v7.36c-.036 1.51-.556 2.769-1.56 3.773s-2.262 1.524-3.773 1.56H5.333c-1.51-.036-2.769-.556-3.773-1.56S.036 18.858 0 17.347v-7.36c.036-1.511.556-2.765 1.56-3.76 1.004-.996 2.262-1.52 3.773-1.574h.774l-1.174-1.12a1.234 1.234 0 0 1-.373-.906c0-.356.124-.658.373-.907l.027-.027c.267-.249.573-.373.92-.373.347 0 .653.124.92.373L9.653 4.44c.071.071.134.142.187.213h4.267a.836.836 0 0 1 .16-.213l2.853-2.747c.267-.249.573-.373.92-.373.347 0 .662.151.929.4.267.249.391.551.391.907 0 .356-.124.657-.373.906l-1.174 1.12zM6.4 15.64a.96.96 0 0 0 .96-.96V9.6a.96.96 0 0 0-1.92 0v5.08c0 .53.43.96.96.96zm4.8 0a.96.96 0 0 0 .96-.96V9.6a.96.96 0 0 0-1.92 0v5.08c0 .53.43.96.96.96z"/>
                  </svg>
                </div>
                <div class="platform-info">
                  <h3>B站收藏夹</h3>
                  <span class="platform-desc">查询B站收藏内容</span>
                </div>
              </div>
            </template>
            
            <div class="form-content">
              <el-form 
                ref="biliFormRef" 
                :model="biliForm" 
                :rules="biliRules" 
                label-position="top"
                :disabled="biliLoading"
                class="platform-form"
              >
                <el-form-item label="Cookie" prop="cookie" class="form-item">
                  <el-input
                    v-model="biliForm.cookie"
                    type="textarea"
                    :rows="4"
                    placeholder="请输入完整的B站Cookie信息"
                    :disabled="biliLoading"
                    class="custom-input"
                  />
                  <div class="form-tip">
                    <el-icon><InfoFilled /></el-icon>
                    <span>请从浏览器开发者工具中复制完整的Cookie</span>
                  </div>
                </el-form-item>
                
                <el-form-item label="用户ID" prop="upMid" class="form-item">
                  <el-input
                    v-model="biliForm.upMid"
                    placeholder="请输入B站用户ID"
                    :disabled="biliLoading"
                    clearable
                    class="custom-input"
                  />
                  <div class="form-tip">
                    <el-icon><InfoFilled /></el-icon>
                    <span>可从个人主页URL获取，如：space.bilibili.com/123456</span>
                  </div>
                </el-form-item>
              </el-form>
              
              <!-- 错误提示 -->
              <el-alert
                v-if="biliError"
                :title="biliError"
                type="error"
                :closable="true"
                @close="clearBiliError"
                class="error-alert"
              />
              
              <!-- 使用说明 -->
              <el-collapse v-model="biliActiveCollapse" class="usage-collapse">
                <el-collapse-item title="使用说明" name="1">
                  <div class="usage-guide">
                    <div class="guide-section">
                      <h4>获取Cookie：</h4>
                      <ol>
                        <li>登录B站并按F12打开开发者工具</li>
                        <li>切换到Network标签</li>
                        <li>刷新页面，找到任意请求</li>
                        <li>在请求头中复制Cookie字段</li>
                      </ol>
                    </div>
                    
                    <div class="guide-section">
                      <h4>获取用户ID：</h4>
                      <ol>
                        <li>访问目标用户的B站主页</li>
                        <li>从URL中获取数字ID</li>
                        <li>例如：space.bilibili.com/123456 中的 123456</li>
                      </ol>
                    </div>
                  </div>
                </el-collapse-item>
              </el-collapse>
            </div>
      </el-card>

        </el-col>
        
        <!-- 抖音收藏视频卡片 -->
        <el-col :xs="24" :md="12" class="card-col">
          <el-card class="platform-card douyin-card" shadow="hover">
            <template #header>
              <div class="card-header">
                <div class="platform-icon douyin-icon">
                  <svg viewBox="0 0 24 24" width="24" height="24">
                    <path fill="currentColor" d="M12.53.02C13.84 0 15.14.01 16.44 0c.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z"/>
                  </svg>
                </div>
                <div class="platform-info">
                  <h3>抖音收藏</h3>
                  <span class="platform-desc">查询抖音收藏视频</span>
                </div>
              </div>
            </template>
            
            <div class="form-content">
        
        <el-form 
          ref="douyinFormRef" 
          :model="douyinForm" 
          :rules="douyinRules" 
          label-position="top"
          :disabled="douyinLoading"
          class="platform-form"
        >
          <el-form-item label="Cookie" prop="cookie" class="form-item">
            <el-input
              v-model="douyinForm.cookie"
              type="textarea"
              :rows="3"
              placeholder="请输入抖音Cookie信息"
              :disabled="douyinLoading"
              class="custom-input"
            />
            <div class="form-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>从浏览器开发者工具中复制Cookie</span>
            </div>
          </el-form-item>
          
          <el-row :gutter="16">
            <el-col :span="12">
              <el-form-item label="起始游标" prop="max_cursor" class="form-item">
                <el-input-number
                  v-model="douyinForm.max_cursor"
                  :min="0"
                  :disabled="douyinLoading"
                  placeholder="0"
                  style="width: 100%;"
                  class="custom-input"
                />
                <div class="form-tip">
                  <el-icon><InfoFilled /></el-icon>
                  <span>首次查询设为0</span>
                </div>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="获取数量" prop="counts" class="form-item">
                <el-input-number
                  v-model="douyinForm.counts"
                  :min="1"
                  :max="50"
                  :disabled="douyinLoading"
                  placeholder="20"
                  style="width: 100%;"
                  class="custom-input"
                />
                <div class="form-tip">
                  <el-icon><InfoFilled /></el-icon>
                  <span>建议20个</span>
                </div>
              </el-form-item>
            </el-col>
          </el-row>
          
          <el-form-item label="授权信息" prop="authorization" class="form-item">
            <el-input
              v-model="douyinForm.authorization"
              placeholder="请输入authorization信息"
              :disabled="douyinLoading"
              clearable
              class="custom-input"
            />
            <div class="form-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>从请求头中获取authorization字段</span>
            </div>
          </el-form-item>
          
        </el-form>
        
        <!-- 错误提示 -->
        <el-alert
          v-if="douyinError"
          :title="douyinError"
          type="error"
          :closable="true"
          @close="clearDouyinError"
          class="error-alert"
        />
        
        <!-- 使用说明 -->
        <el-collapse v-model="douyinActiveCollapse" class="usage-collapse">
          <el-collapse-item title="使用说明" name="1">
            <div class="usage-guide">
              <div class="guide-section">
                <h4>获取Cookie和Authorization：</h4>
                <ol>
                  <li>登录抖音网页版并按F12</li>
                  <li>切换到Network标签</li>
                  <li>刷新页面找到相关请求</li>
                  <li>复制Cookie和Authorization字段</li>
                </ol>
              </div>
              
              <div class="guide-section">
                <h4>参数说明：</h4>
                <ul>
                  <li><strong>起始游标：</strong>分页查询起始位置</li>
                  <li><strong>获取数量：</strong>单次获取视频数量</li>
                  <li><strong>授权信息：</strong>身份验证字段</li>
                </ul>
              </div>
            </div>
          </el-collapse-item>
        </el-collapse>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    
    <!-- 统一操作按钮区域 -->
    <div class="action-section">
      <div class="action-container">
        <el-row :gutter="16" justify="center">
          <el-col :span="8">
            <el-button 
              type="primary" 
              size="large"
              :loading="biliLoading"
              @click="handleBiliSubmit"
              :disabled="douyinLoading"
              class="action-button primary-button"
              block
            >
              <el-icon><VideoPlay /></el-icon>
              <span>查询B站收藏</span>
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button 
              type="success" 
              size="large"
              :loading="douyinLoading"
              @click="handleDouyinSubmit"
              :disabled="biliLoading"
              class="action-button success-button"
              block
            >
              <el-icon><VideoPlay /></el-icon>
              <span>查询抖音收藏</span>
            </el-button>
          </el-col>
          <el-col :span="8">
            <el-button 
              size="large"
              @click="clearAllForms"
              :disabled="biliLoading || douyinLoading"
              class="action-button clear-button"
              block
            >
              <el-icon><RefreshLeft /></el-icon>
              <span>清空表单</span>
            </el-button>
          </el-col>
        </el-row>
        
        <!-- 全局错误提示 -->
        <el-alert
          v-if="globalError"
          :title="globalError"
          type="error"
          :closable="true"
          @close="clearGlobalError"
          class="global-error"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { InfoFilled, VideoPlay, RefreshLeft } from '@element-plus/icons-vue'
import type { FormInstance, FormRules } from 'element-plus'
import { getBiliUserInfo, getBiliCollectionInfo, getDouyinCollection } from '@/api/collection'
import { useCollectionStore } from '@/stores/collection'
import { validateCookie, validateUpMid, handleValidationError } from '@/utils/errorHandler'
import { withLoading } from '@/utils/loading'

const router = useRouter()
const collectionStore = useCollectionStore()

// 表单引用
const biliFormRef = ref<FormInstance>()
const douyinFormRef = ref<FormInstance>()
const biliActiveCollapse = ref<string[]>([])
const douyinActiveCollapse = ref<string[]>([])

// 使用store中的表单数据，而不是本地reactive数据
const biliForm = collectionStore.biliFormData
const douyinForm = collectionStore.douyinFormData

// 状态管理
const biliLoading = ref(false)
const douyinLoading = ref(false)
const biliError = ref('')
const douyinError = ref('')
const globalError = ref('')

// 计算属性：是否有任何加载状态
const isLoading = computed(() => biliLoading.value || douyinLoading.value)

// B站表单验证规则
const biliRules: FormRules = {
  cookie: [
    { 
      required: true, 
      message: handleValidationError('cookie', 'required'), 
      trigger: 'blur' 
    },
    { 
      min: 10, 
      message: handleValidationError('cookie', 'minLength'), 
      trigger: 'blur' 
    },
    {
      validator: (rule, value, callback) => {
        if (value && !validateCookie(value)) {
          callback(new Error(handleValidationError('cookie', 'invalid')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ],
  upMid: [
    { 
      required: true, 
      message: handleValidationError('upMid', 'required'), 
      trigger: 'blur' 
    },
    {
      validator: (rule, value, callback) => {
        if (value && !validateUpMid(value)) {
          callback(new Error(handleValidationError('upMid', 'pattern')))
        } else {
          callback()
        }
      },
      trigger: 'blur'
    }
  ]
}

// 抖音表单验证规则
const douyinRules: FormRules = {
  cookie: [
    { 
      required: true, 
      message: '请输入抖音Cookie', 
      trigger: 'blur' 
    },
    { 
      min: 10, 
      message: 'Cookie长度不能少于10个字符', 
      trigger: 'blur' 
    }
  ],
  max_cursor: [
    { 
      required: true, 
      message: '请输入起始游标', 
      trigger: 'blur' 
    }
  ],
  counts: [
    { 
      required: true, 
      message: '请输入获取数量', 
      trigger: 'blur' 
    }
  ],
  authorization: [
    { 
      required: true, 
      message: '请输入授权信息', 
      trigger: 'blur' 
    }
  ]
}

// 计算属性：B站表单是否有效
const isBiliFormValid = computed(() => {
  return biliForm.cookie.trim().length > 0 && 
         biliForm.upMid.trim().length > 0 && 
         validateCookie(biliForm.cookie) && 
         validateUpMid(biliForm.upMid)
})

// 计算属性：抖音表单是否有效
const isDouyinFormValid = computed(() => {
  return douyinForm.cookie.trim().length > 0 && 
         douyinForm.authorization.trim().length > 0 &&
         douyinForm.max_cursor >= 0 &&
         douyinForm.counts > 0
})

// 计算属性：是否有有效输入
const hasValidInput = computed(() => {
  return isBiliFormValid.value || isDouyinFormValid.value
})

// 获取按钮文本
const getButtonText = () => {
  if (isLoading.value) {
    return '获取中...'
  }
  
  const hasBili = isBiliFormValid.value
  const hasDouyin = isDouyinFormValid.value
  
  if (hasBili && hasDouyin) {
    return '获取所有收藏内容'
  } else if (hasBili) {
    return '获取B站收藏夹'
  } else if (hasDouyin) {
    return '获取抖音收藏视频'
  } else {
    return '请填写查询参数'
  }
}

// 清除B站错误
const clearBiliError = () => {
  biliError.value = ''
  collectionStore.clearError()
}

// 清除抖音错误
const clearDouyinError = () => {
  douyinError.value = ''
}

// 清除全局错误
const clearGlobalError = () => {
  globalError.value = ''
  clearBiliError()
  clearDouyinError()
}

// 清空所有表单
const clearAllForms = () => {
  // 重置B站表单
  biliForm.cookie = ''
  biliForm.upMid = ''
  
  // 重置抖音表单
  douyinForm.cookie = ''
  douyinForm.max_cursor = 0
  douyinForm.counts = 20
  douyinForm.authorization = ''
  
  // 清除所有错误
  clearGlobalError()
  
  // 重置表单验证状态
  if (biliFormRef.value) {
    biliFormRef.value.clearValidate()
  }
  if (douyinFormRef.value) {
    douyinFormRef.value.clearValidate()
  }
  
  ElMessage.success('表单已清空')
}

// 统一提交处理
const handleUnifiedSubmit = async () => {
  try {
    clearGlobalError()
    
    const hasBili = isBiliFormValid.value
    const hasDouyin = isDouyinFormValid.value
    
    if (!hasBili && !hasDouyin) {
      ElMessage.error('请至少填写一个平台的查询参数')
      return
    }
    
    // 验证表单
    if (hasBili && biliFormRef.value) {
      const biliValid = await biliFormRef.value.validate().catch(() => false)
      if (!biliValid) {
        ElMessage.error('B站参数验证失败，请检查输入')
        return
      }
    }
    
    if (hasDouyin && douyinFormRef.value) {
      const douyinValid = await douyinFormRef.value.validate().catch(() => false)
      if (!douyinValid) {
        ElMessage.error('抖音参数验证失败，请检查输入')
        return
      }
    }
    
    // 并行执行请求
    const promises = []
    let biliResult = null
    let douyinResult = null
    
    if (hasBili) {
      promises.push(
        (async () => {
          try {
            biliLoading.value = true
            console.log('开始获取B站用户信息...')
            
            const userResult = await getBiliUserInfo({
              cookie: biliForm.cookie.trim(),
              upMid: biliForm.upMid.trim()
            })
            
            console.log('B站用户信息获取成功:', userResult)
            
            // 获取收藏夹详细信息
            const collectionIds = userResult.collectionInfo?.map(item => item.collectionId) || []
            
            if (collectionIds.length > 0) {
              console.log('开始获取B站收藏夹详细信息...')
              const detailResult = await getBiliCollectionInfo({
                collectionIds: collectionIds
              })
              
              console.log('B站收藏夹详细信息获取成功:', detailResult)
              biliResult = { userInfo: userResult, details: detailResult }
            } else {
              biliResult = { userInfo: userResult, details: [] }
            }
            
          } catch (err: any) {
            console.error('获取B站收藏夹失败:', err)
            biliError.value = err.message || '获取B站收藏夹信息失败'
            throw err
          } finally {
            biliLoading.value = false
          }
        })()
      )
    }
    
    if (hasDouyin) {
      promises.push(
        (async () => {
          try {
            douyinLoading.value = true
            console.log('开始获取抖音收藏视频...')
            
            douyinResult = await getDouyinCollection({
              cookie: douyinForm.cookie.trim(),
              max_cursor: douyinForm.max_cursor,
              counts: douyinForm.counts,
              authorization: douyinForm.authorization.trim()
            })
            
            console.log('抖音收藏视频获取成功:', douyinResult)
            
          } catch (err: any) {
            console.error('获取抖音收藏视频失败:', err)
            douyinError.value = err.message || '获取抖音收藏视频失败'
            throw err
          } finally {
            douyinLoading.value = false
          }
        })()
      )
    }
    
    // 等待所有请求完成
    const results = await Promise.allSettled(promises)
    
    // 检查结果
    const hasSuccess = results.some(result => result.status === 'fulfilled')
    const hasError = results.some(result => result.status === 'rejected')
    
    if (hasSuccess) {
      // 存储数据到store
      if (biliResult) {
        collectionStore.setCollections(biliResult.userInfo.collectionInfo || [])
        collectionStore.setCollectionDetails(biliResult.details)
      }
      
      if (douyinResult) {
        collectionStore.setDouyinVideos(douyinResult)
      }
      
      // 显示成功消息
      let successMessage = '获取成功！'
      if (hasBili && hasDouyin) {
        const biliCount = biliResult?.userInfo.collectionInfo?.length || 0
        const douyinCount = douyinResult?.length || 0
        successMessage = `成功获取到 B站${biliCount}个收藏夹，抖音${douyinCount}个收藏视频`
      } else if (hasBili) {
        const biliCount = biliResult?.userInfo.collectionInfo?.length || 0
        successMessage = `成功获取到 ${biliCount} 个B站收藏夹`
      } else if (hasDouyin) {
        const douyinCount = douyinResult?.length || 0
        successMessage = `成功获取到 ${douyinCount} 个抖音收藏视频`
      }
      
      ElNotification({
        title: '获取成功',
        message: successMessage,
        type: 'success',
        duration: 3000
      })
      
      // 跳转到收藏夹列表页面
      await router.push({
        name: 'collections',
        query: {
          ...(hasBili ? { 
            cookie: biliForm.cookie.trim(),
            upMid: biliForm.upMid.trim()
          } : {}),
          ...(hasDouyin ? {
            douyinData: JSON.stringify(douyinResult)
          } : {})
        }
      })
    }
    
    if (hasError && !hasSuccess) {
      // 所有请求都失败了
      globalError.value = '获取收藏内容失败，请检查输入参数和网络连接'
    } else if (hasError) {
      // 部分请求失败
      ElMessage.warning('部分内容获取失败，请查看具体错误信息')
    }
    
  } catch (err: any) {
    console.error('统一提交处理失败:', err)
    globalError.value = err.message || '操作失败，请重试'
  }
}

// 提交B站表单
const handleBiliSubmit = async () => {
  if (!biliFormRef.value) return
  
  try {
    // 表单验证
    const valid = await biliFormRef.value.validate()
    if (!valid) return
    
    clearBiliError()
    
    // 使用加载包装器
    await withLoading(async () => {
      biliLoading.value = true
      
      try {
        console.log('开始获取B站用户信息...')
        const result = await getBiliUserInfo({
          cookie: biliForm.cookie.trim(),
          upMid: biliForm.upMid.trim()
        })
        
        console.log('B站用户信息获取成功:', result)
        
        // 存储用户收藏夹基本信息到store
        collectionStore.setCollections(result.collectionInfo || [])
        
        // 获取所有收藏夹的详细信息
        const collectionIds = result.collectionInfo?.map(item => item.collectionId) || []
        console.log('提取的收藏夹ID:', collectionIds)
        
        if (collectionIds.length > 0) {
          console.log('开始获取收藏夹详细信息...')
          const detailResult = await getBiliCollectionInfo({
            collectionIds: collectionIds
          })
          
          console.log('收藏夹详细信息获取成功:', detailResult)
          
          // 存储收藏夹详细信息到store
          collectionStore.setCollectionDetails(detailResult)
        }
        
        // 显示成功消息
        ElNotification({
          title: '获取成功',
          message: `成功获取到 ${result.collectionInfo?.length || 0} 个收藏夹的详细信息`,
          type: 'success',
          duration: 3000
        })
        
        // 跳转到收藏夹列表页面
        await router.push({
          name: 'collections',
          query: {
            cookie: biliForm.cookie.trim(),
            upMid: biliForm.upMid.trim()
          }
        })
        
      } catch (err: any) {
        console.error('获取B站收藏夹失败:', err)
        biliError.value = err.message || '获取收藏夹信息失败，请检查输入信息'
        collectionStore.setError(biliError.value)
      }
    }, {
      text: '正在获取B站收藏夹信息...',
      background: 'rgba(0, 0, 0, 0.8)'
    })
    
  } catch (err: any) {
    console.error('B站表单验证失败:', err)
    ElMessage.error('请检查输入信息')
  } finally {
    biliLoading.value = false
  }
}

// 提交抖音表单
const handleDouyinSubmit = async () => {
  if (!douyinFormRef.value) return
  
  try {
    // 表单验证
    const valid = await douyinFormRef.value.validate()
    if (!valid) return
    
    clearDouyinError()
    
    // 使用加载包装器
    await withLoading(async () => {
      douyinLoading.value = true
      
      try {
        console.log('开始获取抖音收藏视频...')
        const result = await getDouyinCollection({
          cookie: douyinForm.cookie.trim(),
          max_cursor: douyinForm.max_cursor,
          counts: douyinForm.counts,
          authorization: douyinForm.authorization.trim()
        })
        
        console.log('抖音收藏视频获取成功:', result)
        
        // 显示成功消息
        ElNotification({
          title: '获取成功',
          message: `成功获取到 ${result.length} 个抖音收藏视频`,
          type: 'success',
          duration: 3000
        })
        
        // 这里可以跳转到抖音视频列表页面或者在当前页面显示结果
        // 暂时先在控制台输出结果
        console.log('抖音收藏视频列表:', result)
        
      } catch (err: any) {
        console.error('获取抖音收藏视频失败:', err)
        douyinError.value = err.message || '获取抖音收藏视频失败，请检查输入信息'
      }
    }, {
      text: '正在获取抖音收藏视频...',
      background: 'rgba(0, 0, 0, 0.8)'
    })
    
  } catch (err: any) {
    console.error('抖音表单验证失败:', err)
    ElMessage.error('请检查输入信息')
  } finally {
    douyinLoading.value = false
  }
}

// 监听表单数据变化，自动保存到store
watch(biliForm, (newValue) => {
  collectionStore.setBiliFormData(newValue)
}, { deep: true })

watch(douyinForm, (newValue) => {
  collectionStore.setDouyinFormData(newValue)
}, { deep: true })
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 2rem 1rem;
}

.header-section {
  text-align: center;
  margin-bottom: 3rem;
  color: #1a202c;
}

.main-title {
  font-size: 3.5rem;
  font-weight: 900;
  margin: 0 0 0.5rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  letter-spacing: -0.025em;
}

.subtitle {
  font-size: 1.25rem;
  margin: 0;
  color: #4a5568;
  font-weight: 400;
  line-height: 1.7;
}

.content-wrapper {
  max-width: 1200px;
  margin: 0 auto;
}

.cards-row {
  margin-bottom: 2rem;
}

.card-col {
  margin-bottom: 1.5rem;
}

.platform-card {
  height: 100%;
  border-radius: 24px;
  overflow: hidden;
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid #e2e8f0;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  background: white;
  position: relative;
}

.platform-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #10b981 0%, #059669 100%);
}

.platform-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.12);
  border-color: #cbd5e0;
}

.bilibili-card {
  border-top: 4px solid #00a1d6;
}

.bilibili-card .card-header {
  background: linear-gradient(135deg, #00a1d6, #0084b4);
}

.douyin-card {
  border-top: 4px solid #fe2c55;
}

.douyin-card .card-header {
  background: linear-gradient(135deg, #fe2c55, #e91e63);
}

.form-content {
  padding: 2.5rem;
}

.card-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 2.5rem 2.5rem 1.5rem;
  margin: -2.5rem -2.5rem 1.5rem -2.5rem;
  border-bottom: 1px solid #f7fafc;
}

.platform-icon {
  width: 64px;
  height: 64px;
  border-radius: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  box-shadow: 0 8px 20px rgba(16, 185, 129, 0.25);
  flex-shrink: 0;
  transition: all 0.3s ease;
}

.platform-card:hover .platform-icon {
  transform: scale(1.05);
  box-shadow: 0 12px 28px rgba(16, 185, 129, 0.35);
}

.platform-icon svg {
  width: 24px;
  height: 24px;
  color: white;
}

.platform-info h3 {
  margin: 0 0 0.5rem 0;
  font-size: 1.75rem;
  font-weight: 800;
  color: #1a202c;
  letter-spacing: -0.025em;
}

.platform-desc {
  font-size: 1rem;
  font-weight: 500;
  color: #64748b;
}

.platform-form {
  margin-bottom: 1.5rem;
}

.form-item {
  margin-bottom: 1.5rem;
}

.form-item :deep(.el-form-item__label) {
  font-weight: 600;
  color: #374151;
  margin-bottom: 0.5rem;
}

.custom-input {
  border-radius: 8px;
}

.custom-input :deep(.el-input__wrapper) {
  border-radius: 16px;
  border: 2px solid #e5e7eb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  padding: 14px 18px;
  background: #fafafa;
}

.custom-input :deep(.el-input__wrapper:hover) {
  border-color: #10b981;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.1);
  background: white;
}

.custom-input :deep(.el-input__wrapper.is-focus) {
  border-color: #10b981;
  box-shadow: 0 0 0 4px rgba(16, 185, 129, 0.1);
  background: white;
}

.custom-input :deep(.el-textarea__inner) {
  border: none;
  border-radius: 16px;
  resize: none;
  font-family: inherit;
  background: transparent;
  line-height: 1.6;
}

.custom-input :deep(.el-input__inner) {
  background: transparent;
}

.form-tip {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.5rem;
  color: #6b7280;
  font-size: 0.75rem;
}

.form-tip .el-icon {
  color: #9ca3af;
}

.error-alert {
  margin-top: 1rem;
  border-radius: 8px;
}

.usage-collapse {
  margin-top: 1rem;
}

.usage-collapse :deep(.el-collapse-item__header) {
  background: #f9fafb;
  border-radius: 8px;
  padding: 0 1rem;
  font-weight: 600;
}

.usage-guide {
  padding: 1rem 0;
}

.guide-section {
  margin-bottom: 1.5rem;
}

.guide-section:last-child {
  margin-bottom: 0;
}

.guide-section h4 {
  margin: 0 0 0.75rem 0;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 600;
}

.guide-section ol,
.guide-section ul {
  margin: 0;
  padding-left: 1.25rem;
}

.guide-section li {
  margin-bottom: 0.25rem;
  color: #6b7280;
  font-size: 0.8125rem;
  line-height: 1.4;
}

:deep(.el-form-item__label) {
  font-weight: 600;
  color: #303133;
}

:deep(.el-textarea__inner) {
  border-radius: 8px;
}

:deep(.el-input__inner) {
  border-radius: 8px;
}

:deep(.el-button) {
  border-radius: 8px;
  font-weight: 600;
}

:deep(.el-collapse-item__header) {
  font-weight: 600;
}

.action-section {
  display: flex;
  justify-content: center;
  margin-top: 2rem;
}

.action-container {
  width: 100%;
  max-width: 1200px;
  text-align: center;
  padding: 0 1rem;
}

.action-button {
  height: 56px;
  font-size: 1.05rem;
  font-weight: 700;
  border-radius: 16px;
  border: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
  position: relative;
  overflow: hidden;
  letter-spacing: 0.025em;
}

.action-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.action-button:hover::before {
  left: 100%;
}

.action-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 28px rgba(0, 0, 0, 0.15);
}

.action-button:active {
  transform: translateY(-1px);
}

.primary-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.primary-button:hover {
  background: linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%);
}

.success-button {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.success-button:hover {
  background: linear-gradient(135deg, #047857 0%, #065f46 100%);
}

.clear-button {
  background: linear-gradient(135deg, #6b7280 0%, #4b5563 100%);
  color: white; /* 添加此行 */
}

.clear-button:hover {
  background: linear-gradient(135deg, #4b5563 0%, #374151 100%);
}

.action-button:active {
  transform: translateY(0);
}

.button-icon {
  margin-right: 8px;
}

.global-error {
  margin-top: 20px;
  border-radius: 8px;
}

/* 动画效果 */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.platform-card {
  animation: fadeInUp 0.6s ease-out;
}

.platform-card:nth-child(2) {
  animation-delay: 0.1s;
}

.action-section {
  animation: fadeInUp 0.6s ease-out 0.2s both;
}

/* 加载状态优化 */
:deep(.el-button.is-loading) {
  position: relative;
}

:deep(.el-button.is-loading .el-icon) {
  animation: rotate 1s linear infinite;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

/* 响应式设计 */
@media (max-width: 1024px) {
  .content-wrapper {
    padding: 0 1.5rem;
  }
}

@media (max-width: 768px) {
  .main-title {
    font-size: 2.75rem;
  }
  
  .subtitle {
    font-size: 1.125rem;
  }
  
  .card-header {
    padding: 2rem 2rem 1.25rem;
  }
  
  .form-content {
    padding: 2rem;
  }
  
  .action-container {
    padding: 0 0.5rem;
  }
  
  .action-button {
    height: 48px;
    font-size: 0.95rem;
  }
  
  .platform-icon {
    width: 56px;
    height: 56px;
  }
  
  .platform-info h3 {
    font-size: 1.5rem;
  }
}

@media (max-width: 576px) {
  .home-container {
    padding: 1rem 0.5rem;
  }
  
  .main-title {
    font-size: 2.25rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
  
  .header-section {
    margin-bottom: 1.5rem;
  }
  
  .card-header {
    padding: 1.5rem 1.5rem 1rem;
    flex-direction: column;
    text-align: center;
    gap: 0.75rem;
  }
  
  .form-content {
    padding: 1.5rem;
  }
  
  .platform-icon {
    width: 48px;
    height: 48px;
  }
  
  .platform-info h3 {
    font-size: 1.25rem;
  }
  
  .action-section .el-col {
    margin-bottom: 0.75rem;
  }
  
  .action-section .el-row {
    flex-direction: column;
  }
}
</style>