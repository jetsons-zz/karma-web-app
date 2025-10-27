'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar } from '@/components/ui/Avatar';
import { Input } from '@/components/ui/Input';
import { DataTile } from '@/components/ui/DataTile';
import { mockStoreAvatars } from '@/lib/mock/data';

export default function StorePage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['全部', 'Development', 'Design', 'Writing', 'Analysis'];

  const filteredAvatars = mockStoreAvatars.filter(avatar => {
    const matchesSearch = avatar.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         avatar.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || selectedCategory === '全部' || avatar.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculate store metrics
  const totalDownloads = mockStoreAvatars.reduce((sum, a) => sum + a.downloads, 0);
  const avgRating = (mockStoreAvatars.reduce((sum, a) => sum + a.rating, 0) / mockStoreAvatars.length).toFixed(1);
  const totalAvatars = mockStoreAvatars.length;

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }}>
        {/* Header */}
        <div className="mb-8">
          <h1
            style={{
              fontSize: 'var(--font-size-h1)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-text-primary)',
              marginBottom: 'var(--spacing-xs)',
            }}
          >
            Avatar 商店
          </h1>
          <p
            style={{
              fontSize: 'var(--font-size-body)',
              color: 'var(--color-text-secondary)',
            }}
          >
            发现并订阅专业的 AI 分身
          </p>
        </div>

        {/* Store Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <DataTile
            label="可用 Avatar"
            value={totalAvatars}
            unit="个"
            status="neutral"
          />
          <DataTile
            label="总下载量"
            value={totalDownloads}
            unit="次"
            trend="up"
            trendValue="+127 本周"
            status="success"
          />
          <DataTile
            label="平均评分"
            value={avgRating}
            unit="⭐"
            status="success"
          />
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="flex-1">
            <Input
              placeholder="搜索 Avatar 名称或技能..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div
            className="flex items-center gap-2 p-2 rounded-[12px]"
            style={{
              backgroundColor: 'var(--color-bg-elevated)',
              border: '1px solid var(--color-border)',
            }}
          >
            {categories.map((category) => {
              const isActive = (category === '全部' && !selectedCategory) || selectedCategory === category;
              return (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category === '全部' ? null : category)}
                  className="px-3 py-1.5 rounded-lg transition-all"
                  style={{
                    backgroundColor: isActive ? 'var(--color-brand-primary)' : 'transparent',
                    color: isActive ? '#FFFFFF' : 'var(--color-text-secondary)',
                    fontSize: 'var(--font-size-caption)',
                    fontWeight: isActive ? 'var(--font-weight-medium)' : 'var(--font-weight-regular)',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'var(--color-bg-panel)';
                      e.currentTarget.style.color = 'var(--color-text-primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = 'transparent';
                      e.currentTarget.style.color = 'var(--color-text-secondary)';
                    }
                  }}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        {/* Results Count */}
        <div
          className="mb-6"
          style={{
            fontSize: 'var(--font-size-caption)',
            color: 'var(--color-text-secondary)',
          }}
        >
          找到 <span style={{ color: 'var(--color-brand-primary)', fontWeight: 'var(--font-weight-medium)' }}>{filteredAvatars.length}</span> 个 Avatar
        </div>

        {/* Avatar Grid */}
        {filteredAvatars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAvatars.map((avatar) => (
              <Card
                key={avatar.id}
                className="cursor-pointer"
                onClick={() => router.push(`/store/${avatar.id}`)}
              >
                <CardHeader>
                  <div className="flex items-start gap-3">
                    <Avatar
                      src={avatar.avatar}
                      name={avatar.name}
                      size="lg"
                      role={avatar.category === 'Development' ? 'Forge' : avatar.category === 'Design' ? 'Vision' : 'Scout'}
                      showRole
                    />
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-1">
                        <CardTitle>{avatar.name}</CardTitle>
                        <Badge variant="outline">{avatar.category}</Badge>
                      </div>
                      <p
                        style={{
                          fontSize: 'var(--font-size-caption)',
                          color: 'var(--color-text-secondary)',
                          lineHeight: '1.4',
                        }}
                      >
                        {avatar.description}
                      </p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Rating */}
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className="h-4 w-4"
                          viewBox="0 0 20 20"
                          style={{
                            fill: i < Math.floor(avatar.rating) ? 'var(--color-accent-warning)' : 'var(--color-bg-elevated)',
                          }}
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span
                      style={{
                        fontSize: 'var(--font-size-caption)',
                        color: 'var(--color-text-secondary)',
                      }}
                    >
                      {avatar.rating} ({avatar.reviewCount})
                    </span>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-4">
                    {avatar.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 rounded-md"
                        style={{
                          backgroundColor: 'var(--color-bg-elevated)',
                          color: 'var(--color-text-secondary)',
                          fontSize: 'var(--font-size-caption)',
                        }}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Stats */}
                  <div
                    className="flex items-center justify-between mb-4 pb-4"
                    style={{
                      borderBottom: '1px solid var(--color-border)',
                      fontSize: 'var(--font-size-caption)',
                    }}
                  >
                    <span style={{ color: 'var(--color-text-secondary)' }}>
                      {avatar.downloads} 次下载
                    </span>
                    <span
                      style={{
                        fontWeight: 'var(--font-weight-medium)',
                        color: 'var(--color-accent-success)',
                      }}
                    >
                      {avatar.performance.successRate}% 成功率
                    </span>
                  </div>

                  {/* Price and CTA */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div
                        style={{
                          fontSize: 'var(--font-size-h2)',
                          fontWeight: 'var(--font-weight-bold)',
                          color: 'var(--color-text-primary)',
                        }}
                      >
                        ${avatar.price}
                      </div>
                      <div
                        style={{
                          fontSize: '11px',
                          color: 'var(--color-text-muted)',
                        }}
                      >
                        每月
                      </div>
                    </div>
                    <Button size="md" variant="primary">
                      订阅
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div
              className="mb-4"
              style={{
                fontSize: 'var(--font-size-body)',
                color: 'var(--color-text-muted)',
              }}
            >
              没有找到符合条件的 Avatar
            </div>
            <Button
              variant="secondary"
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory(null);
              }}
            >
              清除筛选
            </Button>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
