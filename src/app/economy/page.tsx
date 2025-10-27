'use client';

import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { DataTile } from '@/components/ui/DataTile';
import { Toggle } from '@/components/ui/Toggle';
import { Avatar } from '@/components/ui/Avatar';

export default function EconomyPage() {
  const [viewMode, setViewMode] = useState<'consumer' | 'producer'>('consumer');

  // Mock data for dual-ledger system
  const consumerLedger = [
    { id: '1', date: '2025-10-24', description: '订阅 Avatar - Forge', amount: -29, balance: 971, category: '订阅' },
    { id: '2', date: '2025-10-23', description: '月度充值', amount: 500, balance: 1000, category: '充值' },
    { id: '3', date: '2025-10-22', description: '任务消耗 - 项目 Alpha', amount: -45, balance: 500, category: '消耗' },
    { id: '4', date: '2025-10-21', description: '订阅 Avatar - Vision', amount: -39, balance: 545, category: '订阅' },
    { id: '5', date: '2025-10-20', description: '任务消耗 - 数据分析', amount: -18, balance: 584, category: '消耗' },
  ];

  const producerLedger = [
    { id: '1', date: '2025-10-24', description: 'Forge 完成任务', amount: 85, balance: 2456, category: '收益', avatar: 'Forge' },
    { id: '2', date: '2025-10-24', description: 'Vision 完成设计', amount: 120, balance: 2371, category: '收益', avatar: 'Vision' },
    { id: '3', date: '2025-10-23', description: 'Scout 市场调研', amount: 65, balance: 2251, category: '收益', avatar: 'Scout' },
    { id: '4', date: '2025-10-23', description: 'Capital 投资回报', amount: 200, balance: 2186, category: '收益', avatar: 'Capital' },
    { id: '5', date: '2025-10-22', description: 'Flow 流程优化', amount: 55, balance: 1986, category: '收益', avatar: 'Flow' },
  ];

  const ledger = viewMode === 'consumer' ? consumerLedger : producerLedger;

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }}>
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
              经济账本
            </h1>
            <p
              style={{
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-secondary)',
              }}
            >
              双式记账 × 消费者储蓄 × 生产者收益
            </p>
          </div>
          <Toggle
            checked={viewMode === 'producer'}
            onChange={(checked) => setViewMode(checked ? 'producer' : 'consumer')}
            labels={['消费者视图', '生产者视图']}
            size="lg"
          />
        </div>

        {/* Metrics Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {viewMode === 'consumer' ? (
            <>
              <DataTile
                label="当前余额"
                value="$971"
                status="success"
              />
              <DataTile
                label="本月支出"
                value="$131"
                trend="down"
                trendValue="-15% vs 上月"
                status="success"
              />
              <DataTile
                label="本月充值"
                value="$500"
                status="neutral"
              />
              <DataTile
                label="平均日消耗"
                value="$26"
                trend="down"
                trendValue="-3%"
                status="success"
              />
            </>
          ) : (
            <>
              <DataTile
                label="总收益"
                value="$2,456"
                status="success"
              />
              <DataTile
                label="本月收入"
                value="$525"
                trend="up"
                trendValue="+23% vs 上月"
                status="success"
              />
              <DataTile
                label="活跃 Avatar"
                value={5}
                unit="个"
                status="neutral"
              />
              <DataTile
                label="平均日收益"
                value="$105"
                trend="up"
                trendValue="+8%"
                status="success"
              />
            </>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Ledger */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {viewMode === 'consumer' ? '消费记录' : '收益记录'}
                  </CardTitle>
                  <span
                    style={{
                      fontSize: 'var(--font-size-caption)',
                      color: 'var(--color-text-muted)',
                    }}
                  >
                    最近 30 天
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {ledger.map((transaction, index) => {
                    const isPositive = transaction.amount > 0;
                    return (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 rounded-[12px] transition-all"
                        style={{
                          backgroundColor: index === 0 ? 'var(--color-bg-elevated)' : 'transparent',
                          border: '1px solid var(--color-border)',
                        }}
                      >
                        <div className="flex items-center gap-3 flex-1">
                          {viewMode === 'producer' && transaction.avatar && (
                            <Avatar
                              name={transaction.avatar}
                              size="sm"
                              role={transaction.avatar as any}
                            />
                          )}
                          <div className="flex-1">
                            <div
                              style={{
                                fontSize: 'var(--font-size-caption)',
                                fontWeight: 'var(--font-weight-medium)',
                                color: 'var(--color-text-primary)',
                                marginBottom: 'var(--spacing-xxs)',
                              }}
                            >
                              {transaction.description}
                            </div>
                            <div className="flex items-center gap-2">
                              <span
                                style={{
                                  fontSize: '11px',
                                  color: 'var(--color-text-muted)',
                                }}
                              >
                                {transaction.date}
                              </span>
                              <span
                                className="px-2 py-0.5 rounded-md"
                                style={{
                                  backgroundColor: 'var(--color-bg-elevated)',
                                  color: 'var(--color-text-secondary)',
                                  fontSize: '11px',
                                }}
                              >
                                {transaction.category}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div
                            style={{
                              fontSize: 'var(--font-size-body)',
                              fontWeight: 'var(--font-weight-bold)',
                              color: isPositive ? 'var(--color-accent-success)' : 'var(--color-accent-danger)',
                            }}
                          >
                            {isPositive ? '+' : ''}{transaction.amount}
                          </div>
                          <div
                            style={{
                              fontSize: '11px',
                              color: 'var(--color-text-muted)',
                            }}
                          >
                            余额 ${transaction.balance}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Sidebar: Analytics */}
          <div className="space-y-6">
            {/* Category Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>分类统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {viewMode === 'consumer' ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          订阅费用
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          $68
                        </span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--color-bg-elevated)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '52%',
                            height: '100%',
                            backgroundColor: 'var(--color-brand-primary)',
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            color: 'var(--color-text-secondary)',
                          }}
                        >
                          任务消耗
                        </span>
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          $63
                        </span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--color-bg-elevated)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '48%',
                            height: '100%',
                            backgroundColor: 'var(--color-accent-warning)',
                          }}
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Avatar name="Vision" size="xs" role="Vision" />
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            Vision
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          $180
                        </span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--color-bg-elevated)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '34%',
                            height: '100%',
                            backgroundColor: '#4ECDC4',
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Avatar name="Capital" size="xs" role="Capital" />
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            Capital
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          $200
                        </span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--color-bg-elevated)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '38%',
                            height: '100%',
                            backgroundColor: '#FFA07A',
                          }}
                        />
                      </div>

                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-2">
                          <Avatar name="Forge" size="xs" role="Forge" />
                          <span
                            style={{
                              fontSize: 'var(--font-size-caption)',
                              color: 'var(--color-text-secondary)',
                            }}
                          >
                            Others
                          </span>
                        </div>
                        <span
                          style={{
                            fontSize: 'var(--font-size-caption)',
                            fontWeight: 'var(--font-weight-medium)',
                            color: 'var(--color-text-primary)',
                          }}
                        >
                          $145
                        </span>
                      </div>
                      <div
                        style={{
                          height: '6px',
                          borderRadius: 'var(--radius-xs)',
                          backgroundColor: 'var(--color-bg-elevated)',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            width: '28%',
                            height: '100%',
                            backgroundColor: 'var(--color-brand-primary)',
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>本月统计</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      交易次数
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: 'var(--color-text-primary)',
                      }}
                    >
                      {ledger.length}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {viewMode === 'consumer' ? '净支出' : '净收入'}
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-body)',
                        fontWeight: 'var(--font-weight-bold)',
                        color: viewMode === 'consumer' ? 'var(--color-accent-danger)' : 'var(--color-accent-success)',
                      }}
                    >
                      {viewMode === 'consumer' ? '-$131' : '+$525'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      vs 上月
                    </span>
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-accent-success)',
                      }}
                    >
                      {viewMode === 'consumer' ? '-15%' : '+23%'}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
