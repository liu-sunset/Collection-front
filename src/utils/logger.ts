// 创建一个浏览器兼容的日志工具

// 日志级别定义
type LogLevel = 'info' | 'error';

// 获取当前时间格式化字符串
const getTimestamp = (): string => {
  const now = new Date();
  return now.toISOString().replace('T', ' ').substring(0, 19);
};

// 创建日志记录器
class BrowserLogger {
  private static instance: BrowserLogger;
  
  // 单例模式
  static getInstance(): BrowserLogger {
    if (!BrowserLogger.instance) {
      BrowserLogger.instance = new BrowserLogger();
    }
    return BrowserLogger.instance;
  }
  
  // 记录信息日志
  info(message: string, metadata?: any): void {
    this.log('info', message, metadata);
  }
  
  // 记录错误日志
  error(message: string, error?: any): void {
    if (error instanceof Error) {
      this.log('error', `${message}: ${error.message}`, {
        stack: error.stack,
        ...error
      });
    } else {
      this.log('error', message, error);
    }
  }
  
  // 通用日志方法
  private log(level: LogLevel, message: string, metadata?: any): void {
    const timestamp = getTimestamp();
    let logMessage = `${timestamp} [browser] ${level.toUpperCase()}: ${message}`;
    
    // 添加额外的元数据
    if (metadata && Object.keys(metadata).length > 0) {
      try {
        logMessage += ` ${JSON.stringify(metadata)}`;
      } catch (e) {
        logMessage += ' [无法序列化的元数据]';
      }
    }
    
    // 在控制台输出
    if (level === 'info') {
      console.log(logMessage);
    } else {
      console.error(logMessage);
    }
    
    // 在开发环境下，可以将日志发送到后端存储
    this.sendLogToServer(level, message, metadata);
  }
  
  // 将日志发送到服务器（可选功能，目前仅占位）
  private sendLogToServer(level: LogLevel, message: string, metadata?: any): void {
    // 这里可以实现将日志发送到后端的逻辑
    // 例如使用 fetch API 或 axios 发送日志数据
    // 为了简化，这里暂不实现
  }
}

// 创建日志实例
const logger = BrowserLogger.getInstance();

// 记录系统信息
logger.info('Logger initialized', {
  environment: import.meta.env.MODE,
  userAgent: navigator.userAgent
});

// 导出日志记录器
export default logger;

// 导出简便的日志记录函数
export const logInfo = (message: string, metadata?: any) => logger.info(message, metadata);
export const logError = (message: string, error?: any) => {
  if (error instanceof Error) {
    logger.error(message, error);
  } else {
    logger.error(message, error);
  }
};

// 捕获未处理的Promise错误
window.addEventListener('unhandledrejection', (event) => {
  logError('Unhandled Promise Rejection', event.reason);
});

// 捕获全局错误
window.addEventListener('error', (event) => {
  logError('Uncaught Error', {
    message: event.message,
    filename: event.filename,
    lineno: event.lineno,
    colno: event.colno,
    error: event.error
  });
});