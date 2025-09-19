// API响应的通用格式
export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

// 收藏夹基本信息
export interface CollectionInfo {
  collectionId: string
  collectionTitle: string
}

// 视频信息（API返回的原始格式）
export interface VideoInfo {
  title: string
  cover: string
  link: string
}

// 前端使用的视频信息（扩展格式，包含从link提取的bvid）
export interface VideoInfoExtended extends VideoInfo {
  bvid?: string  // 从link提取的视频ID
  pic?: string   // cover的别名，保持兼容性
}

// 收藏夹详细信息
export interface CollectionDetail {
  collectionTitle: string
  collectionCover: string
  videoInfoList: VideoInfoExtended[]  // 使用扩展的视频信息类型
}

// 获取用户收藏夹信息的响应
export interface UserCollectionResponse {
  total: number
  collectionInfo: CollectionInfo[]
}

// 请求参数类型
export interface GetUserInfoParams {
  cookie: string
  upMid: string
}

export interface GetCollectionInfoParams {
  collectionIds: string[]
}

// 获取收藏夹详细信息的响应
export type CollectionDetailResponse = CollectionDetail[]

// 抖音收藏视频信息
export interface DouyinVideoInfo {
  title: string
  cover: string
  link: string
}

// 抖音收藏视频请求参数
export interface DouyinCollectionParams {
  cookie: string
  max_cursor: number
  counts: number
  authorization: string
}