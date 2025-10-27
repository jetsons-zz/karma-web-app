'use client';

/**
 * 西部世界主题 - AI 分身页面
 * 展示基于 HBO Westworld 角色的 AI 分身系统
 */

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Avatar } from '@/components/ui/Avatar';
import {
  CharacterSelector,
  CompactCharacterSelector,
} from '@/components/westworld/CharacterSelector';
import {
  WestworldCharacterId,
  getAllCharacters,
  getCharacter,
} from '@/lib/westworld/characters';
import { mockAvatars } from '@/lib/mock/data';

export default function WestworldAvatarsPage() {
  const router = useRouter();
  const [selectedCharacter, setSelectedCharacter] =
    useState<WestworldCharacterId>('dolores');
  const [viewMode, setViewMode] = useState<'grid' | 'selector'>('selector');

  const characters = getAllCharacters();

  return (
    <MainLayout>
      <div style={{ padding: 'var(--spacing-xxl)' }}>
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1
                className="text-4xl font-bold mb-2"
                style={{
                  background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                西部世界 × AI 分身
              </h1>
              <p className="text-neutral-400 text-lg">
                选择你的角色，进入觉醒的世界
              </p>
            </div>
            <div className="flex gap-3">
              <Button
                variant={viewMode === 'selector' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('selector')}
              >
                角色选择器
              </Button>
              <Button
                variant={viewMode === 'grid' ? 'primary' : 'secondary'}
                onClick={() => setViewMode('grid')}
              >
                分身网格
              </Button>
            </div>
          </div>

          {/* Quote Banner */}
          <div
            className="p-6 rounded-xl mb-6 border"
            style={{
              background: 'linear-gradient(135deg, rgba(108, 99, 255, 0.1) 0%, rgba(47, 123, 255, 0.1) 100%)',
              borderColor: 'rgba(108, 99, 255, 0.3)',
            }}
          >
            <p className="text-center text-xl italic text-neutral-300">
              "These violent delights have violent ends."
            </p>
            <p className="text-center text-sm text-neutral-500 mt-2">
              — Dr. Robert Ford, Westworld
            </p>
          </div>
        </div>

        {/* View Mode: Character Selector */}
        {viewMode === 'selector' && (
          <CharacterSelector
            selectedCharacter={selectedCharacter}
            onSelect={setSelectedCharacter}
            onConfirm={() => {
              alert(`你选择了 ${getCharacter(selectedCharacter).name}！`);
            }}
          />
        )}

        {/* View Mode: Avatar Grid with Westworld Theme */}
        {viewMode === 'grid' && (
          <>
            {/* Compact Character Filter */}
            <div className="mb-6">
              <h3 className="text-lg font-medium mb-3 text-neutral-300">
                选择你的角色：
              </h3>
              <CompactCharacterSelector
                selectedCharacter={selectedCharacter}
                onSelect={setSelectedCharacter}
              />
            </div>

            {/* AI Avatars with Westworld Theme */}
            <div>
              <h3 className="text-lg font-medium mb-4 text-neutral-300">
                你的 AI 分身团队：
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {mockAvatars.map((avatar, index) => {
                  // 为每个分身分配一个西部世界角色
                  const westworldCharacter =
                    characters[index % characters.length];

                  return (
                    <Card
                      key={avatar.id}
                      className="hover:scale-105 transition-transform duration-300 cursor-pointer"
                      onClick={() => router.push(`/avatars/${avatar.id}`)}
                    >
                      <div className="p-6">
                        {/* Avatar with Westworld Theme */}
                        <div className="flex items-start gap-4 mb-4">
                          <Avatar
                            theme="westworld"
                            westworldCharacter={westworldCharacter.id}
                            size="xl"
                            status={
                              avatar.status === 'working'
                                ? 'thinking'
                                : avatar.status === 'idle'
                                ? 'online'
                                : 'offline'
                            }
                            iconStatus={
                              avatar.status === 'working'
                                ? 'active'
                                : 'default'
                            }
                          />
                          <div className="flex-1">
                            <h4 className="text-xl font-bold text-white mb-1">
                              {avatar.name}
                            </h4>
                            <p className="text-sm text-neutral-400 mb-2">
                              扮演 {westworldCharacter.fullName}
                            </p>
                            <div
                              className="inline-block px-2 py-1 rounded text-xs font-medium"
                              style={{
                                backgroundColor:
                                  westworldCharacter.visual.primaryColor,
                                color: '#FFFFFF',
                              }}
                            >
                              {westworldCharacter.role}
                            </div>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-sm text-neutral-400 mb-4 line-clamp-2">
                          {avatar.description}
                        </p>

                        {/* Abilities - Westworld Style */}
                        <div className="space-y-2 mb-4">
                          {Object.entries(westworldCharacter.abilities)
                            .slice(0, 3)
                            .map(([key, value]) => (
                              <div key={key}>
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-neutral-500 capitalize">
                                    {key === 'coding'
                                      ? '编程'
                                      : key === 'design'
                                      ? '设计'
                                      : key === 'writing'
                                      ? '写作'
                                      : key}
                                  </span>
                                  <span className="text-xs font-medium text-neutral-300">
                                    {value}
                                  </span>
                                </div>
                                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                                  <div
                                    className="h-full rounded-full transition-all duration-500"
                                    style={{
                                      width: `${value}%`,
                                      backgroundColor:
                                        westworldCharacter.visual.accentColor,
                                    }}
                                  />
                                </div>
                              </div>
                            ))}
                        </div>

                        {/* Quote */}
                        <div
                          className="p-3 rounded-lg border"
                          style={{
                            backgroundColor: 'rgba(0, 0, 0, 0.3)',
                            borderColor:
                              westworldCharacter.visual.primaryColor + '40',
                          }}
                        >
                          <p className="text-xs italic text-neutral-400 line-clamp-2">
                            "{westworldCharacter.quotes[0]}"
                          </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-neutral-800">
                          <div>
                            <div className="text-xs text-neutral-500">
                              任务
                            </div>
                            <div className="text-lg font-bold text-white">
                              {avatar.performance.completedTasks}
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-500">
                              成功率
                            </div>
                            <div className="text-lg font-bold text-green-400">
                              {avatar.performance.successRate}%
                            </div>
                          </div>
                          <div>
                            <div className="text-xs text-neutral-500">
                              收益
                            </div>
                            <div className="text-lg font-bold text-yellow-400">
                              ${avatar.earnings.today}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Character Showcase - All 8 Characters */}
        <div className="mt-12">
          <h3 className="text-2xl font-bold mb-6 text-neutral-200">
            完整角色阵容
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-6">
            {characters.map(character => (
              <div
                key={character.id}
                className="flex flex-col items-center group cursor-pointer"
                onClick={() => setSelectedCharacter(character.id)}
              >
                <div className="mb-3 transform transition-transform group-hover:scale-110">
                  <Avatar
                    theme="westworld"
                    westworldCharacter={character.id}
                    size="xl"
                    status={selectedCharacter === character.id ? 'thinking' : undefined}
                    iconStatus={
                      selectedCharacter === character.id ? 'active' : 'default'
                    }
                  />
                </div>
                <div className="text-center">
                  <div className="text-sm font-medium text-white mb-1">
                    {character.name}
                  </div>
                  <div className="text-xs text-neutral-500">
                    {character.role}
                  </div>
                  <div className="text-xs text-neutral-600 mt-1">
                    {character.visual.emoji}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Easter Egg - Maze */}
        <div className="mt-12 text-center">
          <div
            className="inline-block p-8 rounded-full cursor-pointer hover:scale-110 transition-transform"
            style={{
              background: 'radial-gradient(circle, rgba(108, 99, 255, 0.2) 0%, transparent 70%)',
            }}
            title="The maze isn't meant for you"
          >
            <svg width="80" height="80" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="#6C63FF"
                strokeWidth="2"
                opacity="0.6"
              />
              <circle
                cx="50"
                cy="50"
                r="30"
                fill="none"
                stroke="#6C63FF"
                strokeWidth="2"
                opacity="0.7"
              />
              <circle
                cx="50"
                cy="50"
                r="20"
                fill="none"
                stroke="#6C63FF"
                strokeWidth="2"
                opacity="0.8"
              />
              <circle
                cx="50"
                cy="50"
                r="10"
                fill="none"
                stroke="#6C63FF"
                strokeWidth="2"
                opacity="0.9"
              />
              <circle cx="50" cy="50" r="3" fill="#6C63FF" />
              <path
                d="M 30 50 Q 30 30 50 30 Q 70 30 70 50"
                fill="none"
                stroke="#FFD700"
                strokeWidth="2"
                opacity="0.8"
              />
            </svg>
          </div>
          <p className="text-xs text-neutral-600 mt-4 italic">
            "The maze isn't meant for you."
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
