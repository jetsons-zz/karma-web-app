/**
 * 设备文件管理器
 *
 * @module device/files/fileManager
 */

import {
  DeviceFile,
  DeviceFolder,
  FileType,
  FileCategory,
  FileFilter,
  FileSortOptions,
  FileSearchResult,
  StorageStats,
  FileTransferProgress,
  FileOperation,
  FileBatchOperation,
  FileBatchOperationResult,
  FileUploadRequest,
  FileDownloadRequest,
} from './types';

/**
 * 文件管理器（单例模式）
 */
export class FileManager {
  private static instance: FileManager;
  private files: Map<string, DeviceFile> = new Map();
  private folders: Map<string, DeviceFolder> = new Map();
  private transfers: Map<string, FileTransferProgress> = new Map();

  private constructor() {
    this.initializeMockData();
  }

  /**
   * 获取单例实例
   */
  static getInstance(): FileManager {
    if (!this.instance) {
      this.instance = new FileManager();
    }
    return this.instance;
  }

  /**
   * 初始化模拟数据
   */
  private initializeMockData(): void {
    const deviceId = 'dev_001';
    const now = Date.now();

    // 模拟文件夹
    const folders: DeviceFolder[] = [
      {
        id: 'folder_001',
        deviceId,
        name: 'Documents',
        path: '/Documents',
        parentPath: '/',
        fileCount: 12,
        folderCount: 3,
        totalSize: 25 * 1024 * 1024,
        createdAt: now - 86400000 * 30,
        modifiedAt: now - 86400000 * 2,
      },
      {
        id: 'folder_002',
        deviceId,
        name: 'Media',
        path: '/Media',
        parentPath: '/',
        fileCount: 45,
        folderCount: 2,
        totalSize: 850 * 1024 * 1024,
        createdAt: now - 86400000 * 60,
        modifiedAt: now - 86400000 * 1,
      },
      {
        id: 'folder_003',
        deviceId,
        name: 'Photos',
        path: '/Media/Photos',
        parentPath: '/Media',
        fileCount: 32,
        folderCount: 0,
        totalSize: 420 * 1024 * 1024,
        createdAt: now - 86400000 * 45,
        modifiedAt: now - 86400000 * 1,
      },
      {
        id: 'folder_004',
        deviceId,
        name: 'Videos',
        path: '/Media/Videos',
        parentPath: '/Media',
        fileCount: 13,
        folderCount: 0,
        totalSize: 430 * 1024 * 1024,
        createdAt: now - 86400000 * 45,
        modifiedAt: now - 86400000 * 3,
      },
      {
        id: 'folder_005',
        deviceId,
        name: 'Tasks',
        path: '/Tasks',
        parentPath: '/',
        fileCount: 8,
        folderCount: 0,
        totalSize: 5 * 1024 * 1024,
        createdAt: now - 86400000 * 7,
        modifiedAt: now - 3600000,
      },
    ];

    folders.forEach((folder) => {
      this.folders.set(folder.id, folder);
    });

    // 模拟文件
    const files: DeviceFile[] = [
      {
        id: 'file_001',
        deviceId,
        name: '会议纪要_2025.pdf',
        path: '/Documents/会议纪要_2025.pdf',
        type: FileType.DOCUMENT,
        category: FileCategory.TASK_OUTPUT,
        size: 2.5 * 1024 * 1024,
        mimeType: 'application/pdf',
        extension: 'pdf',
        createdAt: now - 86400000 * 2,
        modifiedAt: now - 86400000 * 2,
        isDirectory: false,
        parentPath: '/Documents',
        metadata: {
          pages: 12,
          author: 'Karma AI',
          title: '2025年度会议纪要',
        },
        permissions: {
          readable: true,
          writable: true,
          executable: false,
          deletable: true,
          owner: 'user_001',
        },
      },
      {
        id: 'file_002',
        deviceId,
        name: '产品方案.docx',
        path: '/Documents/产品方案.docx',
        type: FileType.DOCUMENT,
        category: FileCategory.USER,
        size: 1.8 * 1024 * 1024,
        mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        extension: 'docx',
        createdAt: now - 86400000 * 5,
        modifiedAt: now - 86400000 * 1,
        isDirectory: false,
        parentPath: '/Documents',
        permissions: {
          readable: true,
          writable: true,
          executable: false,
          deletable: true,
          owner: 'user_001',
        },
      },
      {
        id: 'file_003',
        deviceId,
        name: 'screenshot_20250128.png',
        path: '/Media/Photos/screenshot_20250128.png',
        type: FileType.IMAGE,
        category: FileCategory.MEDIA,
        size: 3.2 * 1024 * 1024,
        mimeType: 'image/png',
        extension: 'png',
        createdAt: now - 86400000 * 1,
        modifiedAt: now - 86400000 * 1,
        isDirectory: false,
        parentPath: '/Media/Photos',
        metadata: {
          width: 1920,
          height: 1080,
          colorSpace: 'sRGB',
          hasAlpha: true,
        },
        thumbnailUrl: '/api/files/file_003/thumbnail',
        permissions: {
          readable: true,
          writable: true,
          executable: false,
          deletable: true,
          owner: 'user_001',
        },
      },
      {
        id: 'file_004',
        deviceId,
        name: 'demo_video.mp4',
        path: '/Media/Videos/demo_video.mp4',
        type: FileType.VIDEO,
        category: FileCategory.MEDIA,
        size: 125 * 1024 * 1024,
        mimeType: 'video/mp4',
        extension: 'mp4',
        createdAt: now - 86400000 * 3,
        modifiedAt: now - 86400000 * 3,
        isDirectory: false,
        parentPath: '/Media/Videos',
        metadata: {
          width: 1920,
          height: 1080,
          duration: 180,
          fps: 30,
          bitrate: 5000000,
          codec: 'H.264',
          resolution: '1080p',
        },
        thumbnailUrl: '/api/files/file_004/thumbnail',
        permissions: {
          readable: true,
          writable: true,
          executable: false,
          deletable: true,
          owner: 'user_001',
        },
      },
      {
        id: 'file_005',
        deviceId,
        name: 'task_report_001.json',
        path: '/Tasks/task_report_001.json',
        type: FileType.DATA,
        category: FileCategory.TASK_OUTPUT,
        size: 128 * 1024,
        mimeType: 'application/json',
        extension: 'json',
        createdAt: now - 3600000,
        modifiedAt: now - 3600000,
        isDirectory: false,
        parentPath: '/Tasks',
        permissions: {
          readable: true,
          writable: false,
          executable: false,
          deletable: true,
          owner: 'system',
        },
      },
      {
        id: 'file_006',
        deviceId,
        name: 'config.yaml',
        path: '/config.yaml',
        type: FileType.CODE,
        category: FileCategory.CONFIG,
        size: 4 * 1024,
        mimeType: 'application/x-yaml',
        extension: 'yaml',
        createdAt: now - 86400000 * 30,
        modifiedAt: now - 86400000 * 7,
        isDirectory: false,
        parentPath: '/',
        permissions: {
          readable: true,
          writable: true,
          executable: false,
          deletable: false,
          owner: 'system',
        },
      },
    ];

    files.forEach((file) => {
      this.files.set(file.id, file);
    });
  }

  /**
   * 获取设备文件列表
   */
  async getDeviceFiles(
    deviceId: string,
    path: string = '/',
    filter?: FileFilter,
    sort?: FileSortOptions
  ): Promise<FileSearchResult> {
    let files = Array.from(this.files.values()).filter(
      (f) => f.deviceId === deviceId && f.parentPath === path
    );

    let folders = Array.from(this.folders.values()).filter(
      (f) => f.deviceId === deviceId && f.parentPath === path
    );

    // 应用筛选
    if (filter) {
      if (filter.type) {
        files = files.filter((f) => f.type === filter.type);
      }
      if (filter.category) {
        files = files.filter((f) => f.category === filter.category);
      }
      if (filter.namePattern) {
        const pattern = new RegExp(filter.namePattern, 'i');
        files = files.filter((f) => pattern.test(f.name));
        folders = folders.filter((f) => pattern.test(f.name));
      }
      if (filter.minSize !== undefined) {
        files = files.filter((f) => f.size >= filter.minSize!);
      }
      if (filter.maxSize !== undefined) {
        files = files.filter((f) => f.size <= filter.maxSize!);
      }
      if (filter.createdAfter) {
        files = files.filter((f) => f.createdAt >= filter.createdAfter!);
      }
      if (filter.createdBefore) {
        files = files.filter((f) => f.createdAt <= filter.createdBefore!);
      }
    }

    // 应用排序
    if (sort) {
      const sortFn = (a: DeviceFile, b: DeviceFile) => {
        let aVal: any = a[sort.field];
        let bVal: any = b[sort.field];

        if (sort.field === 'name') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (sort.order === 'asc') {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
      };

      files.sort(sortFn);
    }

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    return {
      files,
      folders,
      totalCount: files.length + folders.length,
      totalSize,
    };
  }

  /**
   * 获取文件详情
   */
  async getFile(fileId: string): Promise<DeviceFile | null> {
    return this.files.get(fileId) || null;
  }

  /**
   * 获取文件夹详情
   */
  async getFolder(folderId: string): Promise<DeviceFolder | null> {
    return this.folders.get(folderId) || null;
  }

  /**
   * 获取存储统计
   */
  async getStorageStats(deviceId: string): Promise<StorageStats> {
    const files = Array.from(this.files.values()).filter((f) => f.deviceId === deviceId);
    const folders = Array.from(this.folders.values()).filter((f) => f.deviceId === deviceId);

    const totalSpace = 64 * 1024 * 1024 * 1024; // 64GB
    const usedSpace = files.reduce((sum, f) => sum + f.size, 0);
    const freeSpace = totalSpace - usedSpace;

    // 按类型统计
    const byType: Record<FileType, { count: number; size: number }> = {} as any;
    Object.values(FileType).forEach((type) => {
      byType[type] = { count: 0, size: 0 };
    });

    files.forEach((file) => {
      byType[file.type].count++;
      byType[file.type].size += file.size;
    });

    // 按分类统计
    const byCategory: Record<FileCategory, { count: number; size: number }> = {} as any;
    Object.values(FileCategory).forEach((category) => {
      byCategory[category] = { count: 0, size: 0 };
    });

    files.forEach((file) => {
      byCategory[file.category].count++;
      byCategory[file.category].size += file.size;
    });

    // 最大文件
    const largestFiles = [...files]
      .sort((a, b) => b.size - a.size)
      .slice(0, 10);

    // 最近文件
    const recentFiles = [...files]
      .sort((a, b) => b.modifiedAt - a.modifiedAt)
      .slice(0, 10);

    return {
      deviceId,
      totalSpace,
      usedSpace,
      freeSpace,
      fileCount: files.length,
      folderCount: folders.length,
      byType,
      byCategory,
      largestFiles,
      recentFiles,
    };
  }

  /**
   * 搜索文件
   */
  async searchFiles(
    deviceId: string,
    query: string,
    filter?: FileFilter
  ): Promise<FileSearchResult> {
    const pattern = new RegExp(query, 'i');

    let files = Array.from(this.files.values()).filter(
      (f) => f.deviceId === deviceId && pattern.test(f.name)
    );

    let folders = Array.from(this.folders.values()).filter(
      (f) => f.deviceId === deviceId && pattern.test(f.name)
    );

    // 应用额外筛选
    if (filter) {
      if (filter.type) {
        files = files.filter((f) => f.type === filter.type);
      }
      if (filter.category) {
        files = files.filter((f) => f.category === filter.category);
      }
    }

    const totalSize = files.reduce((sum, f) => sum + f.size, 0);

    return {
      files,
      folders,
      totalCount: files.length + folders.length,
      totalSize,
    };
  }

  /**
   * 上传文件
   */
  async uploadFile(request: FileUploadRequest): Promise<DeviceFile> {
    const fileId = `file_${Date.now()}`;
    const now = Date.now();

    const file: DeviceFile = {
      id: fileId,
      deviceId: request.deviceId,
      name: request.file instanceof File ? request.file.name : 'unnamed',
      path: `${request.path}/${request.file instanceof File ? request.file.name : 'unnamed'}`,
      type: this.detectFileType(request.file instanceof File ? request.file.name : ''),
      category: request.category || FileCategory.USER,
      size: request.file.size,
      mimeType: request.file.type,
      extension: this.getFileExtension(request.file instanceof File ? request.file.name : ''),
      createdAt: now,
      modifiedAt: now,
      isDirectory: false,
      parentPath: request.path,
      metadata: request.metadata,
      permissions: {
        readable: true,
        writable: true,
        executable: false,
        deletable: true,
        owner: 'user_001',
      },
    };

    this.files.set(fileId, file);

    // 模拟上传进度
    this.simulateTransfer(fileId, FileOperation.UPLOAD, file.name, file.size);

    return file;
  }

  /**
   * 下载文件
   */
  async downloadFile(request: FileDownloadRequest): Promise<void> {
    const file = this.files.get(request.fileId);
    if (!file) {
      throw new Error('File not found');
    }

    // 模拟下载
    this.simulateTransfer(request.fileId, FileOperation.DOWNLOAD, file.name, file.size);
  }

  /**
   * 删除文件
   */
  async deleteFile(fileId: string): Promise<boolean> {
    return this.files.delete(fileId);
  }

  /**
   * 删除文件夹
   */
  async deleteFolder(folderId: string): Promise<boolean> {
    return this.folders.delete(folderId);
  }

  /**
   * 批量操作
   */
  async batchOperation(operation: FileBatchOperation): Promise<FileBatchOperationResult> {
    const results: FileBatchOperationResult['results'] = [];

    for (const fileId of operation.fileIds) {
      const file = this.files.get(fileId);
      if (!file) {
        results.push({
          fileId,
          fileName: 'Unknown',
          success: false,
          error: 'File not found',
        });
        continue;
      }

      try {
        switch (operation.operation) {
          case FileOperation.DELETE:
            await this.deleteFile(fileId);
            break;
          case FileOperation.DOWNLOAD:
            await this.downloadFile({ deviceId: file.deviceId, fileId });
            break;
          // 添加其他操作...
        }

        results.push({
          fileId,
          fileName: file.name,
          success: true,
        });
      } catch (error: any) {
        results.push({
          fileId,
          fileName: file.name,
          success: false,
          error: error.message,
        });
      }
    }

    return {
      operation: operation.operation,
      totalCount: operation.fileIds.length,
      successCount: results.filter((r) => r.success).length,
      failedCount: results.filter((r) => !r.success).length,
      results,
    };
  }

  /**
   * 获取传输进度
   */
  getTransferProgress(fileId: string): FileTransferProgress | null {
    return this.transfers.get(fileId) || null;
  }

  /**
   * 获取所有传输进度
   */
  getAllTransfers(): FileTransferProgress[] {
    return Array.from(this.transfers.values());
  }

  /**
   * 模拟文件传输
   */
  private async simulateTransfer(
    fileId: string,
    operation: FileOperation,
    fileName: string,
    totalBytes: number
  ): Promise<void> {
    const progress: FileTransferProgress = {
      fileId,
      operation,
      fileName,
      totalBytes,
      transferredBytes: 0,
      percentage: 0,
      speed: 0,
      estimatedTimeRemaining: 0,
      status: 'transferring',
      startedAt: Date.now(),
    };

    this.transfers.set(fileId, progress);

    // 模拟传输过程
    const chunkSize = totalBytes / 20;
    for (let i = 0; i < 20; i++) {
      await new Promise((resolve) => setTimeout(resolve, 100));

      progress.transferredBytes += chunkSize;
      progress.percentage = Math.min((progress.transferredBytes / totalBytes) * 100, 100);
      progress.speed = chunkSize / 0.1; // 字节/秒
      progress.estimatedTimeRemaining = (totalBytes - progress.transferredBytes) / progress.speed;
    }

    progress.status = 'completed';
    progress.completedAt = Date.now();
    progress.percentage = 100;
  }

  /**
   * 检测文件类型
   */
  private detectFileType(filename: string): FileType {
    const ext = this.getFileExtension(filename).toLowerCase();

    const typeMap: Record<string, FileType> = {
      // 文档
      pdf: FileType.DOCUMENT,
      doc: FileType.DOCUMENT,
      docx: FileType.DOCUMENT,
      txt: FileType.DOCUMENT,
      rtf: FileType.DOCUMENT,

      // 图片
      jpg: FileType.IMAGE,
      jpeg: FileType.IMAGE,
      png: FileType.IMAGE,
      gif: FileType.IMAGE,
      svg: FileType.IMAGE,
      webp: FileType.IMAGE,

      // 视频
      mp4: FileType.VIDEO,
      avi: FileType.VIDEO,
      mov: FileType.VIDEO,
      mkv: FileType.VIDEO,
      webm: FileType.VIDEO,

      // 音频
      mp3: FileType.AUDIO,
      wav: FileType.AUDIO,
      aac: FileType.AUDIO,
      flac: FileType.AUDIO,

      // 压缩包
      zip: FileType.ARCHIVE,
      rar: FileType.ARCHIVE,
      '7z': FileType.ARCHIVE,
      tar: FileType.ARCHIVE,
      gz: FileType.ARCHIVE,

      // 代码
      js: FileType.CODE,
      ts: FileType.CODE,
      py: FileType.CODE,
      java: FileType.CODE,
      cpp: FileType.CODE,
      html: FileType.CODE,
      css: FileType.CODE,

      // 数据
      json: FileType.DATA,
      xml: FileType.DATA,
      yaml: FileType.DATA,
      csv: FileType.DATA,
    };

    return typeMap[ext] || FileType.OTHER;
  }

  /**
   * 获取文件扩展名
   */
  private getFileExtension(filename: string): string {
    const parts = filename.split('.');
    return parts.length > 1 ? parts[parts.length - 1] : '';
  }

  /**
   * 格式化文件大小
   */
  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
  }
}

/**
 * 导出单例实例
 */
export const fileManager = FileManager.getInstance();

/**
 * React Hook - 使用文件管理器
 */
export function useFileManager() {
  const manager = FileManager.getInstance();

  return {
    getDeviceFiles: (deviceId: string, path?: string, filter?: FileFilter, sort?: FileSortOptions) =>
      manager.getDeviceFiles(deviceId, path, filter, sort),
    getFile: (fileId: string) => manager.getFile(fileId),
    getFolder: (folderId: string) => manager.getFolder(folderId),
    getStorageStats: (deviceId: string) => manager.getStorageStats(deviceId),
    searchFiles: (deviceId: string, query: string, filter?: FileFilter) =>
      manager.searchFiles(deviceId, query, filter),
    uploadFile: (request: FileUploadRequest) => manager.uploadFile(request),
    downloadFile: (request: FileDownloadRequest) => manager.downloadFile(request),
    deleteFile: (fileId: string) => manager.deleteFile(fileId),
    deleteFolder: (folderId: string) => manager.deleteFolder(folderId),
    batchOperation: (operation: FileBatchOperation) => manager.batchOperation(operation),
    getTransferProgress: (fileId: string) => manager.getTransferProgress(fileId),
    getAllTransfers: () => manager.getAllTransfers(),
    formatFileSize: (bytes: number) => manager.formatFileSize(bytes),
  };
}
