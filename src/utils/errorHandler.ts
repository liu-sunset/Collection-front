import { ElMessage, ElNotification } from 'element-plus'

// 错误类型枚举
export enum ErrorType {
  NETWORK_ERROR = 'NETWORK_ERROR',
  API_ERROR = 'API_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

// 错误信息接口
export interface ErrorInfo {
  type: ErrorType
  message: string
  details?: any
}

// 网络错误处理
export const handleNetworkError = (error: any): ErrorInfo => {
  if (!navigator.onLine) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: '网络连接已断开，请检查网络设置'
    }
  }
  
  if (error.code === 'ECONNABORTED' || error.message.includes('timeout')) {
    return {
      type: ErrorType.NETWORK_ERROR,
      message: '请求超时，请稍后重试'
    }
  }
  
  if (error.response) {
    const status = error.response.status
    switch (status) {
      case 400:
        return {
          type: ErrorType.API_ERROR,
          message: '请求参数错误，请检查输入信息'
        }
      case 401:
        return {
          type: ErrorType.API_ERROR,
          message: 'Cookie已过期，请重新获取'
        }
      case 403:
        return {
          type: ErrorType.API_ERROR,
          message: '访问被拒绝，请检查权限'
        }
      case 404:
        return {
          type: ErrorType.API_ERROR,
          message: '请求的资源不存在'
        }
      case 500:
        return {
          type: ErrorType.API_ERROR,
          message: '服务器内部错误，请稍后重试'
        }
      case 502:
      case 503:
      case 504:
        return {
          type: ErrorType.API_ERROR,
          message: '服务器暂时不可用，请稍后重试'
        }
      default:
        return {
          type: ErrorType.API_ERROR,
          message: `请求失败 (${status})，请稍后重试`
        }
    }
  }
  
  return {
    type: ErrorType.NETWORK_ERROR,
    message: '网络请求失败，请检查网络连接'
  }
}

// 统一错误处理函数
export const handleError = (error: any, showNotification = false): ErrorInfo => {
  console.error('Error occurred:', error)
  
  let errorInfo: ErrorInfo
  
  if (error.response || error.code || error.message?.includes('Network Error')) {
    errorInfo = handleNetworkError(error)
  } else if (typeof error === 'string') {
    errorInfo = {
      type: ErrorType.UNKNOWN_ERROR,
      message: error
    }
  } else if (error.message) {
    errorInfo = {
      type: ErrorType.UNKNOWN_ERROR,
      message: error.message
    }
  } else {
    errorInfo = {
      type: ErrorType.UNKNOWN_ERROR,
      message: '发生未知错误，请稍后重试'
    }
  }
  
  // 显示错误提示
  if (showNotification) {
    ElNotification({
      title: '错误',
      message: errorInfo.message,
      type: 'error',
      duration: 5000
    })
  } else {
    ElMessage.error(errorInfo.message)
  }
  
  return errorInfo
}

// Cookie验证函数
export const validateCookie = (cookie: string): boolean => {
  if (!cookie || cookie.trim().length === 0) {
    return false
  }
  
  // 检查是否包含必要的字段
  const requiredFields = ['SESSDATA', 'bili_jct']
  return requiredFields.some(field => cookie.includes(field))
}

// 用户ID验证函数
export const validateUpMid = (upMid: string): boolean => {
  if (!upMid || upMid.trim().length === 0) {
    return false
  }
  
  // 检查是否为纯数字
  return /^\d+$/.test(upMid.trim())
}

// 表单验证错误处理
export const handleValidationError = (field: string, rule: string): string => {
  const errorMessages: Record<string, Record<string, string>> = {
    cookie: {
      required: '请输入Cookie',
      minLength: 'Cookie长度不能少于10个字符',
      invalid: 'Cookie格式不正确，请检查是否包含必要字段'
    },
    upMid: {
      required: '请输入用户ID',
      pattern: '用户ID只能包含数字',
      invalid: '用户ID格式不正确'
    }
  }
  
  return errorMessages[field]?.[rule] || '输入格式不正确'
}