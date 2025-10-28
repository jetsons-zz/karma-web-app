/**
 * 设备文件管理类型定义
 *
 * @module device/files/types
 */

/**
 * 文件类型枚举
 */
export enum FileType {
  DOCUMENT = 'document',
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  ARCHIVE = 'archive',
  CODE = 'code',
  DATA = 'data',
  OTHER = 'other',
}

/**
 * 文件分类
 */
export enum FileCategory {
  TASK_OUTPUT = 'task_output',      // 任务输出文件
  MEDIA = 'media',                   // 媒体文件
  CONFIG = 'config',                 // 配置文件
  LOG = 'log',                       // 日志文件
  CACHE = 'cache',                   // 缓存文件
  TEMP = 'temp',                     // 临时文件
  USER = 'user',                     // 用户文件
}

/**
 * 设备文件
 */
export interface DeviceFile {
  id: string;
  deviceId: string;
  name: string;
  path: string;
  type: FileType;
  category: FileCategory;
  size: number;
  mimeType: string;
  extension: string;
  createdAt: number;
  modifiedAt: number;
  accessedAt?: number;
  isDirectory: boolean;
  parentPath: string;
  permissions?: FilePermissions;
  metadata?: FileMetadata;
  thumbnailUrl?: string;
  downloadUrl?: string;
  checksumMD5?: string;
  checksumSHA256?: string;
}

/**
 * 文件权限
 */
export interface FilePermissions {
  readable: boolean;
  writable: boolean;
  executable: boolean;
  deletable: boolean;
  owner: string;
  group?: string;
}

/**
 * 文件元数据
 */
export interface FileMetadata {
  width?: number;              // 图片/视频宽度
  height?: number;             // 图片/视频高度
  duration?: number;           // 音频/视频时长（秒）
  bitrate?: number;            // 音频/视频比特率
  codec?: string;              // 编解码器
  fps?: number;                // 视频帧率
  resolution?: string;         // 分辨率
  colorSpace?: string;         // 色彩空间
  hasAlpha?: boolean;          // 是否有透明通道
  pages?: number;              // PDF 页数
  author?: string;             // 作者
  title?: string;              // 标题
  description?: string;        // 描述
  tags?: string[];             // 标签
  exif?: Record<string, any>;  // EXIF 数据
}

/**
 * 文件夹
 */
export interface DeviceFolder {
  id: string;
  deviceId: string;
  name: string;
  path: string;
  parentPath: string;
  fileCount: number;
  folderCount: number;
  totalSize: number;
  createdAt: number;
  modifiedAt: number;
  permissions?: FilePermissions;
}

/**
 * 文件操作类型
 */
export enum FileOperation {
  UPLOAD = 'upload',
  DOWNLOAD = 'download',
  DELETE = 'delete',
  RENAME = 'rename',
  MOVE = 'move',
  COPY = 'copy',
  CREATE_FOLDER = 'create_folder',
  COMPRESS = 'compress',
  EXTRACT = 'extract',
}

/**
 * 文件传输进度
 */
export interface FileTransferProgress {
  fileId: string;
  operation: FileOperation;
  fileName: string;
  totalBytes: number;
  transferredBytes: number;
  percentage: number;
  speed: number;              // 字节/秒
  estimatedTimeRemaining: number;  // 秒
  status: 'pending' | 'transferring' | 'completed' | 'failed' | 'cancelled';
  error?: string;
  startedAt?: number;
  completedAt?: number;
}

/**
 * 文件筛选选项
 */
export interface FileFilter {
  type?: FileType;
  category?: FileCategory;
  path?: string;
  namePattern?: string;
  minSize?: number;
  maxSize?: number;
  createdAfter?: number;
  createdBefore?: number;
  modifiedAfter?: number;
  modifiedBefore?: number;
}

/**
 * 文件排序选项
 */
export interface FileSortOptions {
  field: 'name' | 'size' | 'createdAt' | 'modifiedAt' | 'type';
  order: 'asc' | 'desc';
}

/**
 * 文件搜索结果
 */
export interface FileSearchResult {
  files: DeviceFile[];
  folders: DeviceFolder[];
  totalCount: number;
  totalSize: number;
}

/**
 * 存储统计
 */
export interface StorageStats {
  deviceId: string;
  totalSpace: number;
  usedSpace: number;
  freeSpace: number;
  fileCount: number;
  folderCount: number;
  byType: Record<FileType, { count: number; size: number }>;
  byCategory: Record<FileCategory, { count: number; size: number }>;
  largestFiles: DeviceFile[];
  recentFiles: DeviceFile[];
}

/**
 * 文件批量操作请求
 */
export interface FileBatchOperation {
  operation: FileOperation;
  fileIds: string[];
  targetPath?: string;
  options?: Record<string, any>;
}

/**
 * 文件批量操作结果
 */
export interface FileBatchOperationResult {
  operation: FileOperation;
  totalCount: number;
  successCount: number;
  failedCount: number;
  results: Array<{
    fileId: string;
    fileName: string;
    success: boolean;
    error?: string;
  }>;
}

/**
 * 文件上传请求
 */
export interface FileUploadRequest {
  deviceId: string;
  file: File | Blob;
  path: string;
  category?: FileCategory;
  overwrite?: boolean;
  metadata?: Partial<FileMetadata>;
}

/**
 * 文件下载请求
 */
export interface FileDownloadRequest {
  deviceId: string;
  fileId: string;
  asAttachment?: boolean;
}
