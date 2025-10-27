'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

interface TrainingSession {
  id: string;
  avatarId: string;
  avatarName: string;
  status: 'preparing' | 'training' | 'completed' | 'failed';
  progress: number;
  startedAt: string;
  estimatedCompletion?: string;
  trainingData: {
    documentsCount: number;
    tokensCount: number;
    epochs: number;
  };
  metrics?: {
    accuracy: number;
    loss: number;
  };
}

interface TrainingDataset {
  id: string;
  name: string;
  type: 'documents' | 'conversations' | 'code' | 'mixed';
  itemsCount: number;
  size: string;
  createdAt: string;
  status: 'ready' | 'processing' | 'error';
}

export default function AvatarTrainPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'sessions' | 'datasets' | 'new'>('sessions');

  const [trainingSessions, setTrainingSessions] = useState<TrainingSession[]>([
    {
      id: 'session-001',
      avatarId: 'avatar-001',
      avatarName: 'CodeMaster Pro',
      status: 'training',
      progress: 65,
      startedAt: '2025-10-27T08:00:00',
      estimatedCompletion: '2025-10-27T12:00:00',
      trainingData: {
        documentsCount: 1500,
        tokensCount: 2500000,
        epochs: 10,
      },
      metrics: {
        accuracy: 0.87,
        loss: 0.23,
      },
    },
    {
      id: 'session-002',
      avatarId: 'avatar-002',
      avatarName: 'DataAnalyst AI',
      status: 'completed',
      progress: 100,
      startedAt: '2025-10-26T10:00:00',
      trainingData: {
        documentsCount: 850,
        tokensCount: 1200000,
        epochs: 8,
      },
      metrics: {
        accuracy: 0.92,
        loss: 0.15,
      },
    },
    {
      id: 'session-003',
      avatarId: 'avatar-003',
      avatarName: 'DesignBot Elite',
      status: 'preparing',
      progress: 15,
      startedAt: '2025-10-27T09:30:00',
      trainingData: {
        documentsCount: 600,
        tokensCount: 900000,
        epochs: 5,
      },
    },
  ]);

  const [datasets, setDatasets] = useState<TrainingDataset[]>([
    {
      id: 'dataset-001',
      name: '技术文档集合',
      type: 'documents',
      itemsCount: 1500,
      size: '256 MB',
      createdAt: '2025-10-20',
      status: 'ready',
    },
    {
      id: 'dataset-002',
      name: '客服对话记录',
      type: 'conversations',
      itemsCount: 3200,
      size: '128 MB',
      createdAt: '2025-10-22',
      status: 'ready',
    },
    {
      id: 'dataset-003',
      name: '代码示例库',
      type: 'code',
      itemsCount: 980,
      size: '512 MB',
      createdAt: '2025-10-25',
      status: 'processing',
    },
  ]);

  // New training form state
  const [newTraining, setNewTraining] = useState({
    avatarId: '',
    datasetIds: [] as string[],
    epochs: 10,
    learningRate: 0.001,
    batchSize: 32,
  });

  const getStatusBadge = (status: TrainingSession['status']) => {
    const styles = {
      preparing: { variant: 'default' as const, label: '准备中' },
      training: { variant: 'warning' as const, label: '训练中' },
      completed: { variant: 'success' as const, label: '已完成' },
      failed: { variant: 'default' as const, label: '失败' },
    };
    return styles[status];
  };

  const getDatasetTypeBadge = (type: TrainingDataset['type']) => {
    const labels = {
      documents: '文档',
      conversations: '对话',
      code: '代码',
      mixed: '混合',
    };
    return labels[type];
  };

  const handleStopTraining = (sessionId: string) => {
    console.log('Stopping training:', sessionId);
    setTrainingSessions(prev =>
      prev.map(session =>
        session.id === sessionId
          ? { ...session, status: 'failed' as const }
          : session
      )
    );
  };

  const handleDeleteSession = (sessionId: string) => {
    setTrainingSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const handleStartTraining = () => {
    if (!newTraining.avatarId || newTraining.datasetIds.length === 0) {
      alert('请选择 Avatar 和至少一个数据集');
      return;
    }

    const newSession: TrainingSession = {
      id: `session-${Date.now()}`,
      avatarId: newTraining.avatarId,
      avatarName: 'New Avatar',
      status: 'preparing',
      progress: 0,
      startedAt: new Date().toISOString(),
      trainingData: {
        documentsCount: 0,
        tokensCount: 0,
        epochs: newTraining.epochs,
      },
    };

    setTrainingSessions([newSession, ...trainingSessions]);
    setActiveTab('sessions');

    // Reset form
    setNewTraining({
      avatarId: '',
      datasetIds: [],
      epochs: 10,
      learningRate: 0.001,
      batchSize: 32,
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatDuration = (startDate: string, endDate?: string) => {
    const start = new Date(startDate);
    const end = endDate ? new Date(endDate) : new Date();
    const diff = end.getTime() - start.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}小时${minutes}分钟`;
  };

  const toggleDataset = (datasetId: string) => {
    setNewTraining(prev => ({
      ...prev,
      datasetIds: prev.datasetIds.includes(datasetId)
        ? prev.datasetIds.filter(id => id !== datasetId)
        : [...prev.datasetIds, datasetId],
    }));
  };

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)', maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              style={{
                fontSize: 'var(--font-size-h1)',
                fontWeight: 'var(--font-weight-bold)',
                color: 'var(--color-text-primary)',
                marginBottom: 'var(--spacing-xs)',
              }}
            >
              Avatar 训练中心
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
              }}
            >
              训练和优化你的 AI Avatar，提升专业能力
            </p>
          </div>
          <Button onClick={() => setActiveTab('new')}>
            开始新训练
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                进行中训练
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {trainingSessions.filter(s => s.status === 'training').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                已完成训练
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {trainingSessions.filter(s => s.status === 'completed').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                可用数据集
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                {datasets.filter(d => d.status === 'ready').length}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent style={{ padding: 'var(--spacing-lg)' }}>
              <div
                style={{
                  fontSize: 'var(--font-size-caption)',
                  color: 'var(--color-text-secondary)',
                  marginBottom: 'var(--spacing-xs)',
                }}
              >
                平均准确率
              </div>
              <div
                style={{
                  fontSize: 'var(--font-size-h2)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-text-primary)',
                }}
              >
                89.5%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b" style={{ borderColor: 'var(--color-border)' }}>
          {[
            { key: 'sessions' as const, label: '训练会话' },
            { key: 'datasets' as const, label: '训练数据' },
            { key: 'new' as const, label: '新建训练' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className="pb-3 px-4 transition-colors"
              style={{
                fontSize: 'var(--font-size-body)',
                fontWeight: activeTab === tab.key ? 'var(--font-weight-semibold)' : 'var(--font-weight-normal)',
                color: activeTab === tab.key ? 'var(--color-brand-primary)' : 'var(--color-text-secondary)',
                borderBottom: activeTab === tab.key ? '2px solid var(--color-brand-primary)' : 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Training Sessions Tab */}
        {activeTab === 'sessions' && (
          <div className="space-y-6">
            {trainingSessions.map((session) => {
              const statusBadge = getStatusBadge(session.status);

              return (
                <Card key={session.id}>
                  <CardContent style={{ padding: 'var(--spacing-lg)' }}>
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3
                            style={{
                              fontSize: 'var(--font-size-h3)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {session.avatarName}
                          </h3>
                          <Badge variant={statusBadge.variant}>
                            {statusBadge.label}
                          </Badge>
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          开始时间: {formatDate(session.startedAt)}
                        </div>
                        {session.estimatedCompletion && session.status === 'training' && (
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            预计完成: {formatDate(session.estimatedCompletion)}
                          </div>
                        )}
                      </div>

                      {session.status === 'training' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleStopTraining(session.id)}
                          style={{ color: 'var(--color-error)' }}
                        >
                          停止训练
                        </Button>
                      )}
                    </div>

                    {/* Progress Bar */}
                    {(session.status === 'training' || session.status === 'preparing') && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            训练进度
                          </span>
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {session.progress}%
                          </span>
                        </div>
                        <div
                          className="rounded-full overflow-hidden"
                          style={{
                            height: '8px',
                            backgroundColor: 'var(--color-surface)',
                          }}
                        >
                          <div
                            className="h-full transition-all duration-500"
                            style={{
                              width: `${session.progress}%`,
                              backgroundColor: 'var(--color-brand-primary)',
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {/* Training Info Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-4">
                      <div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            marginBottom: '2px',
                          }}
                        >
                          文档数量
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-body)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {session.trainingData.documentsCount.toLocaleString()}
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            marginBottom: '2px',
                          }}
                        >
                          Token 数量
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-body)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {(session.trainingData.tokensCount / 1000000).toFixed(1)}M
                        </div>
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: '11px',
                            color: 'var(--color-text-muted)',
                            marginBottom: '2px',
                          }}
                        >
                          训练轮次
                        </div>
                        <div
                          style={{
                            fontSize: 'var(--font-size-body)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {session.trainingData.epochs}
                        </div>
                      </div>

                      {session.metrics && (
                        <>
                          <div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                                marginBottom: '2px',
                              }}
                            >
                              准确率
                            </div>
                            <div
                              style={{
                                fontSize: 'var(--font-size-body)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-success)',
                              }}
                            >
                              {(session.metrics.accuracy * 100).toFixed(1)}%
                            </div>
                          </div>

                          <div>
                            <div
                              style={{
                                fontSize: '11px',
                                color: 'var(--color-text-muted)',
                                marginBottom: '2px',
                              }}
                            >
                              Loss
                            </div>
                            <div
                              style={{
                                fontSize: 'var(--font-size-body)',
                                fontWeight: 'var(--font-weight-semibold)',
                                color: 'var(--color-text-primary)',
                              }}
                            >
                              {session.metrics.loss.toFixed(2)}
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-3">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/avatars/${session.avatarId}`)}
                      >
                        查看 Avatar
                      </Button>
                      {session.status === 'completed' && (
                        <Button variant="outline" size="sm">
                          下载模型
                        </Button>
                      )}
                      {(session.status === 'completed' || session.status === 'failed') && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteSession(session.id)}
                          style={{ color: 'var(--color-error)' }}
                        >
                          删除记录
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}

        {/* Datasets Tab */}
        {activeTab === 'datasets' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between mb-6">
              <p
                style={{
                  fontSize: 'var(--font-size-body)',
                  color: 'var(--color-text-secondary)',
                }}
              >
                管理训练数据集，上传新数据或编辑现有数据集
              </p>
              <Button>上传数据集</Button>
            </div>

            {datasets.map((dataset) => (
              <Card key={dataset.id}>
                <CardContent style={{ padding: 'var(--spacing-lg)' }}>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3
                          style={{
                            fontSize: 'var(--font-size-h3)',
                            fontWeight: 'var(--font-weight-semibold)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          {dataset.name}
                        </h3>
                        <Badge>{getDatasetTypeBadge(dataset.type)}</Badge>
                        {dataset.status === 'ready' && (
                          <Badge variant="success">就绪</Badge>
                        )}
                        {dataset.status === 'processing' && (
                          <Badge variant="warning">处理中</Badge>
                        )}
                      </div>

                      <div className="grid grid-cols-3 gap-6 mt-3">
                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              marginBottom: '2px',
                            }}
                          >
                            项目数量
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {dataset.itemsCount.toLocaleString()}
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              marginBottom: '2px',
                            }}
                          >
                            文件大小
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-semibold)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {dataset.size}
                          </div>
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                              marginBottom: '2px',
                            }}
                          >
                            创建时间
                          </div>
                          <div
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-primary)',
                            }}
                          >
                            {formatDate(dataset.createdAt)}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Button variant="outline" size="sm">
                        查看详情
                      </Button>
                      <Button variant="ghost" size="sm">
                        编辑
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* New Training Tab */}
        {activeTab === 'new' && (
          <div className="max-w-3xl">
            <Card>
              <CardHeader>
                <CardTitle>创建新训练任务</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {/* Select Avatar */}
                  <div>
                    <label
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        display: 'block',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      选择 Avatar
                    </label>
                    <select
                      value={newTraining.avatarId}
                      onChange={(e) =>
                        setNewTraining({ ...newTraining, avatarId: e.target.value })
                      }
                      className="w-full px-4 py-2 rounded-[8px]"
                      style={{
                        backgroundColor: 'var(--color-surface)',
                        border: '1px solid var(--color-border)',
                        color: 'var(--color-text-primary)',
                        fontSize: 'var(--font-size-body)',
                      }}
                    >
                      <option value="">请选择要训练的 Avatar</option>
                      <option value="avatar-001">CodeMaster Pro</option>
                      <option value="avatar-002">DataAnalyst AI</option>
                      <option value="avatar-003">DesignBot Elite</option>
                    </select>
                  </div>

                  {/* Select Datasets */}
                  <div>
                    <label
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-text-primary)',
                        display: 'block',
                        marginBottom: 'var(--spacing-sm)',
                      }}
                    >
                      选择训练数据集
                    </label>
                    <div className="space-y-3">
                      {datasets
                        .filter((d) => d.status === 'ready')
                        .map((dataset) => (
                          <div
                            key={dataset.id}
                            onClick={() => toggleDataset(dataset.id)}
                            className="flex items-center justify-between p-4 rounded-[8px] cursor-pointer transition-all"
                            style={{
                              border: `2px solid ${
                                newTraining.datasetIds.includes(dataset.id)
                                  ? 'var(--color-brand-primary)'
                                  : 'var(--color-border)'
                              }`,
                              backgroundColor: newTraining.datasetIds.includes(dataset.id)
                                ? 'var(--color-brand-primary)10'
                                : 'transparent',
                            }}
                          >
                            <div>
                              <div
                                style={{
                                  fontSize: 'var(--font-size-body)',
                                  fontWeight: 'var(--font-weight-medium)',
                                  color: 'var(--color-text-primary)',
                                  marginBottom: '2px',
                                }}
                              >
                                {dataset.name}
                              </div>
                              <div
                                style={{
                                  fontSize: 'var(--font-size-caption)',
                                  color: 'var(--color-text-secondary)',
                                }}
                              >
                                {dataset.itemsCount.toLocaleString()} 项 • {dataset.size}
                              </div>
                            </div>
                            {newTraining.datasetIds.includes(dataset.id) && (
                              <svg
                                className="h-5 w-5"
                                style={{ color: 'var(--color-brand-primary)' }}
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path
                                  fillRule="evenodd"
                                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                  clipRule="evenodd"
                                />
                              </svg>
                            )}
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Training Parameters */}
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                          display: 'block',
                          marginBottom: 'var(--spacing-xs)',
                        }}
                      >
                        训练轮次 (Epochs)
                      </label>
                      <input
                        type="number"
                        value={newTraining.epochs}
                        onChange={(e) =>
                          setNewTraining({ ...newTraining, epochs: parseInt(e.target.value) })
                        }
                        min="1"
                        max="100"
                        className="w-full px-4 py-2 rounded-[8px]"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-body)',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                          display: 'block',
                          marginBottom: 'var(--spacing-xs)',
                        }}
                      >
                        学习率
                      </label>
                      <input
                        type="number"
                        value={newTraining.learningRate}
                        onChange={(e) =>
                          setNewTraining({
                            ...newTraining,
                            learningRate: parseFloat(e.target.value),
                          })
                        }
                        step="0.0001"
                        min="0.0001"
                        max="0.1"
                        className="w-full px-4 py-2 rounded-[8px]"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-body)',
                        }}
                      />
                    </div>

                    <div>
                      <label
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          fontWeight: 'var(--font-weight-medium)',
                          color: 'var(--color-text-primary)',
                          display: 'block',
                          marginBottom: 'var(--spacing-xs)',
                        }}
                      >
                        批次大小
                      </label>
                      <input
                        type="number"
                        value={newTraining.batchSize}
                        onChange={(e) =>
                          setNewTraining({ ...newTraining, batchSize: parseInt(e.target.value) })
                        }
                        min="1"
                        max="256"
                        className="w-full px-4 py-2 rounded-[8px]"
                        style={{
                          backgroundColor: 'var(--color-surface)',
                          border: '1px solid var(--color-border)',
                          color: 'var(--color-text-primary)',
                          fontSize: 'var(--font-size-body)',
                        }}
                      />
                    </div>
                  </div>

                  {/* Info Box */}
                  <div
                    className="p-4 rounded-[8px]"
                    style={{
                      backgroundColor: 'var(--color-brand-primary)10',
                      border: '1px solid var(--color-brand-primary)',
                    }}
                  >
                    <div
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-semibold)',
                        color: 'var(--color-brand-primary)',
                        marginBottom: 'var(--spacing-xs)',
                      }}
                    >
                      训练说明
                    </div>
                    <ul
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                        paddingLeft: '20px',
                      }}
                    >
                      <li>训练过程通常需要 2-6 小时，具体取决于数据集大小</li>
                      <li>建议选择多个相关数据集以提高训练效果</li>
                      <li>训练期间 Avatar 仍可正常使用，不会受影响</li>
                      <li>训练完成后可以对比新旧版本性能</li>
                    </ul>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center justify-end gap-3">
                    <Button variant="outline" onClick={() => setActiveTab('sessions')}>
                      取消
                    </Button>
                    <Button
                      onClick={handleStartTraining}
                      disabled={!newTraining.avatarId || newTraining.datasetIds.length === 0}
                    >
                      开始训练
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
