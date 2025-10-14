# Collection-Front

这是一个基于Vue3的前端项目，用于展示和管理来自B站和抖音的收藏内容。

## 技术栈

- Vue 3
- Element Plus
- Axios
- Vue Router
- Pinia
- TypeScript
- Vite

## 项目设置

### 安装依赖

```bash
npm install
```

### 开发环境运行

```bash
npm run dev
```

### 生产环境构建

```bash
npm run build
```

### 预览构建结果

```bash
npm run preview
```

### 类型检查

```bash
npm run type-check
```

### 代码格式化

```bash
npm run format
```

### 代码检查

```bash
npm run lint
```

## 项目结构

```
├── src/
│   ├── api/          # API请求
│   ├── router/       # 路由配置
│   ├── stores/       # Pinia状态管理
│   ├── types/        # TypeScript类型定义
│   ├── utils/        # 工具函数
│   ├── views/        # 页面组件
│   ├── App.vue       # 根组件
│   └── main.ts       # 入口文件
├── public/           # 静态资源
└── ...配置文件
```

## API文档

项目使用以下API接口：

### Bilibili相关接口

- `/getBiliUserInfo` - 获取用户所有公开收藏夹的信息
- `/getBiliCollectionInfo` - 获取用户收藏夹内详细信息

### 抖音相关接口

- `/getdouallcollection` - 获取用户所有收藏视频信息

详细的API文档请参考项目中的`api_doc.md`文件。

## 部署指南

### 环境要求

- Node.js 16+
- npm 8+

### 在Linux服务器上部署

1. 克隆仓库
```bash
git clone https://github.com/liu-sunset/Collection-front.git
cd Collection-front
```

2. 安装依赖
```bash
npm install
```

3. 构建项目
```bash
npm run build
```

4. 使用Nginx或其他Web服务器部署dist目录
```bash
# Nginx配置示例
server {
    listen 80;
    server_name your-domain.com;

    location / {
        root /path/to/Collection-front/dist;
        index index.html;
        try_files $uri $uri/ /index.html;
    }
}
```

## 许可证

MIT