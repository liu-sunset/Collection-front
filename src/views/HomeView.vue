<template>
  <div class="home-container">
    <div class="content-wrapper">
      <!-- 左侧：B站收藏夹查询 -->
      <el-card class="form-card bilibili-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <h2>B站收藏夹查看器</h2>
            <p>请输入您的Cookie和用户ID来查看收藏夹</p>
          </div>
        </template>
        
        <el-form 
          ref="biliFormRef" 
          :model="biliForm" 
          :rules="biliRules" 
          label-width="100px"
          @submit.prevent="handleBiliSubmit"
        >
          <el-form-item label="Cookie" prop="cookie">
            <el-input
              v-model="biliForm.cookie"
              type="textarea"
              :rows="4"
              placeholder="请输入完整的Cookie信息（包含SESSDATA和bili_jct等字段）"
              :disabled="biliLoading"
              show-word-limit
              maxlength="2000"
            />
            <div class="form-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>请从浏览器开发者工具中复制完整的Cookie</span>
            </div>
          </el-form-item>
          
          <el-form-item label="用户ID" prop="upMid">
            <el-input
              v-model="biliForm.upMid"
              placeholder="请输入B站用户ID（纯数字）"
              :disabled="biliLoading"
              clearable
            />
            <div class="form-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>可以从用户主页URL中获取，例如：space.bilibili.com/123456789</span>
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
          style="margin-top: 20px;"
        />
        
        <!-- 使用说明 -->
        <el-collapse v-model="biliActiveCollapse" style="margin-top: 20px;">
          <el-collapse-item title="使用说明" name="1">
            <div class="usage-guide">
              <h4>如何获取Cookie：</h4>
              <ol>
                <li>打开浏览器，登录B站</li>
                <li>按F12打开开发者工具</li>
                <li>切换到Network（网络）标签</li>
                <li>刷新页面，找到任意请求</li>
                <li>在请求头中找到Cookie字段并复制</li>
              </ol>
              
              <h4>如何获取用户ID：</h4>
              <ol>
                <li>访问目标用户的B站主页</li>
                <li>从URL中获取数字ID，例如：space.bilibili.com/123456789</li>
                <li>其中123456789就是用户ID</li>
              </ol>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>

      <!-- 右侧：抖音收藏视频查询 -->
      <el-card class="form-card douyin-card" shadow="hover">
        <template #header>
          <div class="card-header">
            <h2>抖音收藏视频查看器</h2>
            <p>请输入相关信息来查看抖音收藏视频</p>
          </div>
        </template>
        
        <el-form 
          ref="douyinFormRef" 
          :model="douyinForm" 
          :rules="douyinRules" 
          label-width="100px"
          @submit.prevent="handleDouyinSubmit"
        >
          <el-form-item label="Cookie" prop="cookie">
            <el-input
              v-model="douyinForm.cookie"
              type="textarea"
              :rows="6"
              placeholder="请输入完整的抖音Cookie信息（请确保复制完整，不要截断）"
              :disabled="douyinLoading"
              show-word-limit
            />
            <div class="form-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>请从浏览器开发者工具中复制完整的Cookie，抖音Cookie通常很长，请确保完整复制</span>
            </div>
          </el-form-item>
          
          <el-form-item label="起始游标" prop="max_cursor">
            <el-input-number
              v-model="douyinForm.max_cursor"
              :min="0"
              :disabled="douyinLoading"
              placeholder="起始位置，默认为0"
              style="width: 100%;"
            />
            <div class="form-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>分页查询的起始位置，首次查询请设置为0</span>
            </div>
          </el-form-item>
          
          <el-form-item label="获取数量" prop="counts">
            <el-input-number
              v-model="douyinForm.counts"
              :min="1"
              :max="50"
              :disabled="douyinLoading"
              placeholder="获取视频数量，默认为20"
              style="width: 100%;"
            />
            <div class="form-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>单次获取的视频数量，建议设置为20</span>
            </div>
          </el-form-item>
          
          <el-form-item label="授权信息" prop="authorization">
            <el-input
              v-model="douyinForm.authorization"
              placeholder="请输入authorization信息"
              :disabled="douyinLoading"
              clearable
            />
            <div class="form-tip">
              <el-icon><InfoFilled /></el-icon>
              <span>请从请求头中获取authorization字段</span>
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
          style="margin-top: 20px;"
        />
        
        <!-- 使用说明 -->
        <el-collapse v-model="douyinActiveCollapse" style="margin-top: 20px;">
          <el-collapse-item title="使用说明" name="1">
            <div class="usage-guide">
              <h4>如何获取Cookie和Authorization：</h4>
              <ol>
                <li>打开浏览器，登录抖音网页版</li>
                <li>按F12打开开发者工具</li>
                <li>切换到Network（网络）标签</li>
                <li>刷新页面或进行操作，找到相关请求</li>
                <li>在请求头中找到Cookie和Authorization字段并复制</li>
              </ol>
              
              <h4>参数说明：</h4>
              <ul>
                <li><strong>起始游标：</strong>分页查询的起始位置，首次查询设为0</li>
                <li><strong>获取数量：</strong>单次获取的视频数量，建议20个</li>
                <li><strong>授权信息：</strong>用于身份验证的authorization字段</li>
              </ul>
            </div>
          </el-collapse-item>
        </el-collapse>
      </el-card>
    </div>
    
    <!-- 统一操作按钮区域 -->
    <div class="action-section">
      <el-button 
        type="primary" 
        @click="handleUnifiedSubmit"
        :loading="isLoading"
        :disabled="!hasValidInput"
        size="large"
        class="unified-button"
      >
        {{ getButtonText() }}
      </el-button>
      
      <!-- 全局错误提示 -->
      <el-alert
        v-if="globalError"
        :title="globalError"
        type="error"
        :closable="true"
        @close="clearGlobalError"
        style="margin-top: 20px;"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, ElNotification } from 'element-plus'
import { InfoFilled } from '@element-plus/icons-vue'
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

// B站表单数据
const biliForm = reactive({
  cookie: '',
  upMid: ''
})

// 抖音表单数据
const douyinForm = reactive({
  cookie: '',
  max_cursor: 0,
  counts: 20,
  authorization: ''
})

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
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
}

.content-wrapper {
  display: flex;
  gap: 30px;
  width: 100%;
  max-width: 1400px;
  align-items: flex-start;
}

.form-card {
  flex: 1;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
}

.bilibili-card {
  border-top: 4px solid #00a1d6;
}

.douyin-card {
  border-top: 4px solid #fe2c55;
}

.card-header {
  text-align: center;
  margin-bottom: 20px;
}

.card-header h2 {
  color: #303133;
  margin: 0 0 10px 0;
  font-size: 24px;
  font-weight: 600;
}

.card-header p {
  color: #606266;
  margin: 0;
  font-size: 14px;
}

.form-tip {
  display: flex;
  align-items: center;
  margin-top: 5px;
  color: #909399;
  font-size: 12px;
}

.form-tip .el-icon {
  margin-right: 5px;
}

.usage-guide {
  color: #606266;
  line-height: 1.6;
}

.usage-guide h4 {
  color: #303133;
  margin: 15px 0 10px 0;
}

.usage-guide ol,
.usage-guide ul {
  margin: 10px 0;
  padding-left: 20px;
}

.usage-guide li {
  margin: 5px 0;
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

/* 响应式设计 */
@media (max-width: 1200px) {
  .content-wrapper {
    flex-direction: column;
    gap: 20px;
  }
  
  .form-card {
    max-width: 600px;
    margin: 0 auto;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 10px;
  }
  
  .card-header h2 {
    font-size: 20px;
  }
  
  .card-header p {
    font-size: 12px;
  }
}
</style>