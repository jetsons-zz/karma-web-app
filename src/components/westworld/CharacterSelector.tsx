'use client';

/**
 * 西部世界角色选择器
 * 允许用户选择自己的 AI 分身角色
 */

import React, { useState } from 'react';
import {
  WestworldCharacterId,
  getAllCharacters,
  getCharacter,
} from '@/lib/westworld/characters';
import { Avatar } from '@/components/ui/Avatar';
import { Button } from '@/components/ui/Button';
import { cn } from '@/lib/utils';

interface CharacterSelectorProps {
  selectedCharacter?: WestworldCharacterId;
  onSelect: (characterId: WestworldCharacterId) => void;
  onConfirm?: () => void;
  className?: string;
}

export function CharacterSelector({
  selectedCharacter,
  onSelect,
  onConfirm,
  className,
}: CharacterSelectorProps) {
  const [hoveredId, setHoveredId] = useState<WestworldCharacterId | null>(null);
  const characters = getAllCharacters();
  const displayCharacter = hoveredId
    ? getCharacter(hoveredId)
    : selectedCharacter
    ? getCharacter(selectedCharacter)
    : characters[0];

  return (
    <div className={cn('w-full', className)}>
      {/* 角色详情展示 */}
      <div
        className="rounded-xl p-6 mb-6 transition-all duration-300"
        style={{
          background: `linear-gradient(135deg, ${displayCharacter.visual.primaryColor}15 0%, ${displayCharacter.visual.accentColor}10 100%)`,
          border: `2px solid ${displayCharacter.visual.primaryColor}40`,
        }}
      >
        <div className="flex items-start gap-6">
          {/* 大头像 */}
          <div className="flex-shrink-0">
            <Avatar
              theme="westworld"
              westworldCharacter={displayCharacter.id}
              size="xl"
              status={selectedCharacter === displayCharacter.id ? 'online' : undefined}
              iconStatus={selectedCharacter === displayCharacter.id ? 'active' : 'default'}
            />
          </div>

          {/* 角色信息 */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h3 className="text-2xl font-bold text-neutral-900">
                {displayCharacter.name}
              </h3>
              <span
                className="px-3 py-1 rounded-full text-sm font-medium"
                style={{
                  backgroundColor: displayCharacter.visual.primaryColor,
                  color: '#FFFFFF',
                }}
              >
                {displayCharacter.role}
              </span>
            </div>

            <p className="text-sm text-neutral-600 mb-3">
              {displayCharacter.fullName}
            </p>

            <p className="text-neutral-700 mb-4">{displayCharacter.description}</p>

            {/* 能力雷达 */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Object.entries(displayCharacter.abilities).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-neutral-600 capitalize">
                      {key === 'coding'
                        ? '编程'
                        : key === 'design'
                        ? '设计'
                        : key === 'writing'
                        ? '写作'
                        : key === 'analysis'
                        ? '分析'
                        : key === 'communication'
                        ? '沟通'
                        : '领导'}
                    </span>
                    <span className="text-xs font-medium text-neutral-900">
                      {value}
                    </span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${value}%`,
                        backgroundColor: displayCharacter.visual.accentColor,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>

            {/* 经典台词 */}
            <div className="bg-neutral-50 rounded-lg p-3 border border-neutral-200">
              <p className="text-sm italic text-neutral-600">
                "{displayCharacter.quotes[0]}"
              </p>
            </div>
          </div>
        </div>

        {/* 适用场景 */}
        <div className="mt-4 pt-4 border-t border-neutral-200">
          <h4 className="text-sm font-medium text-neutral-700 mb-2">适用场景：</h4>
          <div className="flex flex-wrap gap-2">
            {displayCharacter.useCases.map((useCase, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-white rounded-md text-xs text-neutral-700 border border-neutral-200"
              >
                {useCase}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 角色选择网格 */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-neutral-700 mb-3">
          选择你的角色：
        </h4>
        <div className="grid grid-cols-4 sm:grid-cols-8 gap-4">
          {characters.map(character => (
            <button
              key={character.id}
              onClick={() => onSelect(character.id)}
              onMouseEnter={() => setHoveredId(character.id)}
              onMouseLeave={() => setHoveredId(null)}
              className={cn(
                'flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-200',
                'hover:scale-110 hover:shadow-lg',
                selectedCharacter === character.id
                  ? 'bg-white shadow-lg ring-2'
                  : 'bg-neutral-50 hover:bg-white'
              )}
              style={{
                ringColor:
                  selectedCharacter === character.id
                    ? character.visual.primaryColor
                    : 'transparent',
              }}
            >
              <Avatar
                theme="westworld"
                westworldCharacter={character.id}
                size="lg"
                iconStatus={
                  selectedCharacter === character.id
                    ? 'active'
                    : hoveredId === character.id
                    ? 'default'
                    : 'default'
                }
              />
              <span className="text-xs font-medium text-neutral-700 text-center">
                {character.name}
              </span>
              <span className="text-[10px] text-neutral-500">{character.role}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 确认按钮 */}
      {onConfirm && selectedCharacter && (
        <div className="flex justify-end">
          <Button
            onClick={onConfirm}
            style={{
              backgroundColor: getCharacter(selectedCharacter).visual.primaryColor,
            }}
          >
            确认选择 {getCharacter(selectedCharacter).name}
          </Button>
        </div>
      )}
    </div>
  );
}

/**
 * 简化版角色选择器（用于对话框等小空间）
 */
interface CompactCharacterSelectorProps {
  selectedCharacter?: WestworldCharacterId;
  onSelect: (characterId: WestworldCharacterId) => void;
  className?: string;
}

export function CompactCharacterSelector({
  selectedCharacter,
  onSelect,
  className,
}: CompactCharacterSelectorProps) {
  const characters = getAllCharacters();

  return (
    <div className={cn('flex flex-wrap gap-3', className)}>
      {characters.map(character => (
        <button
          key={character.id}
          onClick={() => onSelect(character.id)}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
            'hover:scale-105',
            selectedCharacter === character.id
              ? 'bg-white shadow-md ring-2'
              : 'bg-neutral-50 hover:bg-white'
          )}
          style={{
            ringColor:
              selectedCharacter === character.id
                ? character.visual.primaryColor
                : 'transparent',
          }}
        >
          <Avatar
            theme="westworld"
            westworldCharacter={character.id}
            size="sm"
            iconStatus={selectedCharacter === character.id ? 'active' : 'default'}
          />
          <div className="text-left">
            <div className="text-sm font-medium text-neutral-900">
              {character.name}
            </div>
            <div className="text-xs text-neutral-500">{character.role}</div>
          </div>
        </button>
      ))}
    </div>
  );
}
