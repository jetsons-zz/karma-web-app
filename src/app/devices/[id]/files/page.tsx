'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useFileManager } from '@/lib/device/files/fileManager';
import { FileType, FileCategory, FileSortOptions } from '@/lib/device/files/types';

export default function DeviceFilesPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const fileManager = useFileManager();

  const [currentPath, setCurrentPath] = useState('/');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list');
  const [sortBy, setSortBy] = useState<FileSortOptions>({ field: 'name', order: 'asc' });
  const [selectedFileType, setSelectedFileType] = useState<FileType | 'all'>('all');
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set());
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [storageStats, setStorageStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // 加载文件列表
  useEffect(() => {
    loadFiles();
    loadStorageStats();
  }, [currentPath, sortBy, selectedFileType]);

  const loadFiles = async () => {
    setLoading(true);
    try {
      const filter = selectedFileType !== 'all' ? { type: selectedFileType } : undefined;
      const result = await fileManager.getDeviceFiles(resolvedParams.id, currentPath, filter, sortBy);
      setFiles(result.files);
      setFolders(result.folders);
    } catch (error) {
      console.error('Failed to load files:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadStorageStats = async () => {
    try {
      const stats = await fileManager.getStorageStats(resolvedParams.id);
      setStorageStats(stats);
    } catch (error) {
      console.error('Failed to load storage stats:', error);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      loadFiles();
      return;
    }

    setLoading(true);
    try {
      const filter = selectedFileType !== 'all' ? { type: selectedFileType } : undefined;
      const result = await fileManager.searchFiles(resolvedParams.id, searchQuery, filter);
      setFiles(result.files);
      setFolders(result.folders);
    } catch (error) {
      console.error('Search failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleFolderClick = (folderPath: string) => {
    setCurrentPath(folderPath);
    setSelectedFiles(new Set());
  };

  const handleGoBack = () => {
    if (currentPath === '/') return;
    const parts = currentPath.split('/');
    parts.pop();
    const parentPath = parts.join('/') || '/';
    setCurrentPath(parentPath);
  };

  const toggleFileSelection = (fileId: string) => {
    const newSelection = new Set(selectedFiles);
    if (newSelection.has(fileId)) {
      newSelection.delete(fileId);
    } else {
      newSelection.add(fileId);
    }
    setSelectedFiles(newSelection);
  };

  const handleDelete = async () => {
    if (selectedFiles.size === 0) return;

    if (confirm(`确定要删除 ${selectedFiles.size} 个文件吗？`)) {
      try {
        for (const fileId of selectedFiles) {
          await fileManager.deleteFile(fileId);
        }
        setSelectedFiles(new Set());
        loadFiles();
        loadStorageStats();
      } catch (error) {
        console.error('Delete failed:', error);
        alert('删除失败');
      }
    }
  };

  const handleDownload = async () => {
    if (selectedFiles.size === 0) return;

    try {
      for (const fileId of selectedFiles) {
        await fileManager.downloadFile({ deviceId: resolvedParams.id, fileId });
      }
      alert('下载已开始');
    } catch (error) {
      console.error('Download failed:', error);
      alert('下载失败');
    }
  };

  const getFileIcon = (type: FileType) => {
    const icons: Record<FileType, string> = {
      [FileType.DOCUMENT]: 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      [FileType.IMAGE]: 'M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z',
      [FileType.VIDEO]: 'M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z',
      [FileType.AUDIO]: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3',
      [FileType.ARCHIVE]: 'M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4',
      [FileType.CODE]: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
      [FileType.DATA]: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4',
      [FileType.OTHER]: 'M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z',
    };
    return icons[type];
  };

  const getFileTypeColor = (type: FileType): string => {
    const colors: Record<FileType, string> = {
      [FileType.DOCUMENT]: 'var(--color-brand-primary)',
      [FileType.IMAGE]: 'var(--color-accent-success)',
      [FileType.VIDEO]: 'var(--color-accent-danger)',
      [FileType.AUDIO]: 'var(--color-brand-secondary)',
      [FileType.ARCHIVE]: 'var(--color-accent-warning)',
      [FileType.CODE]: '#10B981',
      [FileType.DATA]: '#8B5CF6',
      [FileType.OTHER]: 'var(--color-text-muted)',
    };
    return colors[type];
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }} className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="secondary" size="md" onClick={() => router.push(`/devices/${resolvedParams.id}`)}>
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </Button>
            <h1 style={{ fontSize: 'var(--font-size-h1)', fontWeight: 'var(--font-weight-bold)', color: 'var(--color-text-primary)' }}>
              文件管理
            </h1>
          </div>
          <div className="flex gap-3">
            <Button variant="secondary" onClick={handleDownload} disabled={selectedFiles.size === 0}>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              下载 ({selectedFiles.size})
            </Button>
            <Button variant="secondary" onClick={handleDelete} disabled={selectedFiles.size === 0} style={{ color: selectedFiles.size > 0 ? 'var(--color-accent-danger)' : undefined }}>
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              删除 ({selectedFiles.size})
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar: Storage & Filters */}
          <div className="space-y-6">
            {/* Storage Stats */}
            {storageStats && (
              <Card>
                <CardHeader>
                  <CardTitle>存储空间</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-4">
                    <div className="text-3xl font-bold mb-1" style={{ color: 'var(--color-brand-primary)' }}>
                      {((storageStats.usedSpace / storageStats.totalSpace) * 100).toFixed(1)}%
                    </div>
                    <p style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-muted)' }}>
                      已用 {fileManager.formatFileSize(storageStats.usedSpace)} / {fileManager.formatFileSize(storageStats.totalSpace)}
                    </p>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden mb-4" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                    <div
                      className="h-full transition-all"
                      style={{
                        width: `${(storageStats.usedSpace / storageStats.totalSpace) * 100}%`,
                        backgroundColor: 'var(--color-brand-primary)',
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>文件数</span>
                      <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        {storageStats.fileCount}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span style={{ fontSize: '11px', color: 'var(--color-text-muted)' }}>文件夹数</span>
                      <span style={{ fontSize: '11px', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                        {storageStats.folderCount}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* File Type Filter */}
            <Card>
              <CardHeader>
                <CardTitle>文件类型</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  <button
                    onClick={() => setSelectedFileType('all')}
                    className="w-full flex items-center justify-between px-3 py-2 rounded-md transition-all"
                    style={{
                      backgroundColor: selectedFileType === 'all' ? 'var(--color-bg-elevated)' : 'transparent',
                      fontSize: 'var(--font-size-caption)',
                      color: selectedFileType === 'all' ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                    }}
                  >
                    <span>全部文件</span>
                    <span style={{ fontSize: '11px' }}>{storageStats?.fileCount || 0}</span>
                  </button>
                  {Object.values(FileType).map((type) => (
                    <button
                      key={type}
                      onClick={() => setSelectedFileType(type)}
                      className="w-full flex items-center justify-between px-3 py-2 rounded-md transition-all"
                      style={{
                        backgroundColor: selectedFileType === type ? 'var(--color-bg-elevated)' : 'transparent',
                        fontSize: 'var(--font-size-caption)',
                        color: selectedFileType === type ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <svg className="h-4 w-4" style={{ color: getFileTypeColor(type) }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getFileIcon(type)} />
                        </svg>
                        <span style={{ textTransform: 'capitalize' }}>{type}</span>
                      </div>
                      <span style={{ fontSize: '11px' }}>{storageStats?.byType[type]?.count || 0}</span>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Toolbar */}
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  {/* Search */}
                  <div className="flex-1 flex gap-2">
                    <Input
                      type="text"
                      placeholder="搜索文件..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                    <Button variant="primary" onClick={handleSearch}>
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </Button>
                  </div>

                  {/* Sort */}
                  <select
                    value={`${sortBy.field}-${sortBy.order}`}
                    onChange={(e) => {
                      const [field, order] = e.target.value.split('-');
                      setSortBy({ field: field as any, order: order as 'asc' | 'desc' });
                    }}
                    className="px-3 py-2 rounded-md"
                    style={{
                      backgroundColor: 'var(--color-bg-elevated)',
                      border: '1px solid var(--color-border)',
                      color: 'var(--color-text-primary)',
                      fontSize: 'var(--font-size-caption)',
                    }}
                  >
                    <option value="name-asc">名称 ↑</option>
                    <option value="name-desc">名称 ↓</option>
                    <option value="size-asc">大小 ↑</option>
                    <option value="size-desc">大小 ↓</option>
                    <option value="modifiedAt-desc">最新修改</option>
                    <option value="createdAt-desc">最新创建</option>
                  </select>

                  {/* View Mode */}
                  <div className="flex gap-1 p-1 rounded-md" style={{ backgroundColor: 'var(--color-bg-elevated)' }}>
                    <button
                      onClick={() => setViewMode('list')}
                      className="p-2 rounded-md transition-all"
                      style={{
                        backgroundColor: viewMode === 'list' ? 'var(--color-brand-primary)' : 'transparent',
                        color: viewMode === 'list' ? '#FFFFFF' : 'var(--color-text-secondary)',
                      }}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setViewMode('grid')}
                      className="p-2 rounded-md transition-all"
                      style={{
                        backgroundColor: viewMode === 'grid' ? 'var(--color-brand-primary)' : 'transparent',
                        color: viewMode === 'grid' ? '#FFFFFF' : 'var(--color-text-secondary)',
                      }}
                    >
                      <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Breadcrumb */}
            <div className="flex items-center gap-2" style={{ fontSize: 'var(--font-size-caption)', color: 'var(--color-text-secondary)' }}>
              {currentPath !== '/' && (
                <button onClick={handleGoBack} className="hover:text-[var(--color-text-primary)]">
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
              )}
              <button onClick={() => setCurrentPath('/')} className="hover:text-[var(--color-text-primary)]">根目录</button>
              {currentPath.split('/').filter(Boolean).map((part, index, arr) => (
                <div key={index} className="flex items-center gap-2">
                  <span>/</span>
                  <button className="hover:text-[var(--color-text-primary)]">{part}</button>
                </div>
              ))}
            </div>

            {/* File List */}
            <Card>
              <CardContent className="p-0">
                {loading ? (
                  <div className="py-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-solid border-current border-r-transparent" style={{ color: 'var(--color-brand-primary)' }} />
                    <p style={{ marginTop: 'var(--spacing-md)', color: 'var(--color-text-secondary)' }}>加载中...</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[var(--color-border)]">
                    {/* Folders */}
                    {folders.map((folder) => (
                      <div
                        key={folder.id}
                        className="p-4 hover:bg-[var(--color-bg-elevated)] transition-colors cursor-pointer"
                        onClick={() => handleFolderClick(folder.path)}
                      >
                        <div className="flex items-center gap-4">
                          <svg className="h-6 w-6 flex-shrink-0" style={{ color: 'var(--color-accent-warning)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                          </svg>
                          <div className="flex-1">
                            <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }}>
                              {folder.name}
                            </p>
                            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                              {folder.fileCount} 文件 · {fileManager.formatFileSize(folder.totalSize)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Files */}
                    {files.map((file) => (
                      <div
                        key={file.id}
                        className="p-4 hover:bg-[var(--color-bg-elevated)] transition-colors"
                        onClick={() => toggleFileSelection(file.id)}
                      >
                        <div className="flex items-center gap-4">
                          <input
                            type="checkbox"
                            checked={selectedFiles.has(file.id)}
                            onChange={() => toggleFileSelection(file.id)}
                            onClick={(e) => e.stopPropagation()}
                            className="flex-shrink-0"
                          />
                          <svg className="h-6 w-6 flex-shrink-0" style={{ color: getFileTypeColor(file.type) }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={getFileIcon(file.type)} />
                          </svg>
                          <div className="flex-1 min-w-0">
                            <p style={{ fontSize: 'var(--font-size-body)', fontWeight: 'var(--font-weight-medium)', color: 'var(--color-text-primary)' }} className="truncate">
                              {file.name}
                            </p>
                            <p style={{ fontSize: '11px', color: 'var(--color-text-muted)', marginTop: '2px' }}>
                              {fileManager.formatFileSize(file.size)} · {new Date(file.modifiedAt).toLocaleDateString('zh-CN')}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <span className="px-2 py-1 rounded-md" style={{ backgroundColor: 'var(--color-bg-elevated)', fontSize: '11px', color: 'var(--color-text-muted)' }}>
                              {file.extension.toUpperCase()}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Empty State */}
                    {folders.length === 0 && files.length === 0 && (
                      <div className="py-12 text-center">
                        <svg className="h-16 w-16 mx-auto mb-4" style={{ color: 'var(--color-text-muted)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                        </svg>
                        <p style={{ fontSize: 'var(--font-size-body)', color: 'var(--color-text-secondary)' }}>
                          {searchQuery ? '没有找到匹配的文件' : '此文件夹为空'}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
